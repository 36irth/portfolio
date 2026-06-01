import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function TypeText({
  segments,
  className,
  as: Component = 'h1',
  isActive = true,
  typingSpeed = 70,
  initialDelay = 400,
  showCursor = true,
  cursorCharacter = '▎',
  cursorBlinkDuration = 0.5,
  onComplete,
}) {
  const totalChars = segments
    .filter(s => !s.isBreak)
    .reduce((sum, s) => sum + s.text.length, 0);

  // char count accumulated before each break segment
  const breakAtChar = {};
  let acc = 0;
  segments.forEach((seg, si) => {
    if (seg.isBreak) {
      breakAtChar[si] = acc;
    } else {
      acc += seg.text.length;
    }
  });

  const [typedCount, setTypedCount] = useState(0);
  const cursorRef = useRef(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (isActive) return;
    setTypedCount(0);
    completedRef.current = false;
  }, [isActive]);

  useEffect(() => {
    if (typedCount >= totalChars && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [typedCount, totalChars, onComplete]);

  useEffect(() => {
    if (!showCursor || !cursorRef.current) return;
    gsap.set(cursorRef.current, { opacity: 1 });
    const tween = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: cursorBlinkDuration,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
    });
    return () => tween.kill();
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    if (!isActive) return;
    if (typedCount >= totalChars) return;
    const delay = typedCount === 0 ? initialDelay : typingSpeed;
    const timer = setTimeout(() => setTypedCount(c => c + 1), delay);
    return () => clearTimeout(timer);
  }, [typedCount, totalChars, typingSpeed, initialDelay, isActive]);

  let charsCounted = 0;
  const rendered = segments.map((seg, si) => {
    if (seg.isBreak) {
      return typedCount > breakAtChar[si] ? <br key={`br-${si}`} /> : null;
    }
    const charsToShow = Math.min(seg.text.length, Math.max(0, typedCount - charsCounted));
    charsCounted += seg.text.length;
    return (
      <span key={si} className={seg.className} style={seg.style}>
        {seg.text.slice(0, charsToShow)}
      </span>
    );
  });

  return (
    <Component className={className}>
      {rendered}
      {showCursor && (
        <span ref={cursorRef} style={{ display: 'inline-block', opacity: 1 }}>
          {cursorCharacter}
        </span>
      )}
    </Component>
  );
}
