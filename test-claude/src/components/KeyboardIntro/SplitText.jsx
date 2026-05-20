import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function SplitText({
  segments,
  className,
  stagger = 0.04,
  duration = 0.85,
  ease = 'power3.out',
  animationDelay = 0.3,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll('[data-split-char]');
    gsap.set(chars, { opacity: 0, y: 40 });

    const tween = gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration,
      ease,
      stagger,
      delay: animationDelay,
    });

    return () => tween.kill();
  }, []);

  return (
    <h1 ref={containerRef} className={className}>
      {segments.map((seg, si) => {
        if (seg.isBreak) return <br key={`br-${si}`} />;
        return seg.text.split('').map((char, ci) => (
          <span
            key={`${si}-${ci}`}
            className={seg.className}
            data-split-char=""
            style={{ display: 'inline-block' }}
          >
            {char === ' ' ? ' ' : char}
          </span>
        ));
      })}
    </h1>
  );
}
