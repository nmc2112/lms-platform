// components/PdfViewer.jsx
"use client";
const SlideForm = ({ url }) => {
  return (
      <iframe height={800} src={url}/>
  );
};
export default SlideForm;
