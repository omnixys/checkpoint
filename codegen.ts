import type { CodegenConfig } from "@graphql-codegen/cli";

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
  schema:
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "http://localhost:8000/graphql",

  /**
   * ONLY .graphql documents.
   *
   * This enforces a clean architecture where:
   * - Queries, mutations, subscriptions are decoupled from UI
   */
  documents: ["src/**/*.graphql"],

  generates: {
    /**
     * Main generated TypeScript output.
     */
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
      config: {
        /**
         * Enforces strict typing across the entire schema.
         */
        avoidOptionals: true,

        /**
         * Use string unions instead of enums for better DX and no runtime cost.
         */
        enumsAsTypes: true,

        /**
         * Explicit null handling instead of undefined.
         */
        maybeValue: "T | null",

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
      },
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
