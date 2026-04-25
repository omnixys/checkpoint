"use client";

import { useCallback, useState } from "react";

type UploadUrlResponse = {
  uploadUrl: string;
  fileUrl: string;
};

type UploadResult = {
  url: string;
};

export function useUploadMedia(eventId: string) {
  const [loading, setLoading] = useState(false);

  const upload = useCallback(
    async (file: File): Promise<UploadResult> => {
      setLoading(true);

      try {
        /**
         * -----------------------------------------------------
         * STEP 1: Request presigned URL
         * -----------------------------------------------------
         */
        const res = await fetch(
          `/api/media/presign?eventId=${eventId}&filename=${file.name}&type=${file.type}`,
          {
            method: "GET",
          },
        );

        if (!res.ok) {
          throw new Error("Failed to get upload URL");
        }

        const data: UploadUrlResponse = await res.json();

        /**
         * -----------------------------------------------------
         * STEP 2: Upload to MinIO / S3 directly
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
          throw new Error("Upload failed");
        }

        /**
         * -----------------------------------------------------
         * STEP 3: Notify backend (optional but recommended)
         * -----------------------------------------------------
         */
        await fetch("/api/media/complete", {
          method: "POST",
          body: JSON.stringify({
            url: data.fileUrl,
            filename: file.name,
            eventId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        return {
          url: data.fileUrl,
        };
      } finally {
        setLoading(false);
      }
    },
    [eventId],
  );

  return {
    upload,
    loading,
  };
}
