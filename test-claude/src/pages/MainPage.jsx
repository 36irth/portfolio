import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ExplodedKeyScene from './ExplodedKeyScene';
import styles from './MainPage.module.css';

export function MainPage() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.from(ref.current, {
      opacity: 0,
      y: 25,
      duration: 0.9,
      ease: 'power3.out',
    });
  }, []);

  return (
    <div ref={ref} className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>yulssem</h1>
        <p className={styles.sub}>welcome.</p>
      </div>
      <div className={styles.keyStage}>
        <ExplodedKeyScene />
      </div>
    </div>
  );
}

export default MainPage;
