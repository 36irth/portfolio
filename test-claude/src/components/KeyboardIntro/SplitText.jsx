import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function SplitText({
  segments,
  className,
  stagger = 0.04,
  duration = 0.85,
  ease = 'power3.out',
  animationDelay = 0.3,
  isActive = true,
  onComplete,
}) {
  const containerRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const chars = el.querySelectorAll('[data-split-char]');
    gsap.set(chars, { opacity: 0, y: 40 });
    if (!isActive) return undefined;

    const tween = gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration,
      ease,
      stagger,
      delay: animationDelay,
      onComplete: () => onCompleteRef.current?.(),
    });

    return () => tween.kill();
  }, [animationDelay, duration, ease, isActive, stagger]);

  return (
    <h1 ref={containerRef} className={className}>
      {segments.map((seg, si) => {
        if (seg.isBreak) return <br key={`br-${si}`} />;

        return (
          <span key={si} className={seg.className}>
            {seg.text.split('').map((char, ci) => (
              <span
                key={`${si}-${ci}`}
                data-split-char=""
                style={{ display: 'inline-block' }}
              >
                {char === ' ' ? '\u00a0' : char}
              </span>
            ))}
          </span>
        );
      })}
    </h1>
  );
}
