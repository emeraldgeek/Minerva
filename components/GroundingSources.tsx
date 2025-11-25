import React from 'react';
import { GroundingMetadata, GroundingChunk } from '../types';
import { ExternalLink, Globe } from 'lucide-react';

interface Props {
  metadata: GroundingMetadata;
}

export const GroundingSources: React.FC<Props> = ({ metadata }) => {
  const sources = metadata.groundingChunks?.filter(c => c.web);

  if (!sources || sources.length === 0) return null;

  // De-duplicate sources by URI
  const uniqueSources = Array.from(new Map<string, GroundingChunk>(sources.map(item => [item.web!.uri, item])).values());

  return (
    <div className="mt-3 flex flex-wrap gap-2 animate-fade-in">
      {uniqueSources.map((chunk, idx) => (
        <a
          key={idx}
          href={chunk.web?.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-md-sys-color-surfaceContainer text-xs text-md-sys-color-onSurfaceVariant border border-md-sys-color-outline/20 hover:bg-md-sys-color-surfaceContainerHigh hover:border-md-sys-color-primary/50 transition-all duration-300"
        >
          <Globe className="w-3 h-3 text-md-sys-color-primary opacity-70 group-hover:opacity-100" />
          <span className="truncate max-w-[150px]">{chunk.web?.title}</span>
          <ExternalLink className="w-3 h-3 opacity-50" />
        </a>
      ))}
    </div>
  );
};