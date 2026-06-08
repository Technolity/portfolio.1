import React, { useEffect, useRef, useMemo } from 'react';
import { repelManager } from '../../utils/repelManager';

/* ============================================================
   REPEL TEXT
   Registers with the singleton repelManager so there is only
   ONE snakemove listener and ONE RAF loop for the entire page.
   Char positions are cached as page-absolute coordinates and
   only recalculated on mount + resize — NOT every frame.
   ============================================================ */

/* Recursively flatten any React node tree to a plain string */
const flattenChildren = (node) => {
  if (node == null) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(flattenChildren).join('');
  if (node.props && node.props.children != null) {
    return flattenChildren(node.props.children);
  }
  return '';
};

const RepelText = ({ children, as: Tag = 'span', className, style }) => {
  const containerRef = useRef(null);
  const charRefs     = useRef([]);
  const instanceRef  = useRef(null);

  /* Split into tokens, keeping whitespace runs as their own tokens. Words are
     rendered as unbreakable inline-block groups so the browser only breaks at
     the real spaces BETWEEN words — never mid-word (e.g. "Ba | ckend"). Each
     non-space character still gets its own ref for the repel effect. */
  const tokens = useMemo(() => {
    return flattenChildren(children).split(/(\s+)/).filter((t) => t !== '');
  }, [children]);

  /* Keep ref array in sync with current (non-space) char count */
  const charCount = useMemo(
    () => tokens.reduce((n, t) => (/^\s+$/.test(t) ? n : n + t.length), 0),
    [tokens]
  );
  charRefs.current = charRefs.current.slice(0, charCount);

  /* Create / destroy the managed instance */
  useEffect(() => {
    const inst = repelManager.createInstance();
    instanceRef.current = inst;
    return () => {
      repelManager.destroyInstance(inst);
    };
  }, []);

  /* Push latest DOM refs into the instance after every commit */
  useEffect(() => {
    const inst = instanceRef.current;
    if (!inst) return;
    inst.setContainer(containerRef.current);
    inst.setChars(charRefs.current.filter(Boolean));
  });

  let charIndex = 0;
  return (
    <Tag ref={containerRef} className={className} style={style}>
      {tokens.map((token, ti) => {
        /* Whitespace run -> a single real space: the only place a line may break */
        if (/^\s+$/.test(token)) {
          return ' ';
        }
        /* Word -> unbreakable group of per-char spans */
        return (
          <span
            key={ti}
            style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
          >
            {token.split('').map((char) => {
              const idx = charIndex++;
              return (
                <span
                  key={idx}
                  ref={(el) => { charRefs.current[idx] = el; }}
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
};

export default RepelText;
