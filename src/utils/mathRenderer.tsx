import React from 'react';
import katex from 'katex';

/**
 * Safely renders LaTeX string via KaTeX.
 * Falls back to styled HTML if KaTeX encounters an error.
 */
export const renderKaTeX = (rawTex: string, displayMode: boolean = false): React.ReactNode => {
  // Sanitize double-escaped backslashes commonly introduced in JSON / template literals
  const sanitizedTex = rawTex
    .replace(/\\\\text\{/g, '\\text{')
    .replace(/\\\\le/g, '\\le')
    .replace(/\\\\ge/g, '\\ge')
    .replace(/\\\\in/g, '\\in')
    .replace(/\\\\forall/g, '\\forall')
    .replace(/\\\\exists/g, '\\exists')
    .replace(/\\\\alpha/g, '\\alpha')
    .replace(/\\\\beta/g, '\\beta')
    .replace(/\\\\gamma/g, '\\gamma')
    .replace(/\\\\sum/g, '\\sum')
    .replace(/\\\\prod/g, '\\prod')
    .replace(/\\\\cdot/g, '\\cdot')
    .replace(/\\\\times/g, '\\times')
    .replace(/\\\\approx/g, '\\approx')
    .replace(/\\\\neq/g, '\\neq')
    .replace(/\\\\frac/g, '\\frac')
    .replace(/\\\\sqrt/g, '\\sqrt')
    .replace(/\\\\infty/g, '\\infty')
    .replace(/\\\\/g, '\\')
    .trim();

  try {
    const html = katex.renderToString(sanitizedTex, {
      throwOnError: false,
      displayMode,
      output: 'htmlAndMathml'
    });

    return (
      <span
        className={displayMode ? 'mantiq-math-block' : 'mantiq-math-inline'}
        style={{
          display: displayMode ? 'block' : 'inline-block',
          margin: displayMode ? '14px 0' : '0 2px',
          textAlign: displayMode ? 'center' : 'inherit',
          verticalAlign: displayMode ? 'middle' : '-0.15em'
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    // Smart fallback: replace \text{...} and subscripts
    const cleanFallback = sanitizedTex
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/_(\d+)/g, '_{$1}');

    return (
      <span
        style={{
          fontFamily: 'KaTeX_Math, "Times New Roman", Times, serif',
          fontStyle: 'italic',
          color: 'var(--quest-text-primary)',
          padding: '0 2px'
        }}
      >
        {cleanFallback}
      </span>
    );
  }
};

/**
 * Parses inline formatting:
 * - $$math$$ (display math)
 * - $math$ (inline math)
 * - **bold**
 * - *italic*
 * - `code`
 * - raw \text{...} or LaTeX symbols
 */
export const renderInlineMathAndStyles = (text: string): React.ReactNode => {
  if (!text) return null;

  // First handle any raw \text{...} that might be outside dollar signs by wrapping it
  const preprocessed = text.replace(/(?<!\$)\\text\{([^}]+)\}(?!\$)/g, '$\\text{$1}$');

  // Split by $$...$$, $...$, **...**, `...`, *...*
  const tokenRegex = /(\$\$[^\$]+\$\$|\$[^\$]+\$|\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const parts = preprocessed.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Display math $$ ... $$
    if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
      const tex = part.slice(2, -2);
      return <React.Fragment key={index}>{renderKaTeX(tex, true)}</React.Fragment>;
    }

    // Inline math $ ... $
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      const tex = part.slice(1, -1);
      return <React.Fragment key={index}>{renderKaTeX(tex, false)}</React.Fragment>;
    }

    // Bold ** ... **
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} style={{ fontWeight: 800, color: 'var(--quest-text-primary)' }}>
          {renderInlineMathAndStyles(part.slice(2, -2))}
        </strong>
      );
    }

    // Code ` ... `
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={index}
          style={{
            background: 'var(--quest-surface-subtle)',
            padding: '2px 7px',
            borderRadius: '6px',
            fontFamily: 'monospace',
            fontSize: '13.5px',
            color: 'var(--quest-accent-text)',
            border: '1px solid var(--quest-border)'
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Italic * ... *
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2 && !part.startsWith('**')) {
      return (
        <em key={index} style={{ fontStyle: 'italic', color: 'var(--quest-text-primary)' }}>
          {part.slice(1, -1)}
        </em>
      );
    }

    // Check for raw subscripts like s_0 or h_1 or f(n) outside math
    if (part.includes('_')) {
      const subParts = part.split(/([a-zA-Z]_\d+)/g);
      if (subParts.length > 1) {
        return (
          <React.Fragment key={index}>
            {subParts.map((sp, spi) => {
              if (sp.match(/^[a-zA-Z]_\d+$/)) {
                return <React.Fragment key={spi}>{renderKaTeX(sp, false)}</React.Fragment>;
              }
              return sp;
            })}
          </React.Fragment>
        );
      }
    }

    return part;
  });
};

interface NumberedItem {
  number: string;
  titleAndDesc: string;
  examples: string[];
}

/**
 * University-grade Markdown parser:
 * - Proper numbered lists with elegant cards & step counters (e.g., 5 components of search problem)
 * - Sub-bullets / examples styled with distinct example pills
 * - Headings, Blockquotes, Academic Tables, Code Blocks, and pristine KaTeX math formulas.
 */
export const renderUniversityMarkdown = (markdown: string): React.ReactNode => {
  const cleanText = markdown
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'");

  const rawLines = cleanText.split('\n');
  const elements: React.ReactNode[] = [];

  let i = 0;
  while (i < rawLines.length) {
    const rawLine = rawLines[i];
    const trimmed = rawLine.trim();

    // Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // 1. Academic Table
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableRows: string[][] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith('|') && rawLines[i].trim().endsWith('|')) {
        const line = rawLines[i].trim();
        const cells = line.slice(1, -1).split('|');
        if (!cells.every(c => c.trim().match(/^-+$/))) {
          tableRows.push(cells);
        }
        i++;
      }

      if (tableRows.length > 0) {
        const [headers, ...dataRows] = tableRows;
        elements.push(
          <div
            key={`table-${elements.length}`}
            style={{
              overflowX: 'auto',
              margin: '18px 0',
              borderRadius: '14px',
              border: '1px solid var(--quest-border)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#13211C', color: '#FFFFFF' }}>
                  {headers?.map((h, hIdx) => (
                    <th key={hIdx} style={{ padding: '12px 16px', fontWeight: 700, borderBottom: '1px solid var(--quest-border)' }}>
                      {renderInlineMathAndStyles(h.trim())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    style={{
                      background: rIdx % 2 === 0 ? 'var(--quest-card-bg)' : 'var(--quest-bg)',
                      borderBottom: '1px solid var(--quest-border)'
                    }}
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} style={{ padding: '12px 16px', color: 'var(--quest-text-primary)' }}>
                        {renderInlineMathAndStyles(cell.trim())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // 2. Fenced Code Block ``` ... ```
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim() || 'text';
      const codeLines: string[] = [];
      i++;
      while (i < rawLines.length && !rawLines[i].trim().startsWith('```')) {
        codeLines.push(rawLines[i]);
        i++;
      }
      if (i < rawLines.length && rawLines[i].trim().startsWith('```')) {
        i++; // skip closing ```
      }

      elements.push(
        <div
          key={`code-${elements.length}`}
          style={{
            margin: '16px 0',
            borderRadius: '12px',
            background: '#1A2421',
            color: '#E0EDE5',
            padding: '16px 20px',
            fontFamily: 'monospace',
            fontSize: '13.5px',
            overflowX: 'auto',
            border: '1px solid #2B3D37'
          }}
        >
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--quest-accent)', fontWeight: 700, marginBottom: '8px' }}>
            {lang}
          </div>
          <pre style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre' }}>
            {codeLines.join('\n')}
          </pre>
        </div>
      );
      continue;
    }

    // 3. Headings
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          style={{
            fontFamily: 'var(--quest-font-heading)',
            fontSize: '19px',
            fontWeight: 800,
            margin: '24px 0 10px 0',
            color: 'var(--quest-text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {renderInlineMathAndStyles(trimmed.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          style={{
            fontFamily: 'var(--quest-font-heading)',
            fontSize: '23px',
            fontWeight: 800,
            margin: '28px 0 12px 0',
            color: 'var(--quest-text-primary)',
            borderBottom: '1px solid var(--quest-border)',
            paddingBottom: '8px'
          }}
        >
          {renderInlineMathAndStyles(trimmed.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    // 4. Blockquotes (> ...)
    if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote
          key={`bq-${elements.length}`}
          style={{
            margin: '16px 0',
            padding: '14px 20px',
            borderLeft: '4px solid var(--quest-accent)',
            background: 'var(--quest-surface-subtle)',
            borderRadius: '0 14px 14px 0',
            color: 'var(--quest-text-primary)',
            fontSize: '15px',
            lineHeight: 1.6
          }}
        >
          {renderInlineMathAndStyles(trimmed.slice(2))}
        </blockquote>
      );
      i++;
      continue;
    }

    // 5. Numbered List with potential nested examples (e.g. 1. **Initial State** ... \n   - Example: ...)
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      const items: NumberedItem[] = [];

      while (i < rawLines.length) {
        const curTrimmed = rawLines[i].trim();
        const m = curTrimmed.match(/^(\d+)\.\s+(.*)/);

        if (m) {
          const item: NumberedItem = {
            number: m[1],
            titleAndDesc: m[2],
            examples: []
          };
          i++;

          // Check for indented example bullets following this item
          while (i < rawLines.length) {
            const nextTrimmed = rawLines[i].trim();
            if (nextTrimmed.match(/^(\d+)\.\s+/)) {
              // next numbered item, break back to outer loop
              break;
            }
            if (nextTrimmed.startsWith('- ') || nextTrimmed.startsWith('* ')) {
              item.examples.push(nextTrimmed.slice(2));
              i++;
            } else if (rawLines[i].startsWith('   ') && nextTrimmed.length > 0) {
              item.examples.push(nextTrimmed);
              i++;
            } else {
              break;
            }
          }

          items.push(item);
        } else {
          break;
        }
      }

      // Render items as sleek, university-grade cards
      elements.push(
        <div
          key={`numbered-list-${elements.length}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            margin: '16px 0'
          }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--quest-card-bg)',
                borderRadius: '14px',
                border: '1px solid var(--quest-border)',
                padding: '14px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'border-color 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '8px',
                    background: '#13211C',
                    color: '#EAF6C9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 800,
                    flexShrink: 0,
                    marginTop: '1px'
                  }}
                >
                  {item.number}
                </span>
                <div style={{ fontSize: '15px', color: 'var(--quest-text-primary)', lineHeight: 1.6, flex: 1 }}>
                  {renderInlineMathAndStyles(item.titleAndDesc)}
                </div>
              </div>

              {item.examples.length > 0 && (
                <div
                  style={{
                    marginLeft: '38px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  {item.examples.map((ex, eIdx) => (
                    <div
                      key={eIdx}
                      style={{
                        background: 'var(--quest-bg)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--quest-border)',
                        fontSize: '13.5px',
                        color: 'var(--quest-text-secondary)',
                        lineHeight: 1.5,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          background: 'var(--quest-light-tint)',
                          color: 'var(--quest-light-tint-text)',
                          border: '1px solid var(--quest-border)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}
                      >
                        Example
                      </span>
                      <span style={{ color: 'var(--quest-text-primary)' }}>
                        {renderInlineMathAndStyles(ex.replace(/^(Example|Note):\s*/i, ''))}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      );
      continue;
    }

    // 6. Unordered Bullets
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const bullets: string[] = [];
      while (i < rawLines.length && (rawLines[i].trim().startsWith('- ') || rawLines[i].trim().startsWith('* '))) {
        bullets.push(rawLines[i].trim().slice(2));
        i++;
      }

      elements.push(
        <ul
          key={`ul-${elements.length}`}
          style={{
            paddingLeft: '20px',
            margin: '12px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {bullets.map((b, bIdx) => (
            <li key={bIdx} style={{ color: 'var(--quest-text-primary)', fontSize: '15px', lineHeight: 1.6 }}>
              {renderInlineMathAndStyles(b)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 7. Regular paragraph
    elements.push(
      <p
        key={`p-${elements.length}`}
        style={{
          margin: '10px 0',
          fontSize: '15px',
          lineHeight: 1.7,
          color: 'var(--quest-text-primary)'
        }}
      >
        {renderInlineMathAndStyles(trimmed)}
      </p>
    );
    i++;
  }

  return (
    <div className="mantiq-markdown-body" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {elements}
    </div>
  );
};
