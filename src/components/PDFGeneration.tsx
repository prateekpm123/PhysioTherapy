import jsPDF from "jspdf";
import { RefObject } from "react";
import html2canvas from "html2canvas";

export const PDFGeneration = (divRef: RefObject<HTMLDivElement>) => {
  const contentRef = divRef;
  const generatePDF = async () => {
    if (contentRef.current) {
      const content = contentRef.current;
      const contentHeight = content.scrollHeight;
      const a4Height = 2290; // A4 height in pixels (96 DPI)
      const pageCount = Math.ceil(contentHeight / a4Height);

      const pdf = new jsPDF();

      for (let i = 0; i < pageCount; i++) {
        const canvas = await html2canvas(content, {
          y: i * a4Height,
          height: a4Height,
          windowHeight: contentHeight, // Important for full content capture
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.8);
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save("multi-page-content.pdf");
    }
  };
  return generatePDF();

};
