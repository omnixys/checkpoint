"use client";

import { MediaType } from "@/checkpoint/generated/graphql";
import { env } from "@/checkpoint/lib/env";
import { useCallback, useState } from "react";

type UploadResult2 = {
  id: string;
  url: string;
};

type UploadResult = {
  url: string;
  key: string;
};

type PresignedResponse = {
  key: string;
  uploadUrl: string;
  fileUrl: string;
};

const eventApi = env.EVENT_API;

export function useUploadMedia() {
  const [loading, setLoading] = useState(false);

  const upload2 = useCallback(
    async (eventId: string, file: File): Promise<UploadResult2> => {
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(
          `${eventApi}/upload?eventId=${eventId}`,
          {
            method: "POST",
            body: formData,
            credentials: "include", // 🔥 wegen CookieAuthGuard
          },
        );

        if (!res.ok) {
          throw new Error("Upload failed");
        }

        return await res.json();
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const upload = useCallback(
    async (
      eventId: string,
      file: File,
      type: MediaType,
    ): Promise<UploadResult> => {
      setLoading(true);

      try {
        /**
         * -----------------------------------------------------
         * STEP 1: GET PRESIGNED URL
         * -----------------------------------------------------
         */
        const res = await fetch(
          `${eventApi}/presigned-url?eventId=${eventId}&filename=${encodeURIComponent(file.name)}&type=${file.type}`,
          {
            credentials: "include",
          },
        );

        if (!res.ok) {
          throw new Error("Failed to get presigned URL");
        }

        const data: PresignedResponse = await res.json();

        /**
         * -----------------------------------------------------
         * STEP 2: UPLOAD DIRECT TO MINIO
         * -----------------------------------------------------
         */
        const uploadRes = await fetch(data.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!uploadRes.ok) {
          throw new Error("Upload to storage failed");
        }

        /**
         * -----------------------------------------------------
         * STEP 3: COMPLETE
         * -----------------------------------------------------
         */
        const completeRes = await fetch(
          `${eventApi}/complete`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key: data.key,
              url: data.fileUrl,
              filename: file.name,
              mimetype: file.type,
              size: file.size,
              eventId,
              type,
            }),
          },
        );

        if (!completeRes.ok) {
          throw new Error("Complete upload failed");
        }

        return {
          url: data.fileUrl,
          key: data.key,
        };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { upload, loading };
}
