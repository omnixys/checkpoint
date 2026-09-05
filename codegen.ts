import type { CodegenConfig } from "@graphql-codegen/cli";
import { toolingEnv } from "./tooling/env";
import {
  buildClientSchema,
  getIntrospectionQuery,
  parse,
  printSchema,
  type DocumentNode,
  type IntrospectionQuery,
} from "graphql";
import { readFile } from "node:fs/promises";
const schemaEndpoint = toolingEnv.BACKEND_SERVER_URL;

const generatedTypeConfig = {
  /**
   * Enforces strict typing across the entire schema.
   */
  avoidOptionals: true,

  /**
   * Generate runtime enums so UI and service integration code do not rely on
   * string literals for GraphQL enum values.
   */
  enumsAsTypes: false,
  namingConvention: {
    enumValues: "keep",
  },

  /**
   * Explicit null handling instead of undefined.
   */
  maybeValue: "T | null",

  /**
   * Backend DateTime values are transported as ISO strings.
   */
  scalars: {
    DateTime: {
      input: "string",
      output: "string",
    },
  },

  /**
   * Required for Apollo cache normalization.
   */
  nonOptionalTypename: true,

  /**
   * Uses `import type` to avoid runtime overhead.
   */
  useTypeImports: true,

  /**
   * Simplifies generated types and removes unnecessary wrappers.
   */
  preResolveTypes: true,

  /**
   * Ensures operations are strongly typed and safer.
   */
  dedupeFragments: true,
};

type IntrospectionDirective = {
  locations?: unknown;
};

type IntrospectionResponseBody = {
  data?: {
    __schema?: {
      directives?: IntrospectionDirective[];
    };
  };
};

async function sanitizeIntrospectionFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(input, init);
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return response;
  }

  let body: IntrospectionResponseBody;

  try {
    body = (await response.clone().json()) as IntrospectionResponseBody;
  } catch {
    return response;
  }

  const directives = body.data?.__schema?.directives;
  let changed = false;

  if (Array.isArray(directives)) {
    for (const directive of directives) {
      if (!Array.isArray(directive.locations)) {
        continue;
      }

      const locations = directive.locations.filter(
        (location) => location !== "DIRECTIVE_DEFINITION",
      );

      if (locations.length !== directive.locations.length) {
        directive.locations = locations;
        changed = true;
      }
    }
  }

  if (!changed) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set("content-type", "application/json");
  headers.delete("content-length");

  return new Response(JSON.stringify(body), {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

async function loadSanitizedSchemaDocument(pointer: string): Promise<DocumentNode> {
  if (process.env.CODEGEN_OFFLINE === "true") {
    const cached = JSON.parse(
      await readFile(new URL("./src/generated/introspection.json", import.meta.url), "utf8"),
    ) as IntrospectionQuery;
    return parse(printSchema(buildClientSchema(cached)));
  }
  const response = await sanitizeIntrospectionFetch(pointer, {
    body: JSON.stringify({ query: getIntrospectionQuery() }),
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Failed to load GraphQL schema from ${pointer}: ${response.status}`);
  }

  const body = (await response.json()) as IntrospectionResponseBody;

  if (!body.data) {
    throw new Error(`GraphQL introspection response from ${pointer} did not include data`);
  }

  const schema = buildClientSchema(body.data as IntrospectionQuery);

  return parse(printSchema(schema));
}

/**
 * GraphQL Code Generator configuration (STRICT .graphql ONLY).
 *
 * This configuration enforces:
 * - Separation of concerns (operations live in .graphql files)
 * - Strong typing via TypeScript
 * - Apollo Client compatibility
 * - Production-ready defaults
 *
 * Important:
 * - No inline gql usage in TS/TSX is supported by design
 * - All operations MUST exist as .graphql files
 */
const config: CodegenConfig = {
  /**
   * Schema source (environment-aware).
   *
   * Always configurable via env for multi-environment setups.
   */
  schema: [
    {
      [schemaEndpoint]: {
        loader: loadSanitizedSchemaDocument,
        customFetch: sanitizeIntrospectionFetch,
      },
    },
    "src/graphql/support-subscriptions.schema.graphql",
    ...(process.env.CODEGEN_OFFLINE === "true"
      ? ["src/graphql/guest-confirmation.overlay.schema.graphql"]
      : []),
  ],

  /**
   * ONLY .graphql documents.
   *
   * This enforces a clean architecture where:
   * - Queries, mutations, subscriptions are decoupled from UI
   */
  documents: ["src/**/*.graphql", "!src/**/*.schema.graphql"],

  generates: {
    /**
     * Shared schema TypeScript output.
     */
    "src/generated/schema.ts": {
      plugins: ["typescript"],
      config: generatedTypeConfig,
    },

    /**
     * Main generated TypeScript output.
     */
    "src/generated/graphql.ts": {
      plugins: [
        {
          add: {
            content: 'export * from "./schema";',
          },
        },
        {
          "typescript-operations": {
            importSchemaTypesFrom: "src/generated/schema",
            namespacedImportName: "Types",
          },
        },
        "typed-document-node",
      ],
      config: generatedTypeConfig,
    },

    /**
     * Optional but recommended for advanced Apollo cache handling.
     */
    "src/generated/introspection.json": {
      plugins: ["introspection"],
    },
  },

  /**
   * Prevents CI/CD failures when no documents exist yet.
   */
  ignoreNoDocuments: true,

  /**
   * Helpful for debugging codegen issues.
   */
  verbose: true,
};

export default config;
