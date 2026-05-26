import { useCallback, useRef, useState } from 'react';
import ExplodedKeyScene from './ExplodedKeyScene';
import styles from './MainPage.module.css';

const SECTIONS = [
  {
    id: '01',
    variant: 'plain',
    pos: 'about',
    title: 'About me',
    items: [
      { key: 'profile', title: 'Profile', desc: 'Short dummy overview of who I am and how I work.' },
      { key: 'cert', title: 'Certificate', desc: 'Dummy certification notes and learning milestones.' },
      { key: 'award', title: 'Award', desc: 'Dummy awards, recognition, and project outcomes.' },
      { key: 'skills', title: 'Skills', desc: 'Dummy skill stack for design, motion, and frontend.' },
    ],
  },
  {
    id: '02',
    variant: 'plain',
    pos: 'works',
    title: 'Works',
    items: [
      { key: 'p1', title: 'Project1', desc: 'Dummy case study for interface and visual systems.' },
      { key: 'p2', title: 'Project2', desc: 'Dummy interactive website with motion details.' },
      { key: 'p3', title: 'Project3', desc: 'Dummy product story focused on usability.' },
      { key: 'p4', title: 'Project4', desc: 'Dummy branding and digital experience project.' },
      { key: 'p5', title: 'Project5', desc: 'Dummy app flow with responsive UI decisions.' },
      { key: 'p6', title: 'Project6', desc: 'Dummy immersive media and 3D exploration.' },
    ],
  },
  {
    id: '03',
    variant: 'feature',
    pos: 'shapes',
    title: 'What Shapes\nMy Work',
    items: [
      { key: 'keyboard', title: 'Mechanical Keyboards', desc: 'Inspired tactile interaction and precision.' },
      { key: 'fps', title: 'FPS Games', desc: 'Learned fast and immersive interfaces.' },
      { key: 'cinema', title: 'Cinematic Direction', desc: 'Influenced motion and visual storytelling.' },
    ],
  },
];

function ExpandedContent({ section }) {
  if (section.id === '01') {
    return (
      <div className={styles.aboutExpanded}>
        <div className={styles.aboutList}>
          {section.items.map((item) => (
            <div key={item.key} className={styles.aboutListItem}>{item.title}</div>
          ))}
        </div>
        <div className={styles.aboutPreview} />
      </div>
    );
  }

  if (section.id === '02') {
    return (
      <div className={styles.workExpanded}>
        {section.items.map((item, index) => (
          <article key={item.key} className={styles.workCard}>
            <div className={styles.workThumb} />
            <div className={styles.workMeta}>
              <span className={styles.workNum}>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title.replace(/\d+$/, '')}</h3>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.shapesExpanded}>
      <div className={styles.shapeList}>
        {section.items.map((item) => (
          <article key={item.key} className={styles.shapeItem}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </article>
        ))}
      </div>
      <div className={styles.shapePreviewRow}>
        {section.items.map((item) => (
          <div key={item.key} className={styles.shapePreview} />
        ))}
      </div>
    </div>
  );
}

function Panel({ section, phase, stagger, exitStagger }) {
  const titleLines = section.title.split('\n');
  const visible = phase === 'showing';
  const phaseClass = phase === 'hiding' ? styles.panelLeaving : styles.panelEntering;

  return (
    <section
      className={`${styles.panel} ${styles[section.variant]} ${styles[`pos_${section.pos}`]} ${styles.expanded} ${visible ? styles.panelVisible : ''} ${phaseClass}`}
      style={{ '--enter-delay': `${stagger}s`, '--exit-delay': `${exitStagger}s` }}
      aria-label={section.title.replace('\n', ' ')}
    >
      <div className={styles.panelHeader}>
        <span className={styles.sectionNum}>{section.id}</span>
        <h2 className={styles.sectionTitle}>
          {titleLines.map((line, index) => (
            <span key={line}>
              {line}
              {index < titleLines.length - 1 && <br />}
            </span>
          ))}
        </h2>
      </div>

      <ExpandedContent section={section} />
    </section>
  );
}

export function MainPage() {
  const [panelPhase, setPanelPhase] = useState('hidden');
  const hideTimerRef = useRef(null);

  const handleExplode = useCallback(() => {
    window.clearTimeout(hideTimerRef.current);
    setPanelPhase('showing');
  }, []);

  const handleAssemble = useCallback(() => {
    setPanelPhase('hiding');
    window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      setPanelPhase('hidden');
    }, 980);
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.keyStage}>
        <ExplodedKeyScene onExplode={handleExplode} onAssemble={handleAssemble} />
      </div>

      <div className={styles.heading}>
        <h1 className={styles.headingTitle}>
          Each part<br />
          makes the<br />
          <span>experience.</span>
        </h1>
        <p className={styles.headingSub}>Select a part to explore my portfolio.</p>
      </div>

      <Panel section={SECTIONS[0]} phase={panelPhase} stagger={0} exitStagger={0.3} />
      <Panel section={SECTIONS[1]} phase={panelPhase} stagger={0.15} exitStagger={0.15} />
      <Panel section={SECTIONS[2]} phase={panelPhase} stagger={0.3} exitStagger={0} />

      <div className={styles.hint}>Use keyboard or click key</div>
    </main>
  );
}

export default MainPage;
