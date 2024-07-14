// components/PdfViewer.jsx
"use client";
import { Lock } from "lucide-react";

interface SlideFormProps {
  url: any;
  isLocked: boolean;
}

const SlideForm = ({ url, isLocked }: SlideFormProps) => {
  if (isLocked) {
    return (
      <div className="relative p-4 border rounded aspect-video">
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This content is locked</p>
        </div>
      </div>
    ); // Render a message if isLocked is true
  }
  return (
    <iframe height={800} src={url} />
  );
};

export default SlideForm;
