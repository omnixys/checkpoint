export async function uploadFile(file: File): Promise<string> {
  // 1. ask backend for presigned URL
  const res = await fetch(
    `/api/storage/upload-url?filename=${encodeURIComponent(file.name)}&type=${encodeURIComponent(file.type)}`,
  );

  const { uploadUrl, fileUrl } = await res.json();

  // 2. upload directly to S3 / MinIO
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("Upload failed");
  }

  // 3. return public URL
  return fileUrl;
}

// REPLACE

// const handleCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (!file) return;

//   const url = await uploadFile(file);

//   updateSetting("coverImageUrl", url);
// };

// await prisma.media.create({
//   data: {
//     url,
//     mimeType: file.type,
//     size: file.size,
//   },
// });

// if (!file.type.startsWith("image/")) throw new Error("Invalid file");
// if (file.size > 5_000_000) throw new Error("Too large");

export async function uploadAndRegister(file: File, eventId?: string) {
  // 1. presigned URL holen
  const res = await fetch(
    `/api/storage/upload-url?filename=${file.name}&type=${file.type}`,
  );

  const { uploadUrl, fileUrl, key } = await res.json();

  // 2. direkt hochladen
  await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  // 3. im Backend registrieren
  const mediaRes = await fetch("/api/media", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: file.name,
      mimetype: file.type,
      key,
      url: fileUrl,
      size: file.size,
      eventId,
    }),
  });

  return mediaRes.json();
}

//Cache-Control: public, max-age=31536000, immutable