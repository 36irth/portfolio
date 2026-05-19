import { useCallback, useEffect, useRef, useState } from "react";

type TypingSequenceOptions = {
  target: string;
  enabled?: boolean;
  onCorrect?: (index: number, key: string) => void;
  onWrong?: (key: string) => void;
  onComplete?: () => void;
};

export function useTypingSequence({
  target,
  enabled = true,
  onCorrect,
  onWrong,
  onComplete,
}: TypingSequenceOptions) {
  const [cursor, setCursor] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const cursorRef = useRef(0);
  const completeRef = useRef(false);

  const submitKey = useCallback(
    (inputKey: string) => {
      if (!enabled || completeRef.current) return;

      const key = inputKey.toLowerCase();
      if (key.length !== 1) return;

      const expected = target[cursorRef.current];
      if (key !== expected) {
        onWrong?.(key);
        return;
      }

      const pressedIndex = cursorRef.current;
      onCorrect?.(pressedIndex, key);

      const nextCursor = pressedIndex + 1;
      cursorRef.current = nextCursor;
      setCursor(nextCursor);

      if (nextCursor === target.length) {
        completeRef.current = true;
        setIsComplete(true);
        onComplete?.();
      }
    },
    [enabled, onComplete, onCorrect, onWrong, target],
  );

  const reset = useCallback(() => {
    cursorRef.current = 0;
    completeRef.current = false;
    setCursor(0);
    setIsComplete(false);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (completeRef.current || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      submitKey(event.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, submitKey]);

  return {
    cursor,
    isComplete,
    progress: cursor / target.length,
    reset,
    submitKey,
  };
}
