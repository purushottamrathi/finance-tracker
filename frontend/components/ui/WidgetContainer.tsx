import React from 'react';

export default function WidgetContainer({ title, children, small }: { title?: string; children: React.ReactNode; small?: boolean }){
  return (
    <div className={`p-4 bg-white rounded-lg shadow-sm ${small? 'text-sm':''}`}>
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
