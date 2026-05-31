import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { KeyboardIntro } from './components/KeyboardIntro';
import MainPage from './pages/MainPage';

function App() {
  const scrollRef = useRef(null);
  const lenisRef = useRef(null);
  const scrollRafRef = useRef(0);
  const pendingScrollTopRef = useRef(0);
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
          content: container.firstElementChild ?? container,
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

        if (phase === 'intro') {
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

    if (phase === 'intro') {
      lenis.stop();
      lenis.scrollTo(0, { immediate: true });
      return;
    }

    lenis.start();
  }, [phase]);

  const handleScroll = (event) => {
    const container = event.currentTarget;

    if (phase === 'intro') {
      if (container.scrollTop !== 0) {
        container.scrollTop = 0;
      }
      setScrollTop(0);
      return;
    }

    if (phase === 'main' && container.scrollTop < viewportHeight - 1) {
      container.scrollTop = viewportHeight;
      setScrollTop(viewportHeight);
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
    };
  }, []);

  const handleIntroComplete = () => {
    const container = scrollRef.current;
    if (!container) return;

    setPhase('main');
    requestAnimationFrame(() => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.start();
        lenis.scrollTo(viewportHeight, {
          duration: 2,
          lock: true,
        });
        return;
      }

      container.scrollTo({
        top: viewportHeight,
        behavior: 'smooth',
      });
    });
  };

  const characterProgress = useMemo(() => {
    const start = viewportHeight;
    const span = viewportHeight * 3.2;
    return Math.max(0, Math.min(1, (scrollTop - start) / span));
  }, [scrollTop, viewportHeight]);

  return (
    <div className="appViewport">
      <div
        className={`appScroll ${phase === 'intro' ? 'appScrollLocked' : 'appScrollMain'}`}
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <section className="appIntroSection">
          <KeyboardIntro onComplete={handleIntroComplete} />
        </section>
        <MainPage
          isActive={phase === 'main' || scrollTop > viewportHeight * 0.45}
          scrollProgress={characterProgress}
        />
      </div>
    </div>
  );
}

export default App;
