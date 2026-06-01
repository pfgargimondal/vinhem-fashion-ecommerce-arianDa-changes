import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const downloadInvoicePDF = async (invoiceId = "invoice-content") => {
  const invoiceElement = document.getElementById(invoiceId);
  if (!invoiceElement) {
    console.error("Invoice element not found!");
    return;
  }

  // Wait for all images to load
  const images = Array.from(invoiceElement.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalWidth !== 0) return resolve();
          img.onload = img.onerror = () => resolve();
        })
    )
  );

  // Capture HTML
  const canvas = await html2canvas(invoiceElement, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
  });

  const imgData = canvas.toDataURL("image/png");
  if (!imgData.startsWith("data:image")) {
    console.error("Invalid image data!", imgData.slice(0, 50));
    return;
  }

  // Create PDF
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  // Add the image safely
  try {
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
  } catch (err) {
    console.error("PDF generation failed:", err);
  }
};
