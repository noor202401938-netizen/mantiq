import React from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Download, BookOpen, AlertCircle } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  author: string;
  pdfUrl: string;
  initialPage?: number;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  title,
  author,
  pdfUrl,
  initialPage = 1,
}) => {
  // Normalize PDF path for both custom root domains and GitHub Pages subpaths
  const normalizedPdfUrl = pdfUrl.startsWith('http')
    ? pdfUrl
    : (import.meta.env.BASE_URL + pdfUrl.replace(/^\/+/, '')).replace(/\/+/g, '/');
  const directUrlWithPage = initialPage > 1 ? `${normalizedPdfUrl}#page=${initialPage}` : normalizedPdfUrl;

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(10, 18, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1240px',
          height: '92vh',
          background: '#1E2922',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          zIndex: 100000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '14px 22px',
            background: '#13211C',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#EAF6C9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <BookOpen size={20} color="#13211C" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </div>
              <div style={{ fontSize: '12px', color: '#A3B899', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{author}</span>
                {initialPage > 1 && (
                  <>
                    <span>·</span>
                    <span style={{ color: '#C9F26B', fontWeight: 700 }}>Starting Page ~{initialPage}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Open in full new tab */}
            <a
              href={directUrlWithPage}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFX.playClick()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              title="Open full PDF in native browser tab"
            >
              <ExternalLink size={14} />
              <span>Full Tab</span>
            </a>

            {/* Direct Download */}
            <a
              href={normalizedPdfUrl}
              download
              onClick={() => soundFX.playClick()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              title="Save copy of PDF"
            >
              <Download size={14} />
              <span>Download</span>
            </a>

            {/* Close */}
            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginLeft: '4px',
                transition: 'background 0.15s ease',
              }}
              title="Close PDF Viewer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PDF Frame */}
        <div style={{ flex: 1, position: 'relative', background: '#2E3832', minHeight: 0 }}>
          <iframe
            src={directUrlWithPage}
            title={title}
            width="100%"
            height="100%"
            style={{ border: 'none', display: 'block', width: '100%', height: '100%', background: '#525659' }}
          />

          {/* Non-intrusive fallback notice at the bottom if embedded viewer is blocked by browser extensions */}
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(19, 33, 28, 0.95)',
              color: '#FFFFFF',
              padding: '7px 18px',
              borderRadius: '20px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 18px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.15)',
              pointerEvents: 'auto',
            }}
          >
            <AlertCircle size={14} color="#C9F26B" />
            <span>If PDF preview is blocked by browser security,</span>
            <a
              href={directUrlWithPage}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#C9F26B', fontWeight: 800, textDecoration: 'underline' }}
            >
              click here to view in a tab
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
