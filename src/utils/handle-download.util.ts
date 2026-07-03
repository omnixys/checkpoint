import html2canvas from "html2canvas";
import jsPdf from "jspdf";

/**
 * Generates a PDF from a DOM element.
 *
 * WHY:
 * - Ensures reusable logic across app
 * - Decouples UI from PDF generation
 */
export async function handleDownloadFromElement(
  element: HTMLElement | null,
  filename = "guest-credentials.pdf",
): Promise<void> {
  if (!element) {
    return;
  }

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

  pdf.save(filename);
}
