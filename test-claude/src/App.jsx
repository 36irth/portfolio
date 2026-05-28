import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { KeyboardIntro } from './components/KeyboardIntro';
import MainPage from './pages/MainPage';

function App() {
  const scrollRef = useRef(null);
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

  const handleScroll = (event) => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  const handleIntroComplete = () => {
    const container = scrollRef.current;
    if (!container) return;

    setPhase('main');
    container.scrollTo({
      top: viewportHeight,
      behavior: 'smooth',
    });
  };

  const characterProgress = useMemo(() => {
    const start = viewportHeight;
    const span = viewportHeight * 1.25;
    return Math.max(0, Math.min(1, (scrollTop - start) / span));
  }, [scrollTop, viewportHeight]);

  return (
    <div className="appViewport">
      <div className="appScroll" ref={scrollRef} onScroll={handleScroll}>
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
