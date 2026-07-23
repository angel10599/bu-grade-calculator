import { useCallback, useRef } from 'react';
import './Card.css';

/**
 * Generic reusable Card component.
 * Can be used as a static container or a clickable option card.
 *
 * IMPORTANT: when the card itself is clickable and may contain other
 * interactive elements (buttons, links) inside it, use as="div" (the
 * default) rather than as="button" — nesting a real <button> inside
 * another <button> is invalid HTML and breaks React hydration. When
 * as="div" and onClick is provided, this component automatically adds
 * role="button" + keyboard support so it stays accessible.
 *
 * Clickable cards also get a cursor-tracking spotlight + a subtle 3D
 * tilt, driven by CSS custom properties updated directly on the DOM
 * node (no re-renders). Both are skipped when the user has requested
 * reduced motion, and both are purely decorative (aria-hidden), so
 * keyboard/focus-visible interaction is unaffected.
 */
const prefersReducedMotion =
  typeof window !== 'undefined' && 'matchMedia' in window
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

function Card({ children, className = '', onClick, as = 'div', ...rest }) {
  const Tag = as;
  const nodeRef = useRef(null);
  const isClickable = Boolean(onClick);
  const classes = ['card', isClickable ? 'card--clickable' : '', className]
    .filter(Boolean)
    .join(' ');

  const isInteractiveDiv = isClickable && Tag !== 'button' && Tag !== 'a';

  const handleKeyDown = (e) => {
    if (!isInteractiveDiv) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(e);
    }
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isClickable || prefersReducedMotion || !nodeRef.current) return;
      const node = nodeRef.current;
      const rect = node.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      const tiltX = ((py - 50) / 50) * -3.5;
      const tiltY = ((px - 50) / 50) * 3.5;

      node.style.setProperty('--card-px', `${px}%`);
      node.style.setProperty('--card-py', `${py}%`);
      node.style.setProperty('--card-tilt-x', `${tiltX}deg`);
      node.style.setProperty('--card-tilt-y', `${tiltY}deg`);
    },
    [isClickable]
  );

  const handleMouseLeave = useCallback(() => {
    if (!isClickable || !nodeRef.current) return;
    const node = nodeRef.current;
    node.style.setProperty('--card-tilt-x', '0deg');
    node.style.setProperty('--card-tilt-y', '0deg');
  }, [isClickable]);

  const interactiveProps = isInteractiveDiv
    ? { role: 'button', tabIndex: 0, onKeyDown: handleKeyDown }
    : {};

  const pointerProps = isClickable
    ? { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave }
    : {};

  return (
    <Tag
      ref={nodeRef}
      className={classes}
      onClick={onClick}
      {...pointerProps}
      {...interactiveProps}
      {...rest}
    >
      {isClickable && <span className="card-spotlight" aria-hidden="true" />}
      {children}
    </Tag>
  );
}

export default Card;
