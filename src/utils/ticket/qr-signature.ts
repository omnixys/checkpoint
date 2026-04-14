"use client";

/**
 * Signs a QR token using the device private key.
 *
 * IMPORTANT:
 * - Must match backend verification logic EXACTLY
 * - message = `${token}.${deviceId}`
 *
 * Backend:
 * verifySignature(message, signature, publicKey)
 */
export async function signQrToken(
  token: string,
  deviceId: string,
  privateKeyBase64: string,
): Promise<string> {
  const message = `${token}.${deviceId}`;

  /**
   * Convert base64 PKCS8 → ArrayBuffer
   */
  const keyBuffer = Uint8Array.from(atob(privateKeyBase64), (c) => c.charCodeAt(0));

  /**
   * Import key into WebCrypto
   */
  const cryptoKey = await window.crypto.subtle.importKey(
    "pkcs8",
    keyBuffer,
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    false,
    ["sign"],
  );

  /**
   * Sign message
   */
  const signatureBuffer = await window.crypto.subtle.sign(
    {
      name: "ECDSA",
      hash: "SHA-256",
    },
    cryptoKey,
    new TextEncoder().encode(message),
  );

  /**
   * Convert signature → base64
   */
  return btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
}

export async function signQrMessage(params: {
  token: string;
  deviceId: string | null;
  privateKey: CryptoKey;
}): Promise<string> {
  const { token, deviceId, privateKey } = params;

  const message = `${token}.${deviceId}`;
  const encoded = new TextEncoder().encode(message);

  const signature = await window.crypto.subtle.sign(
    {
      name: "ECDSA",
      hash: "SHA-256",
    },
    privateKey, // ✅ DIRECT USE (NO importKey)
    encoded,
  );

  return arrayBufferToBase64(signature);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return window.btoa(binary);
}
