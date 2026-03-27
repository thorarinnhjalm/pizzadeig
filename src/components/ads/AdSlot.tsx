import React from 'react';

interface AdSlotProps {
  placement: string;
  format: string;
  className?: string;
  fallbackText?: string;
}

export function AdSlot({ placement, format, className = '', fallbackText }: AdSlotProps) {
  return (
    <div className={`flex items-center justify-center bg-muted text-muted-foreground border-dashed border-2 rounded-md ${className}`}>
      <span className="text-sm text-center px-4">
        {fallbackText || `Ad: ${format} (${placement})`}
      </span>
    </div>
  );
}
