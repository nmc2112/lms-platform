import React from 'react';
import { Lock } from "lucide-react";

interface HtmlRendererProps {
  content: string | null;
  isLocked: boolean
}

const HtmlRenderer: React.FC<HtmlRendererProps> = ({ content, isLocked }) => {
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
    <div className="p-4">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default HtmlRenderer;
