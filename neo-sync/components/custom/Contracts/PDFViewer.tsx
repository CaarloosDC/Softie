interface PDFViewerProps {
  pdfPath: string;
}

export default function PDFViewer({ pdfPath }: PDFViewerProps) {
  return (
    <div className="h-full w-full">
      {/* Embed the PDF using an iframe */}
      <iframe
        src={pdfPath} // Dynamically use the pdfPath passed as a prop
        width="100%"
        height="100%"
      />
    </div>
  );
}
