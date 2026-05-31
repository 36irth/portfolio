import { memo, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import SplitText from '../components/KeyboardIntro/SplitText';
import { animatePress, startFloat, stopFloat } from '../components/KeyboardIntro/animations';
import { createKeycap } from '../components/KeyboardIntro/Keycap';
import { SCENE } from '../components/KeyboardIntro/constants';
import styles from './MainPage.module.css';

const asset = (name) => `/assets/portfolio/${name}`;

const imgHighlightsProject = 'https://www.figma.com/api/mcp/asset/49afc43d-377d-458c-a99a-2e2ac8fb6901';
const imgHighlightsProject1 = 'https://www.figma.com/api/mcp/asset/390f36b6-f416-41dc-8e90-08c4159f42d9';
const imgHighlightsProject2 = 'https://www.figma.com/api/mcp/asset/fa5e3702-bbe4-4564-8ef2-470ff37edab9';
const imgHighlightsProject3 = 'https://www.figma.com/api/mcp/asset/05c4c9d8-ab65-4bd1-bf9d-46b4d890d443';
const imgHighlightsProject4 = 'https://www.figma.com/api/mcp/asset/60d4a4eb-b407-4b2d-88fb-5d0a5868b897';
const imgHighlightsProject5 = 'https://www.figma.com/api/mcp/asset/dd006139-e932-4658-b72f-c40e31fedbd6';
const imgHighlightsArrow = 'https://www.figma.com/api/mcp/asset/f3e7a64d-ed43-4cff-b0d9-9e4d3b834ad6';

const imgApproachObserve = 'https://www.figma.com/api/mcp/asset/1a3b138a-4381-4877-8aec-251314aeb84b';
const imgApproachOrganize = 'https://www.figma.com/api/mcp/asset/ebc34bbf-f772-49dc-99f6-65425e915f67';
const imgApproachVisualize = 'https://www.figma.com/api/mcp/asset/b6921018-ba90-43b5-9514-c561ab8323f4';
const imgApproachFolder = 'https://www.figma.com/api/mcp/asset/4a631a50-94c8-44c8-935a-5d6ca915ff01';
const imgApproachDrag = 'https://www.figma.com/api/mcp/asset/b9803712-340d-46d5-a156-86f68a82e175';
const imgApproachSummaryTop = asset('approach-image55.png');
const imgApproachSummaryLeft = 'https://www.figma.com/api/mcp/asset/98bf9130-9092-4e82-8723-ce85f5064582';
const imgApproachSummaryCenter = 'https://www.figma.com/api/mcp/asset/e1d77281-a5d2-46aa-8dd1-76b70d10006a';

const imgAward = 'https://www.figma.com/api/mcp/asset/e2707fcb-a858-4bcc-b38c-1dbf37f21cfb';
const imgCertificateIcon = 'https://www.figma.com/api/mcp/asset/59f0f208-8f4d-4ace-8131-785b76c7cda8';
const imgToolHeader = 'https://www.figma.com/api/mcp/asset/111b02b5-bba7-41d3-a04e-5255b7e164b8';
const imgWindowClose = 'https://www.figma.com/api/mcp/asset/71376b88-e591-4baa-907d-1e3da0e78243';
const imgToolFigma = 'https://www.figma.com/api/mcp/asset/abdb3c56-7316-4b2c-bcc8-1496173913f8';
const imgToolCode = 'https://www.figma.com/api/mcp/asset/3ea2786b-a24d-492a-9a29-f20dc9ab8330';
const imgAiChatGpt = 'https://www.figma.com/api/mcp/asset/7ee665ac-b663-4044-baf1-2ff33cd22134';
const imgAiClaude = 'https://www.figma.com/api/mcp/asset/16db0de7-8545-4909-98d1-a0e249027932';
const imgAiPerplexity = 'https://www.figma.com/api/mcp/asset/f1127c29-1ed4-4d9a-8c60-8f28eb0781ef';
const imgAiCodex = 'https://www.figma.com/api/mcp/asset/d6969e1c-8239-4e48-948c-a347c3cf93b8';
const imgAiMidjourney = 'https://www.figma.com/api/mcp/asset/e80660e3-1016-4684-a7dd-7d3045b81151';
const imgProfile = 'https://www.figma.com/api/mcp/asset/e36f4ce6-fa79-464a-8174-376c2e64f588';
const imgInvitationCardPhoto = 'https://www.figma.com/api/mcp/asset/0c9a2c1a-2d80-4acb-95f0-52b0ca1b63d1';

const awards = [
  ['블루어워즈', '시각디자인 분야 입선', '2022.06.14'],
  ['블루어워즈', '시각디자인 분야 입선', '2022.06.22'],
  ['관악현대미술대전', '디자인 분야 특선', '2023.11.21'],
];

const certificates = [
  ['웹디자인개발기능사(필기)', '26.01.24'],
  ['컴퓨터그래픽스운용기능사', '19.07.19'],
  ['JLPT N2', '19.01.20'],
];

const designTools = [
  ['Figma', 'Design / Prototyping', 'Advanced', imgToolFigma],
  ['Photoshop', 'Image editing', 'Advanced', asset('tool-photoshop.png')],
  ['Illustrator', 'Graphic assets / icons / logo', 'Intermediate', asset('tool-illustrator.png')],
  ['AfterEffects', 'Design / Prototyping', 'Basic', asset('tool-aftereffects.png')],
  ['InDesign', 'Design / Prototyping', 'Basic', asset('tool-indesign.png')],
  ['HTML / CSS / JavaScript', 'Implementation understanding', 'Basic', imgToolCode],
  ['React', 'Component structure', 'Basic', asset('tool-react.png')],
];

const aiTools = [
  ['ChatGPT', 'Expand ideas / Create Images', imgAiChatGpt],
  ['Claude', 'Writing / Coding / Product management', imgAiClaude],
  ['Perplexity', 'Survey of data', imgAiPerplexity],
  ['Codex', 'Coding', imgAiCodex],
  ['Midjourney', 'Create images and videos', imgAiMidjourney],
  ['Gemini', 'Writing / Product management', asset('ai-gemini.png')],
];

const highlightLargeProjects = [
  {
    image: imgHighlightsProject,
    eyebrow: '에어소프트건 팬덤 커뮤니티 앱',
    title: 'GUNIT',
    buttons: ['Site', 'pdf'],
    imageClass: styles.highlightProjectImageA,
    overlayClass: styles.highlightOverlayA,
  },
  {
    image: imgHighlightsProject1,
    eyebrow: '콘서트 덕질 일정 공유 앱',
    title: 'STAG',
    buttons: ['Site'],
    imageClass: styles.highlightProjectImageB,
    overlayClass: styles.highlightOverlayB,
  },
  {
    image: imgHighlightsProject2,
    eyebrow: 'K-Brand 글로벌 웹사이트 리뉴얼',
    title: '룸앤',
    buttons: ['Site', 'pdf'],
    imageClass: styles.highlightProjectImageC,
    overlayClass: styles.highlightOverlayC,
  },
];

const highlightSmallProjects = [
  {
    image: imgHighlightsProject3,
    eyebrow: '이거 뭔 프로젝트엿더라',
    title: '대학농구 홈커밍',
    buttons: ['pdf'],
    imageClass: styles.highlightProjectImageD,
  },
  {
    image: imgHighlightsProject4,
    eyebrow: '이거 뭔 프로젝트엿더라 로고엿는데',
    title: '카페유일',
    buttons: ['pdf'],
    imageClass: styles.highlightProjectImageE,
  },
  {
    image: imgHighlightsProject5,
    eyebrow: '졸전이였음',
    title: '알렉산더맥퀸',
    buttons: ['Site'],
    imageClass: styles.highlightProjectImageF,
  },
];

const approachCards = [
  ['1', 'Observe', ['사용자가 어디서 불편함을', '느끼는지 파악합니다'], imgApproachObserve, styles.approachFigureObserve],
  ['2', 'Organize', ['사용자가 다음 행동을 쉽게', '찾을 수 있도록 정리합니다'], imgApproachOrganize, styles.approachFigureOrganize],
  ['3', 'Visualize', ['기능만이 아니라', '기억에 남는 화면을 만듭니다.'], imgApproachVisualize, styles.approachFigureVisualize],
];

const questions = [
  [
    '01',
    '고등학교부터 대학교까지, 왜 디자인을 전공하게 되었나요?',
    '어릴 때부터 시각적으로 아름다운 것을 만드는 일을 좋아했고 자연스럽게 시각디자인을 전공하게 되었습니다. 졸업 무렵 UI/UX가 사용자 경험과 연결된다는 점에 끌려 본격적으로 공부를 시작했습니다.',
  ],
  [
    '02',
    '어떤 디자이너가 되고 싶나요?',
    '앞으로는 단순 취향에만 머무는 것이 아니라 더 많은 사람들이 편하게 쓰는 디자인을 해보고 싶습니다. 화면 설계에만 그치지 않고 사용자 리서치와 데이터 기반 개선 과정까지 이해하는 디자이너로 성장하는 것이 목표입니다.',
  ],
  [
    '03',
    '앞으로 무엇을 배우고 싶나요?',
    'UI/UX 디자이너로 경험을 쌓아가면서 장기적으로는 블렌더와 인터랙티브 같은 3D 툴을 통해 시각 표현 영역도 넓혀가고 싶습니다. 또한 일본어와 중국어를 배우며 다양한 문화권의 사용자 감각도 이해하고 싶습니다.',
  ],
  [
    '04',
    'AI가 자연스러워진 지금, 디자이너는 무엇을 직접 판단해야 할까요?',
    'AI는 보조 도구일 뿐이라고 생각합니다. 직접 사용해보며 무엇을 맡기고 어디까지 검토할지를 결정하는 경험이 중요합니다. 처음부터 끝까지 맡기는 것이 아니라 작업 과정의 속도를 높이는 도구로서 활용하는 것이 중요하다고 생각합니다.',
  ],
];

const keys = ['C', 'H', 'A', 'E', 'I'];
const floatDelays = [0.01, 0.12, 0.06, 0.18, 0.09, 0.16, 0.03];

function useReplayInView(threshold = 0.18, rootMargin = '0px 0px -8% 0px') {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const lastVisibleRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const root = document.querySelector('.appScroll');

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextVisible = entry.isIntersecting;
        if (lastVisibleRef.current === nextVisible) return;
        lastVisibleRef.current = nextVisible;
        setVisible(nextVisible);
      },
      { threshold, root: root ?? null, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, visible];
}

function AnimatedContent({
  children,
  delay = 0,
  distance = 38,
  blur = 12,
  scale = 0.96,
  threshold = 0.18,
  className = '',
}) {
  const [ref, visible] = useReplayInView(threshold, '0px 0px -8% 0px');

  return (
    <div
      ref={ref}
      className={`${styles.animatedContent} ${visible ? styles.animatedContentVisible : ''} ${className}`}
      style={{
        '--ac-delay': `${delay}s`,
        '--ac-distance': `${distance}px`,
        '--ac-blur': `${blur}px`,
        '--ac-scale': scale,
      }}
    >
      {children}
    </div>
  );
}

function getFloatState(isActive, scrollProgress, index) {
  if (!isActive) return false;
  const delay = floatDelays[index] ?? 0;
  const showAt = 0.18 + delay;
  const hideAt = 0.82 + delay * 0.18;
  return scrollProgress >= showAt && scrollProgress < hideAt;
}

function floatClass(isActive, scrollProgress, index) {
  return `${styles.characterFloat} ${
    getFloatState(isActive, scrollProgress, index) ? styles.characterFloatVisible : ''
  }`;
}

function floatStyle(index) {
  return { '--float-delay': `${floatDelays[index] ?? 0}s` };
}

function KeyboardBadge({ active = 0 }) {
  return (
    <div className={styles.keyboardBadge} aria-hidden="true">
      {keys.map((key, index) => (
        <span key={key} className={index === active ? styles.keyActive : styles.keyInactive}>
          {key}
        </span>
      ))}
    </div>
  );
}

function ScrollFloatTitle({ title, active = 0, align = 'center', className = '' }) {
  return (
    <header className={`${styles.sectionTitle} ${align === 'left' ? styles.sectionTitleLeft : ''} ${className}`}>
      <KeyboardBadge active={active} />
      <h2>
        <span>{title.slice(0, 1)}</span>
        {title.slice(1)}
      </h2>
    </header>
  );
}

function ScrollFloatCopy({ lines, visible = false, className = '' }) {
  return (
    <div
      className={`${className} ${visible ? `${styles.approachTextVisible} ${styles.scrollFloatCopyVisible}` : ''}`}
    >
      {lines.map((line, lineIndex) => (
        <div key={`line-${lineIndex}`} className={styles.scrollFloatCopyLine}>
          {line.split(' ').map((word, wordIndex) => (
            <span
              key={`${lineIndex}-${wordIndex}`}
              className={styles.scrollFloatCopyWord}
              style={{ '--copy-index': lineIndex * 14 + wordIndex }}
            >
              {word}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function CharacterTitle({ isActive }) {
  return (
    <header className={`${styles.sectionTitle} ${styles.sectionTitleLeft} ${styles.characterTitle}`}>
      <div className={`${styles.keyboardBadge} ${isActive ? styles.titlePartReady : ''}`} aria-hidden="true">
        {keys.map((key, index) => (
          <span key={key} className={index === 0 ? styles.keyActive : styles.keyInactive}>
            {key}
          </span>
        ))}
      </div>
      <SplitText
        isActive={isActive}
        className={styles.titleSplit}
        stagger={0.025}
        duration={0.72}
        animationDelay={0.04}
        segments={[
          { text: 'C', className: styles.titleAccent },
          { text: 'haracter' },
        ]}
      />
    </header>
  );
}

function DragAccentLine() {
  const containerRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, base: 0 });
  const [dragProgress, setDragProgress] = useState(0);

  useEffect(() => {
    const handleMove = (event) => {
      if (!dragRef.current.active) return;
      const container = containerRef.current;
      if (!container) return;
      const width = Math.max(container.offsetWidth, 1);
      const delta = (event.clientX - dragRef.current.startX) / width;
      const next = Math.max(0, Math.min(1, dragRef.current.base + delta * 1.25));
      setDragProgress(next);
    };

    const handleUp = () => {
      dragRef.current.active = false;
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, []);

  const handlePointerDown = (event) => {
    dragRef.current = {
      active: true,
      startX: event.clientX,
      base: dragProgress,
    };
  };

  return (
    <div
      ref={containerRef}
      className={styles.accentLine}
      style={{ '--drag-progress': dragProgress }}
      onPointerDown={handlePointerDown}
    >
      <strong className={styles.accentChunk} style={{ '--chunk-index': 0 }}>
        구조와 감각의 균형
      </strong>
      <span className={styles.accentChunk} style={{ '--chunk-index': 1 }}>
        을 고민하는
      </span>
      <strong className={styles.accentChunk} style={{ '--chunk-index': 2 }}>
        UI/UX 디자이너
      </strong>
      <span className={styles.accentChunk} style={{ '--chunk-index': 3 }}>
        를 지향합니다.
      </span>
    </div>
  );
}

function GlassHeader({ icon, label }) {
  return (
    <div className={styles.glassHeader}>
      <div className={styles.windowTitle}>
        <img src={icon} alt="" />
        <strong>{label}</strong>
      </div>
      <img src={imgWindowClose} alt="" className={styles.windowClose} />
    </div>
  );
}

function CharacterSection({ isActive, scrollProgress }) {
  const copyReady = isActive;

  return (
    <section className={styles.characterScrollSection}>
      <div className={`${styles.panel} ${styles.characterPanel}`}>
        <div className={`${styles.characterCopy} ${copyReady ? styles.characterCopyReady : ''}`}>
          <CharacterTitle isActive={isActive} />
          <p>
            키보드의 작은 키들이 모여 하나의 문장을 완성하듯,
            <br />
            작은 요소들이 모여 하나의 경험을 만든다고 생각합니다.
          </p>
          <DragAccentLine />
        </div>

        <div className={`${styles.awards} ${floatClass(isActive, scrollProgress, 6)}`} style={floatStyle(6)}>
          {awards.map(([line1, line2, date]) => (
            <article className={styles.awardItem} key={`${line1}-${line2}-${date}`}>
              <img src={imgAward} alt="" />
              <div>
                <p>{line1}</p>
                <p>{line2}</p>
                <time>{date}</time>
              </div>
            </article>
          ))}
        </div>

        <aside className={`${styles.glassCard} ${styles.designToolsCard} ${floatClass(isActive, scrollProgress, 0)}`} style={floatStyle(0)}>
          <GlassHeader icon={imgToolHeader} label="Tools" />
          <div className={styles.glassBody}>
            <p className={styles.bodyLabel}>Tools I can use</p>
            {designTools.map(([name, desc, level, image]) => (
              <div className={styles.toolRow} key={name}>
                <div className={styles.toolLeft}>
                  <img src={image} alt="" />
                  <div>
                    <strong>{name}</strong>
                    <span>{desc}</span>
                  </div>
                </div>
                <em>{level}</em>
              </div>
            ))}
          </div>
        </aside>

        <aside className={`${styles.glassCard} ${styles.profileCard} ${floatClass(isActive, scrollProgress, 1)}`} style={floatStyle(1)}>
          <div className={styles.profileTitle}>
            <h3>Profile</h3>
            <p>김채이</p>
          </div>
          <img src={asset('profile.png')} alt="김채이 프로필" className={styles.profileImage} />
          <p className={styles.profileMeta}>2001.03.06</p>
          <p className={styles.profileMeta}>36irth@gmail.com</p>
        </aside>

        <aside className={`${styles.glassCard} ${styles.aiCard} ${floatClass(isActive, scrollProgress, 2)}`} style={floatStyle(2)}>
          <GlassHeader icon={imgToolHeader} label="AI" />
          <div className={styles.glassBody}>
            {aiTools.map(([name, desc, image]) => (
              <div className={styles.toolRow} key={name}>
                <div className={styles.toolLeft}>
                  <img src={image} alt="" />
                  <div>
                    <strong>{name}</strong>
                    <span>{desc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <aside className={`${styles.glassCard} ${styles.certificateCard} ${floatClass(isActive, scrollProgress, 3)}`} style={floatStyle(3)}>
          <div className={styles.cardTop}>
            <img src={imgCertificateIcon} alt="" />
            <strong>3</strong>
          </div>
          <h3>Certificate</h3>
          <div className={styles.certificateList}>
            {certificates.map(([label, date]) => (
              <p key={label}>
                <span>{label}</span>
                <time>{date}</time>
              </p>
            ))}
          </div>
        </aside>

        <div className={`${styles.chatBubble} ${floatClass(isActive, scrollProgress, 4)} ${styles.schoolOne}`} style={floatStyle(4)}>
          <p>2021~2023 안산대학교 시각미디어디자인학과</p>
        </div>
        <div className={`${styles.chatBubble} ${floatClass(isActive, scrollProgress, 5)} ${styles.schoolTwo}`} style={floatStyle(5)}>
          <p>2017~2020 안산디자인문화고등학교 시각디자인과</p>
        </div>
      </div>
    </section>
  );
}

function HighlightsSection() {
  return (
    <section className={`${styles.panel} ${styles.highlightsPanel}`}>
      <ScrollFloatTitle title="Highlights" active={1} className={styles.highlightsTitle} />

      <div className={styles.highlightsContent}>
        <div className={styles.highlightsLargeList}>
          {highlightLargeProjects.map((project, index) => (
            <AnimatedContent key={project.title} delay={0.03 + index * 0.06} distance={28} blur={10} scale={0.975}>
              <article className={styles.highlightLargeCard}>
                <img src={project.image} alt="" className={`${project.imageClass} ${styles.highlightCardImage}`} />
                <div className={`${styles.highlightLargeBlur} ${project.overlayClass}`} />
                <div className={styles.highlightCardContent}>
                  <div className={styles.highlightTextBlock}>
                    <p className={styles.highlightEyebrow}>{project.eyebrow}</p>
                    <p className={styles.highlightTitle}>{project.title}</p>
                  </div>
                  <div className={styles.highlightButtonRow}>
                    {project.buttons.map((label) => (
                      <button key={label} type="button" className={styles.highlightAction}>
                        <span>{label}</span>
                        <img src={imgHighlightsArrow} alt="" />
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            </AnimatedContent>
          ))}
        </div>

        <div className={styles.highlightsRightList}>
          {highlightSmallProjects.map((project, index) => (
            <AnimatedContent key={project.title} delay={0.18 + index * 0.06} distance={22} blur={8} scale={0.98}>
              <article className={styles.highlightSmallCard}>
                <img src={project.image} alt="" className={`${project.imageClass} ${styles.highlightCardImage}`} />
                <div className={styles.highlightSmallBlur} />
                <div className={styles.highlightSmallContent}>
                  <div className={styles.highlightTextBlock}>
                    <p className={styles.highlightEyebrow}>{project.eyebrow}</p>
                    <p className={styles.highlightTitle}>{project.title}</p>
                  </div>
                  <div className={styles.highlightButtonRow}>
                    {project.buttons.map((label) => (
                      <button key={label} type="button" className={styles.highlightAction}>
                        <span>{label}</span>
                        <img src={imgHighlightsArrow} alt="" />
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}

function ApproachSection() {
  const sectionRef = useRef(null);
  const folderRef = useRef(null);
  const [collected, setCollected] = useState([]);
  const [draggingCard, setDraggingCard] = useState(null);
  const [folderReady, setFolderReady] = useState(false);
  const [textReady, setTextReady] = useState(false);
  const allCollected = collected.length === approachCards.length;

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    let timeoutId = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.clearTimeout(timeoutId);
          timeoutId = window.setTimeout(() => {
            setFolderReady(true);
          }, 850);
          return;
        }

        window.clearTimeout(timeoutId);
        setFolderReady(false);
        setDraggingCard(null);
        setCollected([]);
        setTextReady(false);
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => {
      window.clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!draggingCard) return undefined;

    const handlePointerMove = (event) => {
      setDraggingCard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          x: event.clientX - prev.offsetX,
          y: event.clientY - prev.offsetY,
        };
      });
    };

    const handlePointerUp = (event) => {
      const folderRect = folderRef.current?.getBoundingClientRect();
      if (
        folderRect &&
        event.clientX >= folderRect.left &&
        event.clientX <= folderRect.right &&
        event.clientY >= folderRect.top &&
        event.clientY <= folderRect.bottom
      ) {
        setCollected((prev) => (prev.includes(draggingCard.id) ? prev : [...prev, draggingCard.id]));
      }

      setDraggingCard(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingCard]);

  useEffect(() => {
    if (!allCollected) {
      setTextReady(false);
      return undefined;
    }
    setFolderReady(false);
    const timer = window.setTimeout(() => {
      setTextReady(true);
    }, 620);

    return () => {
      window.clearTimeout(timer);
    };
  }, [allCollected]);

  const handlePointerDown = (card) => (event) => {
    if (!folderReady) return;
    const [id, title, lines, image, imageClass] = card;
    if (collected.includes(id)) return;

    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    setDraggingCard({
      id,
      title,
      lines,
      image,
      imageClass,
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    });
  };

  return (
    <section ref={sectionRef} className={`${styles.panel} ${styles.approachPanel}`}>
      <ScrollFloatTitle title="Approach" active={2} className={styles.approachTitle} />

      <div className={styles.approachList}>
        {approachCards.map((card, index) => {
          const [number, title, lines, image, imageClass] = card;
          const isCollected = collected.includes(number);
          const isDragging = draggingCard?.id === number;

          return (
            <AnimatedContent key={title} delay={0.08 + index * 0.14} distance={24} blur={8} scale={0.985}>
              <article
                className={`${styles.approachCard} ${isCollected ? styles.approachCardCollected : ''} ${
                  isDragging ? styles.approachCardDragging : ''
                }`}
                onPointerDown={handlePointerDown(card)}
              >
                <div className={styles.approachFigureWrap}>
                  <img src={image} alt="" className={imageClass} draggable={false} />
                </div>
                <div className={styles.approachCardText}>
                  <h3>
                    <span>{number}</span>
                    {title}
                  </h3>
                  <p>
                    {lines.map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              </article>
            </AnimatedContent>
          );
        })}
      </div>

      <div
        ref={folderRef}
        className={`${styles.folderDrop} ${folderReady ? styles.folderDropVisible : ''} ${
          draggingCard ? styles.folderDropActive : ''
        }`}
      >
        <img src={imgApproachFolder} alt="" className={styles.folderImage} />
        <p>
          <img src={imgApproachDrag} alt="" />
          파일을 드래그해서 폴더 안에 넣어주세요
        </p>
      </div>
      <div className={`${styles.approachSummary} ${textReady ? styles.approachSummaryVisible : ''}`}>
        <img src={imgApproachSummaryLeft} alt="" className={styles.approachSummaryImageLeft} />
        <img src={imgApproachSummaryTop} alt="" className={styles.approachSummaryImageTop} />
        <img src={imgApproachSummaryCenter} alt="" className={styles.approachSummaryImageCenter} />

        <div className={styles.approachText}>
          <p>
            저는 완성된 결과물보다 <strong>사용자가 왜 이 화면에서 멈추고, 어디로 이동해야 하는지</strong>를 생각합니다.
          </p>
          <p>복잡한 구조를 단순한 흐름으로 정리하고, 그 흐름에 어울리는 시각적 무드를 더하며 디자인합니다.</p>
        </div>
      </div>

      {draggingCard && (
        <div
          className={`${styles.approachCard} ${styles.approachCardGhost}`}
          style={{
            left: draggingCard.x,
            top: draggingCard.y,
            width: draggingCard.width,
            height: draggingCard.height,
          }}
        >
          <div className={styles.approachFigureWrap}>
            <img src={draggingCard.image} alt="" className={draggingCard.imageClass} draggable={false} />
          </div>
          <div className={styles.approachCardText}>
            <h3>
              <span>{draggingCard.id}</span>
              {draggingCard.title}
            </h3>
            <p>
              {draggingCard.lines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function EssenceSection() {
  return (
    <section className={`${styles.panel} ${styles.essencePanel}`}>
      <div className={styles.essenceIntro}>
        <ScrollFloatTitle title="Essence" active={3} align="left" />
        <p>
          그래서 저는 어떤 디자이너가 되고 싶은지,
          <br />
          만들고 배우며 스스로에게 던진 질문들을 하나씩 꺼내봅니다.
        </p>
      </div>
      <div className={styles.questionList}>
        {questions.map(([number, question, answer]) => (
          <article className={styles.questionItem} key={number}>
            <div className={styles.questionBubble}>
              <strong>{number}</strong>
              <span>{question}</span>
            </div>
            <p className={styles.delivered}>Delivered</p>
            <div className={styles.answerBubble}>{answer}</div>
            <p className={styles.sender}>CHAEI</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function InvitationKeyScene({ onActivate, pressSignal, active }) {
  const canvasRef = useRef(null);
  const keycapRef = useRef(null);
  const frameRef = useRef(0);
  const renderRef = useRef(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const width = 280;
    const height = 387;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 5.2, 5.75);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.34));

    const keyLight = new THREE.DirectionalLight(0xfffaf0, 2.45);
    keyLight.position.set(-5, 9, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffd8a0, 0.78);
    fillLight.position.set(6, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc8d8ff, 0.42);
    rimLight.position.set(-3, -1, -6);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0xffeed8, 0.58, 25);
    pointLight.position.set(0, 7, 1);
    scene.add(pointLight);

    const keycap = createKeycap(
      {
        letter: 'C',
        color: '#EDE8DF',
        textColor: '#1C1C1C',
        glow: '#FF8040',
        emissive: '#C05228',
        labelFont: 'nohemi',
      },
      0,
    );
    keycap.position.set(0, -0.55, 0.18);
    keycap.rotation.x = 0.06;
    keycap.rotation.y = -0.16;
    keycap.scale.setScalar(1.42);
    keycap.userData.restY = -0.55;
    keycap.userData.index = 0;
    keycap.userData.isCompleting = false;
    scene.add(keycap);
    keycapRef.current = keycap;
    startFloat(keycap, 0);

    const render = () => {
      renderer.render(scene, camera);
      if (!activeRef.current) {
        frameRef.current = 0;
        return;
      }
      frameRef.current = window.requestAnimationFrame(render);
    };
    renderRef.current = render;
    render();

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      renderRef.current = null;
      if (keycapRef.current) stopFloat(keycapRef.current);
      keycapRef.current = null;
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose?.();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => mat.dispose?.());
          } else {
            obj.material?.dispose?.();
          }
        }
      });
    };
  }, []);

  useEffect(() => {
    if (!pressSignal) return;
    if (keycapRef.current) animatePress(keycapRef.current);
  }, [pressSignal]);

  useEffect(() => {
    if (!active || frameRef.current || !renderRef.current) return;
    renderRef.current();
  }, [active]);

  return (
    <button type="button" className={styles.invitationKeyButton} onClick={onActivate} aria-label="Open contact card">
      <canvas ref={canvasRef} className={styles.invitationKeyCanvas} />
    </button>
  );
}

function InvitationSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pressSignal, setPressSignal] = useState(0);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    const root = document.querySelector('.appScroll');
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.35, root: root ?? null },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return undefined;

    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === 'c') {
        setPressSignal((prev) => prev + 1);
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  return (
    <section ref={sectionRef} className={`${styles.panel} ${styles.invitationPanel}`}>
      <InvitationKeyScene
        active={isVisible}
        pressSignal={pressSignal}
        onActivate={() => {
          setPressSignal((prev) => prev + 1);
          setIsOpen((prev) => !prev);
        }}
      />
      <div className={styles.invitationTitle}>
        <ScrollFloatTitle title="Invitation" active={4} />
        <p>포트폴리오 공유가 거의 완료되었습니다.</p>
        <strong>이제 마지막 키를 눌러, 다음 연결을 시작해보세요.</strong>
      </div>
      <aside className={`${styles.contactCard} ${isOpen ? styles.contactCardVisible : styles.contactCardHidden}`}>
        <div className={styles.contactTitle}>
          <h3>Contact us</h3>
          <p>채이 님이 연락처를 공유하려고 합니다.</p>
        </div>
        <img src={asset('profile.png')} alt="채이 연락처 이미지" />
        <div className={styles.contactActions}>
          <button type="button">View Again</button>
          <button type="button">Accept</button>
        </div>
      </aside>
    </section>
  );
}

const MemoHighlightsSection = memo(HighlightsSection);
const MemoApproachSection = memo(ApproachSection);
const MemoEssenceSection = memo(EssenceSection);
const MemoInvitationSection = memo(InvitationSection);

export function MainPage({ isActive = false, scrollProgress = 0 }) {
  return (
    <main className={styles.page}>
      <CharacterSection isActive={isActive} scrollProgress={scrollProgress} />
      <MemoHighlightsSection />
      <MemoApproachSection />
      <MemoEssenceSection />
      <MemoInvitationSection />
    </main>
  );
}

export default MainPage;
