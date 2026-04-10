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

  const chars = useMemo(() => {
    return flattenChildren(children).split('');
  }, [children]);

  /* Keep ref array in sync with current chars length */
  charRefs.current = charRefs.current.slice(0, chars.length);

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

  return (
    <Tag ref={containerRef} className={className} style={style}>
      {chars.map((char, i) => (
        <span
          key={i}
          ref={(el) => { charRefs.current[i] = el; }}
          style={{ display: 'inline-block' }}
          aria-hidden={char === ' ' ? 'true' : undefined}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Tag>
  );
};

export default RepelText;
