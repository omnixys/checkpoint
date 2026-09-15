import html2canvas from "html2canvas";
import jsPdf from "jspdf";

export type PdfDelivery = "download" | "new-tab";

export const GUEST_CREDENTIALS_FILENAME = "guest-credentials.pdf";

export function isCoarsePointerDevice(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.matchMedia?.("(pointer: coarse)").matches) {
    return true;
  }

  return (window.navigator.maxTouchPoints ?? 0) > 0;
}

export async function generateGuestCredentialsPdf(element: HTMLElement): Promise<Blob> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPdf({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  return pdf.output("blob");
}

export function deliverPdfBlob(blob: Blob, preferNewTab: boolean): PdfDelivery | null {
  const url = URL.createObjectURL(blob);
  const revoke = () => {
    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 60_000);
  };

  if (preferNewTab) {
    const opened = window.open(url, "_blank", "noopener");
    if (opened) {
      revoke();
      return "new-tab";
    }
    return null;
  }

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = GUEST_CREDENTIALS_FILENAME;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  revoke();

  return "download";
}
