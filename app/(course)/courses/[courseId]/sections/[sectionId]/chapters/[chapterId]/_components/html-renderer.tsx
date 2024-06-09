import React from 'react';

interface HtmlRendererProps {
  content: string | null;
}

const HtmlRenderer: React.FC<HtmlRendererProps> = ({ content }) => {
  return (
    <div className="p-4">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default HtmlRenderer;
