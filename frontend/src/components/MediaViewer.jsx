import React from 'react';
import { Image, Video, Music, FileText, Download } from 'lucide-react';

export const MediaViewer = ({ mediaUrl, mediaType }) => {
  if (!mediaUrl) return null;

  const fullUrl = mediaUrl.startsWith('http') ? mediaUrl : `http://localhost:8080${mediaUrl}`;

  return (
    <div style={{ margin: '1rem 0', padding: '0.75rem', background: '#f8fafc', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
      {mediaType === 'IMAGE' && (
        <div style={{ textAlign: 'center' }}>
          <img
            src={fullUrl}
            alt="Question attachment"
            style={{ maxWidth: '100%', maxHeight: '350px', borderRadius: '8px', objectFit: 'contain' }}
          />
        </div>
      )}

      {mediaType === 'VIDEO' && (
        <div style={{ textAlign: 'center' }}>
          <video controls style={{ maxWidth: '100%', maxHeight: '350px', borderRadius: '8px' }}>
            <source src={fullUrl} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {mediaType === 'AUDIO' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Music size={24} color="var(--primary)" />
          <audio controls style={{ width: '100%' }}>
            <source src={fullUrl} />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {mediaType === 'FILE' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="var(--primary)" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Attached Document/Resource</span>
          </div>
          <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
            <Download size={14} /> Download File
          </a>
        </div>
      )}
    </div>
  );
};
