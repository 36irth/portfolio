import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { KeyboardIntro } from './components/KeyboardIntro';
import MainPage from './pages/MainPage';

function App() {
  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const lenisRef = useRef(null);
  const scrollRafRef = useRef(0);
  const pendingScrollTopRef = useRef(0);
  const transitionTimerRef = useRef(0);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 1080,
  );
  const [scrollTop, setScrollTop] = useState(0);
  const [phase, setPhase] = useState('intro');

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return undefined;

    let isDisposed = false;
    let rafId = 0;
    let lenisInstance = null;

    const setupLenis = async () => {
      try {
        const module = await import('https://esm.sh/lenis@1.3.13');
        if (isDisposed) return;

        const Lenis = module.default;
        lenisInstance = new Lenis({
          wrapper: container,
          content: contentRef.current ?? container,
          duration: 1.4,
          smoothWheel: true,
          syncTouch: false,
          wheelMultiplier: 0.9,
          touchMultiplier: 1,
          infinite: false,
        });

        lenisRef.current = lenisInstance;

        const raf = (time) => {
          lenisInstance?.raf(time);
          rafId = window.requestAnimationFrame(raf);
        };

        rafId = window.requestAnimationFrame(raf);

        if (phase !== 'main') {
          lenisInstance.stop();
        }
      } catch (error) {
        lenisRef.current = null;
      }
    };

    setupLenis();

    return () => {
      isDisposed = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      lenisInstance?.destroy?.();
      if (lenisRef.current === lenisInstance) {
        lenisRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    if (phase !== 'main') {
      lenis.stop();
      lenis.scrollTo(0, { immediate: true });
      return;
    }

    lenis.start();
  }, [phase]);

  const handleScroll = (event) => {
    const container = event.currentTarget;

    if (phase !== 'main') {
      if (container.scrollTop !== 0) {
        container.scrollTop = 0;
      }
      setScrollTop(0);
      return;
    }

    pendingScrollTopRef.current = container.scrollTop;
    if (scrollRafRef.current) return;

    scrollRafRef.current = window.requestAnimationFrame(() => {
      scrollRafRef.current = 0;
      setScrollTop(pendingScrollTopRef.current);
    });
  };

  useEffect(() => {
    return () => {
      if (scrollRafRef.current) {
        window.cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = 0;
      }
      window.clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const handleIntroComplete = () => {
    const container = scrollRef.current;
    if (!container) return;

    setPhase('transition');
    setScrollTop(0);
    pendingScrollTopRef.current = 0;

    requestAnimationFrame(() => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        container.scrollTo({ top: 0, behavior: 'auto' });
      }

      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = window.setTimeout(() => {
        setPhase('main');
      }, 860);
    });
  };

  const characterProgress = useMemo(() => {
    const span = viewportHeight * 3.2;
    return Math.max(0, Math.min(1, scrollTop / span));
  }, [scrollTop, viewportHeight]);

  return (
    <div className="appViewport">
      <div
        className={`appScroll ${phase === 'main' ? 'appScrollMain' : 'appScrollLocked'} ${
          phase === 'transition' ? 'appScrollTransition' : ''
        }`}
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <div className="appScrollContent" ref={contentRef}>
          {phase !== 'main' && (
            <section className={`appIntroSection ${phase === 'transition' ? 'appIntroLeaving' : ''}`}>
              <KeyboardIntro onComplete={handleIntroComplete} />
            </section>
          )}
          {phase !== 'intro' && (
            <div className={`appMainSection ${phase === 'transition' ? 'appMainEntering' : ''}`}>
            <MainPage
              isActive={phase === 'main'}
              scrollProgress={characterProgress}
            />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
