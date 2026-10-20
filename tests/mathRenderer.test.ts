import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderKaTeX, renderInlineMathAndStyles } from '../src/utils/mathRenderer';

describe('mathRenderer', () => {
  describe('renderKaTeX', () => {
    it('renders inline math with KaTeX', () => {
      const node = renderKaTeX('f(n) = g(n) + h(n)', false);
      expect(React.isValidElement(node)).toBe(true);
      if (React.isValidElement(node)) {
        expect(node.props.className).toBe('mantiq-math-inline');
        expect(node.props.dangerouslySetInnerHTML?.__html).toContain('katex');
      }
    });

    it('renders display block math with KaTeX', () => {
      const node = renderKaTeX('\\sum_{i=1}^{n} x_i', true);
      expect(React.isValidElement(node)).toBe(true);
      if (React.isValidElement(node)) {
        expect(node.props.className).toBe('mantiq-math-block');
        expect(node.props.dangerouslySetInnerHTML?.__html).toContain('katex-display');
      }
    });

    it('sanitizes double-escaped backslashes before rendering', () => {
      const doubleEscaped = '\\\\frac{1}{2}';
      const node = renderKaTeX(doubleEscaped, false);
      expect(React.isValidElement(node)).toBe(true);
      if (React.isValidElement(node)) {
        expect(node.props.dangerouslySetInnerHTML?.__html).toContain('katex');
      }
    });
  });

  describe('renderInlineMathAndStyles', () => {
    it('returns null for empty string', () => {
      expect(renderInlineMathAndStyles('')).toBeNull();
    });

    it('renders inline text without formatting as plain text', () => {
      const result = renderInlineMathAndStyles('AIMA Chapter 1');
      expect(result).toBeDefined();
    });

    it('parses inline math ($...$) into KaTeX nodes', () => {
      const result = renderInlineMathAndStyles('Cost is $g(n)$ and heuristic is $h(n)$.');
      expect(Array.isArray(result)).toBe(true);
    });

    it('parses bold text (**text**)', () => {
      const result = renderInlineMathAndStyles('This is **critical** concept.');
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        const hasStrong = result.some((el) => React.isValidElement(el) && el.type === 'strong');
        expect(hasStrong).toBe(true);
      }
    });

    it('parses inline code (`code`)', () => {
      const result = renderInlineMathAndStyles('Run `git status` here.');
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        const hasCode = result.some((el) => React.isValidElement(el) && el.type === 'code');
        expect(hasCode).toBe(true);
      }
    });
  });
});
