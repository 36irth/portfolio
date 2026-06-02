import { memo, useEffect, useMemo, useRef, useState } from 'react';
import SplitText from '../components/KeyboardIntro/SplitText';
import CharacterKeyDisplay from './CharacterKeyDisplay';
import styles from './MainPage.module.css';

const asset = (name) => `/assets/portfolio/${name}`;

const imgHighlightsProject = asset('project-1.png');
const imgHighlightsProject1 = asset('project-2.png');
const imgHighlightsProject2 = asset('project-3.png');
const imgHighlightsProject3 = asset('project-4.png');
const imgHighlightsProject4 = asset('project-5.png');
const imgHighlightsProject5 = asset('project-6.png');
const imgHighlightsArrow = asset('highlight-arrow.svg');

const imgApproachObserve = 'https://www.figma.com/api/mcp/asset/1a3b138a-4381-4877-8aec-251314aeb84b';
const imgApproachOrganize = 'https://www.figma.com/api/mcp/asset/ebc34bbf-f772-49dc-99f6-65425e915f67';
const imgApproachVisualize = 'https://www.figma.com/api/mcp/asset/b6921018-ba90-43b5-9514-c561ab8323f4';
const imgApproachFolder = 'https://www.figma.com/api/mcp/asset/4a631a50-94c8-44c8-935a-5d6ca915ff01';
const imgApproachDrag = 'https://www.figma.com/api/mcp/asset/b9803712-340d-46d5-a156-86f68a82e175';
const imgApproachSummaryTop = asset('approach-image55.png');
const imgApproachSummaryLeft = 'https://www.figma.com/api/mcp/asset/98bf9130-9092-4e82-8723-ce85f5064582';
const imgApproachSummaryCenter = 'https://www.figma.com/api/mcp/asset/e1d77281-a5d2-46aa-8dd1-76b70d10006a';
const imgApproachFolderBack = asset('folder-back.png');
const imgApproachFolderFront = asset('folder-front.png');
const imgProcessIa = asset('process-ia.png');
const imgProcessLean = asset('process-lean.png');
const imgProcessFlow = asset('process-flow.png');
const imgProcessChevron = asset('chevron-right.svg');
const imgProcessCheck = asset('process-check.svg');
const imgProcessIconIa = asset('process-icon-ia.png');
const imgProcessIconLean = asset('process-icon-lean.png');
const imgProcessIconFlow = asset('process-icon-flow.png');

const imgAward = 'https://www.figma.com/api/mcp/asset/e2707fcb-a858-4bcc-b38c-1dbf37f21cfb';
const imgCertificateIcon = 'https://www.figma.com/api/mcp/asset/59f0f208-8f4d-4ace-8131-785b76c7cda8';
const imgToolHeader = 'https://www.figma.com/api/mcp/asset/111b02b5-bba7-41d3-a04e-5255b7e164b8';
const imgWindowClose = 'https://www.figma.com/api/mcp/asset/71376b88-e591-4baa-907d-1e3da0e78243';
const imgToolFigma = asset('figma.png');
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
  ['Gemini', 'Writing / Product management', asset('gemini.png')],
];

const highlightLargeProjects = [
  {
    image: imgHighlightsProject,
    eyebrow: '에어소프트건 팬덤 커뮤니티 앱',
    title: 'GUNIT',
    buttons: ['App', 'Slide'],
    imageClass: styles.highlightProjectImageA,
    overlayClass: styles.highlightOverlayA,
  },
  {
    image: imgHighlightsProject1,
    eyebrow: '콘서트 특화 일정 공유 앱',
    title: 'STAG',
    buttons: ['Prototype'],
    imageClass: styles.highlightProjectImageB,
    overlayClass: styles.highlightOverlayB,
  },
  {
    image: imgHighlightsProject2,
    eyebrow: 'K-Brand 글로벌 웹사이트 리뉴얼',
    title: '롬앤',
    buttons: ['Web', 'Slide'],
    imageClass: styles.highlightProjectImageC,
    overlayClass: styles.highlightOverlayC,
  },
];

const highlightSmallProjects = [
  {
    image: imgHighlightsProject3,
    eyebrow: 'RE 프로젝트',
    title: '대학농구 홈커밍',
    buttons: ['pdf'],
    imageClass: styles.highlightProjectImageD,
  },
  {
    image: imgHighlightsProject4,
    eyebrow: '로컬 브랜드 로고 리디자인',
    title: '카페유일',
    buttons: ['pdf'],
    imageClass: styles.highlightProjectImageE,
  },
  {
    image: imgHighlightsProject5,
    eyebrow: '웹디자인 졸업전시',
    title: '알렉산더맥퀸',
    buttons: ['Prototype'],
    imageClass: styles.highlightProjectImageF,
  },
];

const getHighlightHref = (group, projectIndex, label) => {
  const normalized = label.toLowerCase();
  if (group === 'large' && projectIndex === 0 && ['site', 'app'].includes(normalized)) {
    return 'https://airsoft-nine.vercel.app/';
  }
  if (group === 'large' && projectIndex === 0 && normalized === 'slide') {
    return 'https://www.figma.com/deck/DOYuW7zigrKfKCXuutEt1d';
  }
  if (group === 'large' && projectIndex === 1 && ['site', 'prototype'].includes(normalized)) {
    return 'https://www.figma.com/proto/Q4RWt5mGXgO47PjRUCVS3Y/%EA%B9%80%EC%B1%84%EC%9D%B4?node-id=579-1763&t=rsfcqL7jkvfqttzP-1';
  }
  if (group === 'large' && projectIndex === 2 && ['pdf', 'slide'].includes(normalized)) {
    return 'https://www.figma.com/deck/KbN24gyULgtsJZ3NgeslmB';
  }
  return '';
};

const approachCards = [
  ['1', 'Observe', ['사용자가 어디서 불편함을', '느끼는지 파악합니다'], imgApproachObserve, styles.approachFigureObserve],
  ['2', 'Organize', ['사용자가 다음 행동을 쉽게', '찾을 수 있도록 정리합니다'], imgApproachOrganize, styles.approachFigureOrganize],
  ['3', 'Visualize', ['기능 뿐만이 아닌,', '기억에 남는 화면을 만듭니다'], imgApproachVisualize, styles.approachFigureVisualize],
];

const questions = [
  [
    '01',
    '고등학교부터 대학교까지, 왜 디자인을 전공하게 되었나요?',
    '어릴 때부터 시각적으로 아름다운 것을 만드는 일을 좋아해 자연스럽게 시각디자인을 전공했고, 졸업 무렵 UI/UX의 사용자 경험 설계 개념에 흥미를 느껴 올해부터 본격적으로 공부를 시작했습니다.',
  ],
  [
    '02',
    '어떤 디자이너가 되고 싶나요?',
    '앞으로는 저의 취향에만 머무는 것이 아닌, 다른 사람에게 닿는 디자인을 해보고 싶습니다. 화면 설계에만 그치지 않고 사용자 리서치와 데이터 기반의 개선 과정까지 이해할 수 있는 디자이너로 성장하는 것이 목표입니다.',
  ],
  [
    '03',
    '앞으로 무엇을 배우고 싶나요?',
    'UI/UX 디자인 역량을 쌓아가는 동시에 장기적으로는 블렌더, 어도비 디멘션 같은 3D 툴을 익혀 시각적 표현의 폭을 넓히고 싶습니다. 또한 일본어, 중국어 등 낯선 언어를 배우며 다양한 문화권의 디자인 감각을 흡수하는 것도 목표 중 하나입니다.',
  ],
  [
    '04',
    'AI가 자연스러운 도구가 된 지금, 디자이너는 무엇을 직접 판단해야 할까요?',
    'AI에 의존하지 않는 것이라고 생각합니다. 직접 사용해보니 도움을 받을수록 오히려 사고가 막히는 경험을 했고, 그래서 큰 그림은 스스로 그린 뒤 신선한 시각이 필요한 순간에만 활용하는 방식을 선호합니다. 처음부터 끝까지 맡기는 것이 아니라, 내 작업 과정의 일부로 두는 것이 중요하다고 생각합니다.',
  ],
];

const formatQuestion = (number, question) => question;
const characterReturnProgress = 0.38;
const isCompactViewport = () => window.matchMedia?.('(max-width: 680px)').matches ?? window.innerWidth <= 680;

const scrollToMainTop = () => {
  window.__portfolioSuppressEssenceSnapUntil = Date.now() + 1400;
  window.__portfolioSuppressApproachPinUntil = Date.now() + 2600;
  window.dispatchEvent(new CustomEvent('portfolio:scroll-lock', { detail: { locked: false } }));
  window.dispatchEvent(new CustomEvent('portfolio:character-reset'));
  requestAppScrollTo(window.innerHeight * 3.2 * characterReturnProgress, 'smooth');
};

const requestAppScrollLock = (locked, top) => {
  window.dispatchEvent(new CustomEvent('portfolio:scroll-lock', { detail: { locked, top } }));
};

const requestAppScrollTo = (top, behavior = 'smooth') => {
  window.dispatchEvent(new CustomEvent('portfolio:scroll-to', { detail: { top, behavior } }));
};

const keys = ['C', 'H', 'A', 'E', 'I'];
const sectionLetters = ['c', 'h', 'a', 'e', 'i'];
const sectionEntries = [
  { id: 'character', letter: 'c', label: 'Character' },
  { id: 'highlights', letter: 'h', label: 'Highlights' },
  { id: 'approach', letter: 'a', label: 'Approach' },
  { id: 'essence', letter: 'e', label: 'Essence' },
  { id: 'invitation', letter: 'i', label: 'Invitation' },
];
const floatDelays = [0.01, 0.12, 0.06, 0.18, 0.09, 0.16, 0.03];
const characterWindowIds = ['awards', 'tools', 'profile', 'ai', 'certificate', 'school-one', 'school-two'];

const cleanAwards = [
  ['블루어워즈', '시각디자인 분야 입선', '2022.06.14'],
  ['블루어워즈', '시각디자인 분야 입선', '2022.06.22'],
  ['관악현대미술대전', '디자인 분야 특선', '2023.11.21'],
];

const cleanCertificates = [
  ['웹디자인개발기능사(필기)', '26.01.24'],
  ['컴퓨터그래픽기능사', '19.07.19'],
  ['JLPT N2', '19.01.20'],
];

const cleanApproachCards = [
  ['1', 'Observe', ['사용자가 어디서 불편함을', '느끼는지 파악합니다.'], imgApproachObserve, styles.approachFigureObserve],
  ['2', 'Organize', ['사용자가 다음 행동을 쉽게', '찾을 수 있도록 정리합니다.'], imgApproachOrganize, styles.approachFigureOrganize],
  ['3', 'Visualize', ['기능 뿐만이 아닌,', '기억에 남는 화면을 만듭니다'], imgApproachVisualize, styles.approachFigureVisualize],
];

const processCards = [
  {
    id: 'ia',
    label: 'IA Structural Design',
    image: imgProcessIa,
    icon: imgProcessIconIa,
    imageClass: styles.processCardImageIa,
  },
  {
    id: 'lean',
    label: 'Lean Canvas',
    image: imgProcessLean,
    icon: imgProcessIconLean,
    imageClass: styles.processCardImageLean,
  },
  {
    id: 'flow',
    label: 'User Flow',
    image: imgProcessFlow,
    icon: imgProcessIconFlow,
    imageClass: styles.processCardImageFlow,
  },
];

const cleanQuestions = [
  [
    '01',
    '고등학교부터 대학교까지, 왜 디자인을 전공하게 되었나요?',
    '어릴 때부터 시각적으로 아름다운 것을 만드는 일을 좋아해 자연스럽게 시각디자인을 전공했고, 졸업 무렵 UI/UX의 사용자 경험 설계 개념에 흥미를 느껴 올해부터 본격적으로 공부를 시작했습니다.',
  ],
  [
    '02',
    '어떤 디자이너가 되고 싶나요?',
    '앞으로는 저의 취향에만 머무는 것이 아닌, 다른 사람에게 닿는 디자인을 해보고 싶습니다. 화면 설계에만 그치지 않고 사용자 리서치와 데이터 기반의 개선 과정까지 이해할 수 있는 디자이너로 성장하는 것이 목표입니다.',
  ],
  [
    '03',
    '앞으로 무엇을 더 배우고 싶나요?',
    'UI/UX 디자인 역량을 쌓아가는 동시에 장기적으로는 블렌더, 어도비 디멘션 같은 3D 툴을 익혀 시각적 표현의 폭을 넓히고 싶습니다. 또한 일본어, 중국어 등 낯선 언어를 배우며 다양한 문화권의 디자인 감각을 흡수하는 것도 목표 중 하나입니다.',
  ],
  [
    '04',
    'AI가 자연스러운 도구가 된 지금, 디자이너는 무엇을 직접 판단해야 할까요?',
    'AI에 의존하지 않는 것이라고 생각합니다. 직접 사용해보니 도움을 받을수록 오히려 사고가 막히는 경험을 했고, 그래서 큰 그림은 스스로 그린 뒤 신선한 시각이 필요한 순간에만 활용하는 방식을 선호합니다. 처음부터 끝까지 맡기는 것이 아니라, 내 작업 과정의 일부로 두는 것이 중요하다고 생각합니다.',
  ],
];

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
    <div className={`${styles.keyboardBadge} ${styles.scrollFloatBadge}`} aria-hidden="true">
      {keys.map((key, index) => (
        <span
          key={key}
          className={index === active ? styles.keyActive : styles.keyInactive}
          style={{ '--badge-index': index }}
        >
          {key}
        </span>
      ))}
    </div>
  );
}

function FloatingTitleText({ title, visible }) {
  return (
    <h2>
      {title.split('').map((char, index) => (
        <span
          key={`${char}-${index}`}
          className={`${styles.scrollFloatGlyph} ${index === 0 ? styles.scrollFloatAccent : ''}`}
          style={{ '--float-index': index }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h2>
  );
}

function ScrollFloatTitle({ title, active = 0, align = 'center', className = '' }) {
  const [ref, visible] = useReplayInView(0.32, '0px 0px -10% 0px');

  return (
    <header
      ref={ref}
      className={`${styles.sectionTitle} ${styles.scrollFloatTitle} ${
        visible ? styles.scrollFloatTitleVisible : ''
      } ${align === 'left' ? styles.sectionTitleLeft : ''} ${className}`}
    >
      <KeyboardBadge active={active} />
      <FloatingTitleText title={title} visible={visible} />
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
    <header
      className={`${styles.sectionTitle} ${styles.scrollFloatTitle} ${
        isActive ? styles.scrollFloatTitleVisible : ''
      } ${styles.sectionTitleLeft} ${styles.characterTitle}`}
    >
      <div
        className={`${styles.keyboardBadge} ${styles.scrollFloatBadge} ${isActive ? styles.titlePartReady : ''}`}
        aria-hidden="true"
      >
        {keys.map((key, index) => (
          <span
            key={key}
            className={index === 0 ? styles.keyActive : styles.keyInactive}
            style={{ '--badge-index': index }}
          >
            {key}
          </span>
        ))}
      </div>
      <FloatingTitleText title="Character" visible={isActive} />
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
      {' '}
      <strong className={styles.accentChunk} style={{ '--chunk-index': 2 }}>
        UI/UX 디자이너
      </strong>
      <span className={styles.accentChunk} style={{ '--chunk-index': 3 }}>
        를 지향합니다.
      </span>
    </div>
  );
}

const AiIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M9.107 5.448C9.705 3.698 12.123 3.645 12.832 5.289L12.892 5.449L13.699 7.809C13.8839 8.35023 14.1828 8.84551 14.5754 9.26142C14.9681 9.67734 15.4453 10.0042 15.975 10.22L16.192 10.301L18.552 11.107C20.302 11.705 20.355 14.123 18.712 14.832L18.552 14.892L16.192 15.699C15.6506 15.8838 15.1551 16.1826 14.739 16.5753C14.3229 16.9679 13.9959 17.4452 13.78 17.975L13.699 18.191L12.893 20.552C12.295 22.302 9.877 22.355 9.169 20.712L9.107 20.552L8.301 18.192C8.11618 17.6506 7.81737 17.1551 7.42474 16.739C7.03211 16.3229 6.55479 15.9959 6.025 15.78L5.809 15.699L3.449 14.893C1.698 14.295 1.645 11.877 3.289 11.169L3.449 11.107L5.809 10.301C6.35023 10.1161 6.84551 9.81719 7.26142 9.42457C7.67733 9.03195 8.00421 8.55469 8.22 8.025L8.301 7.809L9.107 5.448ZM19 2C19.1871 2 19.3704 2.05248 19.5292 2.15147C19.6879 2.25046 19.8157 2.392 19.898 2.56L19.946 2.677L20.296 3.703L21.323 4.053C21.5105 4.1167 21.6748 4.23462 21.7952 4.39182C21.9156 4.54902 21.9866 4.73842 21.9993 4.93602C22.0119 5.13362 21.9656 5.33053 21.8662 5.50179C21.7668 5.67304 21.6188 5.81094 21.441 5.898L21.323 5.946L20.297 6.296L19.947 7.323C19.8832 7.51043 19.7652 7.6747 19.6079 7.79499C19.4507 7.91529 19.2612 7.98619 19.0636 7.99872C18.866 8.01125 18.6692 7.96484 18.498 7.86538C18.3268 7.76591 18.189 7.61787 18.102 7.44L18.054 7.323L17.704 6.297L16.677 5.947C16.4895 5.8833 16.3252 5.76538 16.2048 5.60819C16.0844 5.45099 16.0134 5.26158 16.0007 5.06398C15.9881 4.86638 16.0344 4.66947 16.1338 4.49821C16.2332 4.32696 16.3812 4.18906 16.559 4.102L16.677 4.054L17.703 3.704L18.053 2.677C18.1204 2.47943 18.248 2.30791 18.4178 2.1865C18.5877 2.06509 18.7912 1.99987 19 2Z" fill="#A3A3A3" />
  </svg>
);

function GlassHeader({ icon, label }) {
  return (
    <div className={styles.glassHeader}>
      <div className={styles.windowTitle}>
        {typeof icon === 'string' ? <img src={icon} alt="" /> : icon}
        <strong>{label}</strong>
      </div>
      <img src={imgWindowClose} alt="" className={styles.windowClose} />
    </div>
  );
}

function CharacterSection({ isActive, scrollProgress, sectionRef, resetSignal }) {
  const internalSectionRef = useRef(null);
  const resolvedSectionRef = sectionRef ?? internalSectionRef;
  const copyReady = isActive;
  const initialOffsets = useMemo(
    () => Object.fromEntries(characterWindowIds.map((id) => [id, { x: 0, y: 0 }])),
    [],
  );
  const initialAwardOffsets = useMemo(
    () => Object.fromEntries(cleanAwards.map(([line1, line2, date]) => [`${line1}-${line2}-${date}`, { x: 0, y: 0 }])),
    [],
  );
  const [dismissedWindows, setDismissedWindows] = useState(() => new Set());
  const [dismissedAwards, setDismissedAwards] = useState(() => new Set());
  const [windowOffsets, setWindowOffsets] = useState(initialOffsets);
  const [awardOffsets, setAwardOffsets] = useState(initialAwardOffsets);
  const [draggingWindowId, setDraggingWindowId] = useState('');
  const [draggingAwardKey, setDraggingAwardKey] = useState('');
  const dragWindowRef = useRef(null);
  const awardsDismissed = dismissedAwards.size >= cleanAwards.length;
  const allWindowsDismissed = dismissedWindows.size >= characterWindowIds.length - 1 && awardsDismissed;

  const clampDragOffset = (dragState, deltaX, deltaY) => {
    const nextX = dragState.baseX + deltaX;
    const nextY = dragState.baseY + deltaY;
    if (!dragState.startRect || !dragState.bounds) {
      return { x: nextX, y: nextY };
    }

    const minX = dragState.baseX + dragState.bounds.left - dragState.startRect.left;
    const maxX = dragState.baseX + dragState.bounds.right - dragState.startRect.right;
    const minY = dragState.baseY + dragState.bounds.top - dragState.startRect.top;
    const maxY = dragState.baseY + dragState.bounds.bottom - dragState.startRect.bottom;

    return {
      x: minX <= maxX ? Math.max(minX, Math.min(maxX, nextX)) : nextX,
      y: minY <= maxY ? Math.max(minY, Math.min(maxY, nextY)) : nextY,
    };
  };

  useEffect(() => {
    if (!isActive || scrollProgress < 0.14 || scrollProgress > 0.9) {
      setDismissedWindows(new Set());
      setDismissedAwards(new Set());
      setWindowOffsets(initialOffsets);
      setAwardOffsets(initialAwardOffsets);
      setDraggingWindowId('');
      setDraggingAwardKey('');
      dragWindowRef.current = null;
    }
  }, [initialAwardOffsets, initialOffsets, isActive, scrollProgress]);

  useEffect(() => {
    if (!resetSignal) return;
    setDismissedWindows(new Set());
    setDismissedAwards(new Set());
    setWindowOffsets(initialOffsets);
    setAwardOffsets(initialAwardOffsets);
    setDraggingWindowId('');
    setDraggingAwardKey('');
    dragWindowRef.current = null;
  }, [resetSignal, initialAwardOffsets, initialOffsets]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const dragState = dragWindowRef.current;
      if (!dragState) return;

      const deltaX = event.clientX - dragState.startX;
      const deltaY = event.clientY - dragState.startY;
      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        dragState.moved = true;
      }

      if (dragState.type === 'award') {
        const next = clampDragOffset(dragState, deltaX, deltaY);
        setAwardOffsets((prev) => ({
          ...prev,
          [dragState.id]: {
            x: next.x,
            y: next.y,
          },
        }));
        return;
      }

      const next = clampDragOffset(dragState, deltaX, deltaY);
      setWindowOffsets((prev) => ({
        ...prev,
        [dragState.id]: {
          x: next.x,
          y: next.y,
        },
      }));
    };

    const handlePointerUp = () => {
      const dragState = dragWindowRef.current;
      if (!dragState) return;

      if (!dragState.moved && dragState.type === 'award') {
        setDismissedAwards((prev) => {
          const next = new Set(prev);
          next.add(dragState.id);
          return next;
        });
      } else if (!dragState.moved && dragState.id !== 'awards') {
        setDismissedWindows((prev) => {
          const next = new Set(prev);
          next.add(dragState.id);
          return next;
        });
      }

      dragWindowRef.current = null;
      setDraggingWindowId('');
      setDraggingAwardKey('');
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const characterWindowClass = (id, index) => {
    const visible = getFloatState(isActive, scrollProgress, index);
    const dismissed = visible && (id === 'awards' ? awardsDismissed : dismissedWindows.has(id));
    return `${styles.characterFloat} ${styles.characterWindowInteractive} ${
      draggingWindowId === id ? styles.characterWindowDragging : ''
    } ${visible && !dismissed ? styles.characterFloatVisible : ''} ${
      dismissed ? styles.characterFloatDismissed : ''
    }`;
  };

  const handleWindowPointerDown = (id, index) => (event) => {
    if (!getFloatState(isActive, scrollProgress, index)) return;
    dragWindowRef.current = {
      type: 'window',
      id,
      index,
      startX: event.clientX,
      startY: event.clientY,
      baseX: windowOffsets[id]?.x ?? 0,
      baseY: windowOffsets[id]?.y ?? 0,
      startRect: event.currentTarget.getBoundingClientRect(),
      bounds: {
        left: 24,
        top: 24,
        right: window.innerWidth - 24,
        bottom: window.innerHeight - 24,
      },
      moved: false,
    };
    setDraggingWindowId(id);
  };

  const handleAwardPointerDown = (awardKey) => (event) => {
    if (dismissedAwards.has(awardKey)) return;
    event.preventDefault();
    event.stopPropagation();
    dragWindowRef.current = {
      type: 'award',
      id: awardKey,
      startX: event.clientX,
      startY: event.clientY,
      baseX: awardOffsets[awardKey]?.x ?? 0,
      baseY: awardOffsets[awardKey]?.y ?? 0,
      startRect: event.currentTarget.getBoundingClientRect(),
      bounds: {
        left: 24,
        top: 24,
        right: window.innerWidth - 24,
        bottom: window.innerHeight - 24,
      },
      moved: false,
    };
    setDraggingAwardKey(awardKey);
  };

  const getWindowStyle = (id, index) => ({
    ...floatStyle(index),
    '--drag-x': `${windowOffsets[id]?.x ?? 0}px`,
    '--drag-y': `${windowOffsets[id]?.y ?? 0}px`,
  });

  const getAwardStyle = (awardKey) => ({
    '--award-drag-x': `${awardOffsets[awardKey]?.x ?? 0}px`,
    '--award-drag-y': `${awardOffsets[awardKey]?.y ?? 0}px`,
  });

  const handleCharacterWheel = (event) => {
    if (!allWindowsDismissed || event.deltaY <= 0) return;
    event.preventDefault();
    resolvedSectionRef.current?.nextElementSibling?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section
      ref={resolvedSectionRef}
      data-section="character"
      className={styles.characterScrollSection}
      onWheel={handleCharacterWheel}
    >
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

        <div
          className={`${styles.awards} ${characterWindowClass('awards', 6)}`}
          style={getWindowStyle('awards', 6)}
          onPointerDown={handleWindowPointerDown('awards', 6)}
        >
          {cleanAwards.map(([line1, line2, date]) => {
            const awardKey = `${line1}-${line2}-${date}`;
            const isDismissed = dismissedAwards.has(awardKey);
            return (
              <article
                className={`${styles.awardItem} ${draggingAwardKey === awardKey ? styles.awardItemDragging : ''} ${
                  isDismissed ? styles.awardItemDismissed : ''
                }`}
                key={awardKey}
                style={getAwardStyle(awardKey)}
                onPointerDown={handleAwardPointerDown(awardKey)}
              >
                <img src={imgAward} alt="" />
                <div>
                  <p>{line1}</p>
                  <p>{line2}</p>
                  <time>{date}</time>
                </div>
              </article>
            );
          })}
        </div>

        <aside
          className={`${styles.glassCard} ${styles.designToolsCard} ${characterWindowClass('tools', 0)}`}
          style={getWindowStyle('tools', 0)}
          onPointerDown={handleWindowPointerDown('tools', 0)}
        >
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

        <aside
          className={`${styles.glassCard} ${styles.profileCard} ${characterWindowClass('profile', 1)}`}
          style={getWindowStyle('profile', 1)}
          onPointerDown={handleWindowPointerDown('profile', 1)}
        >
          <div className={styles.profileTitle}>
            <h3>Profile</h3>
            <p>김채이</p>
          </div>
          <img src={asset('profile.png')} alt="김채이 프로필" className={styles.profileImage} draggable={false} />
          <p className={styles.profileMeta}>2001.03.06</p>
          <p className={styles.profileMeta}>36irth@gmail.com</p>
        </aside>

        <aside
          className={`${styles.glassCard} ${styles.aiCard} ${characterWindowClass('ai', 2)}`}
          style={getWindowStyle('ai', 2)}
          onPointerDown={handleWindowPointerDown('ai', 2)}
        >
          <GlassHeader icon={AiIcon} label="AI" />
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

        <aside
          className={`${styles.glassCard} ${styles.certificateCard} ${characterWindowClass('certificate', 3)}`}
          style={getWindowStyle('certificate', 3)}
          onPointerDown={handleWindowPointerDown('certificate', 3)}
        >
          <div className={styles.cardTop}>
            <img src={imgCertificateIcon} alt="" />
            <strong>3</strong>
          </div>
          <h3>Certificate</h3>
          <div className={styles.certificateList}>
            {cleanCertificates.map(([label, date]) => (
              <p key={label}>
                <span>{label}</span>
                <time>{date}</time>
              </p>
            ))}
          </div>
        </aside>

        <div
          className={`${styles.chatBubble} ${characterWindowClass('school-one', 4)} ${styles.schoolOne}`}
          style={getWindowStyle('school-one', 4)}
          onPointerDown={handleWindowPointerDown('school-one', 4)}
        >
          <p>
            <span>2021~2023</span>
            <span>안산대학교 시각미디어디자인학과</span>
          </p>
        </div>
        <div
          className={`${styles.chatBubble} ${characterWindowClass('school-two', 5)} ${styles.schoolTwo}`}
          style={getWindowStyle('school-two', 5)}
          onPointerDown={handleWindowPointerDown('school-two', 5)}
        >
          <p>
            <span>2017~2020</span>
            <span>안산디자인문화고등학교 시각디자인과</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function HighlightsSection() {
  return (
    <section data-section="highlights" className={`${styles.panel} ${styles.highlightsPanel}`}>
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
                    {project.buttons.map((label) => {
                      const href = getHighlightHref('large', index, label);
                      const content = (
                        <>
                          <span>{label}</span>
                          <img src={imgHighlightsArrow} alt="" />
                        </>
                      );
                      return href ? (
                        <a key={label} href={href} target="_blank" rel="noreferrer" className={styles.highlightAction}>
                          {content}
                        </a>
                      ) : (
                        <button key={label} type="button" className={styles.highlightAction}>
                          {content}
                        </button>
                      );
                    })}
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

function ApproachSection({ onAllCollected }) {
  const sectionRef = useRef(null);
  const folderRef = useRef(null);
  const summaryRef = useRef(null);
  const processRef = useRef(null);
  const completedRef = useRef(false);
  const pinnedRef = useRef(false);
  const settlingRef = useRef(false);
  const processSnapLockRef = useRef(false);
  const processExitRef = useRef(false);
  const processWheelActiveRef = useRef(false);
  const approachPinTimerRef = useRef(0);
  const processReleaseTimerRef = useRef(0);
  const [collected, setCollected] = useState([]);
  const [draggingCard, setDraggingCard] = useState(null);
  const [folderReady, setFolderReady] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const [textReady, setTextReady] = useState(false);
  const [activeProcessIndex, setActiveProcessIndex] = useState(0);
  const [pressedProcessIndex, setPressedProcessIndex] = useState(0);
  const [isCompact, setIsCompact] = useState(() => (typeof window === 'undefined' ? false : isCompactViewport()));
  const allCollected = collected.length === approachCards.length;

  useEffect(() => {
    const syncCompact = () => setIsCompact(isCompactViewport());
    syncCompact();
    window.addEventListener('resize', syncCompact);
    return () => window.removeEventListener('resize', syncCompact);
  }, []);

  const getApproachTop = () => {
    const node = sectionRef.current;
    const scrollRoot = document.querySelector('.appScroll');
    if (!node || !scrollRoot) return null;

    const rect = node.getBoundingClientRect();
    const rootRect = scrollRoot.getBoundingClientRect();
    return scrollRoot.scrollTop + rect.top - rootRect.top;
  };

  const getProcessPinnedTop = () => {
    const summary = summaryRef.current;
    const scrollRoot = document.querySelector('.appScroll');
    const section = sectionRef.current;
    if (!summary || !scrollRoot || !section) return null;

    const sectionTop = getApproachTop();
    if (sectionTop == null) return null;

    return sectionTop + summary.offsetTop + Math.max(0, summary.offsetHeight - scrollRoot.clientHeight);
  };

  const pinApproachView = (behavior = 'smooth') => {
    const scrollRoot = document.querySelector('.appScroll');
    const targetTop = getApproachTop();
    if (!scrollRoot || targetTop == null) return;
    if (behavior === 'lock') {
      requestAppScrollLock(true, targetTop);
      return;
    }
    scrollRoot.scrollTo({ top: targetTop, behavior });
  };

  const isApproachPinSuppressed = () => Date.now() < (window.__portfolioSuppressApproachPinUntil ?? 0);

  const releaseApproachPin = () => {
    pinnedRef.current = false;
    settlingRef.current = false;
    window.clearTimeout(approachPinTimerRef.current);
    requestAppScrollLock(false);
  };

  useEffect(() => {
    completedRef.current = allCollected;
    onAllCollected?.(allCollected);
  }, [allCollected, onAllCollected]);

  useEffect(() => {
    if (isCompact) return undefined;
    const node = sectionRef.current;
    if (!node) return undefined;
    const scrollRoot = document.querySelector('.appScroll');

    let timeoutId = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (completedRef.current) return;
          window.clearTimeout(timeoutId);
          timeoutId = window.setTimeout(() => {
            if (pinnedRef.current) setFolderReady(true);
          }, 850);
          return;
        }

        window.clearTimeout(timeoutId);
        if (completedRef.current) return;
        releaseApproachPin();
        window.clearTimeout(processReleaseTimerRef.current);
        processExitRef.current = false;
        requestAppScrollLock(false);
        setFolderReady(false);
        setFolderOpen(false);
        setDraggingCard(null);
        setCollected([]);
        setTextReady(false);
      },
      { threshold: 0.32, root: scrollRoot ?? null },
    );

    observer.observe(node);
    return () => {
      window.clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [isCompact]);

  useEffect(() => {
    if (isCompact) return undefined;
    const scrollRoot = document.querySelector('.appScroll');
    if (!scrollRoot) return undefined;

    let frame = 0;
    let previousScrollTop = scrollRoot.scrollTop;
    const resetWhenReturningToCards = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const currentScrollTop = scrollRoot.scrollTop;
        const isScrollingUp = currentScrollTop < previousScrollTop;
        previousScrollTop = currentScrollTop;

        if (!isScrollingUp) return;
        if (!sectionRef.current) return;

        const rect = sectionRef.current.getBoundingClientRect();
        const isBackAtCardArea = rect.top > -420 && rect.top < window.innerHeight * 0.75;
        if (!isBackAtCardArea) return;

        completedRef.current = false;
        processWheelActiveRef.current = false;
        window.clearTimeout(processReleaseTimerRef.current);
        processExitRef.current = false;
        setCollected([]);
        setDraggingCard(null);
        setFolderOpen(false);
        setTextReady(false);
        setFolderReady(true);
        setActiveProcessIndex(0);
        setPressedProcessIndex(0);
      });
    };

    scrollRoot.addEventListener('scroll', resetWhenReturningToCards, { passive: true });
    return () => {
      scrollRoot.removeEventListener('scroll', resetWhenReturningToCards);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [isCompact]);

  useEffect(() => {
    if (!draggingCard) return undefined;

    const handlePointerMove = (event) => {
      setFolderOpen(true);
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
      const isInsideFolder =
        folderRect &&
        event.clientX >= folderRect.left &&
        event.clientX <= folderRect.right &&
        event.clientY >= folderRect.top &&
        event.clientY <= folderRect.bottom;

      if (isInsideFolder) {
        setCollected((prev) => (prev.includes(draggingCard.id) ? prev : [...prev, draggingCard.id]));
      }

      setDraggingCard(null);
      window.setTimeout(() => {
        setFolderOpen(false);
      }, isInsideFolder ? 360 : 0);
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
      processWheelActiveRef.current = false;
      setTextReady(false);
      setActiveProcessIndex(0);
      setPressedProcessIndex(0);
      processExitRef.current = false;
      return undefined;
    }
    pinnedRef.current = false;
    settlingRef.current = false;
    window.clearTimeout(approachPinTimerRef.current);
    requestAppScrollLock(false);
    setFolderReady(false);
    setFolderOpen(false);
    const scrollTimer = window.setTimeout(() => {
      const targetTop = getProcessPinnedTop();
      if (targetTop == null) return;
      requestAppScrollTo(targetTop, 'slow');
    }, 220);
    const revealTimer = window.setTimeout(() => {
      processWheelActiveRef.current = true;
      setTextReady(true);
    }, 620);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(revealTimer);
    };
  }, [allCollected]);

  const selectProcessCard = (nextIndex) => {
    const boundedIndex = Math.max(0, Math.min(processCards.length - 1, nextIndex));
    setActiveProcessIndex((prev) => {
      setPressedProcessIndex(boundedIndex);
      window.setTimeout(() => {
        setPressedProcessIndex((current) => (current === boundedIndex ? null : current));
      }, 260);
      if (prev === boundedIndex) return prev;
      return boundedIndex;
    });
  };

  const settleProcessSnapSoon = (delay = 620) => {
    window.clearTimeout(processReleaseTimerRef.current);
    processReleaseTimerRef.current = window.setTimeout(() => {
      processSnapLockRef.current = false;
      const targetTop = getProcessPinnedTop();
      if (targetTop != null) {
        requestAppScrollLock(true, targetTop);
      }
    }, delay);
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(processReleaseTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!allCollected || !textReady || isCompact) return undefined;
    const scrollRoot = document.querySelector('.appScroll');
    if (!scrollRoot) return undefined;

    const handleProcessWheel = (event) => {
      if (!processWheelActiveRef.current) return;
      const processNode = processRef.current;
      if (!processNode || Math.abs(event.deltaY) < 1) return;

      const rect = processNode.getBoundingClientRect();
      const rootRect = scrollRoot.getBoundingClientRect();
      const processCenter = rect.top + rect.height / 2;
      const viewportCenter = rootRect.top + rootRect.height / 2;
      const isProcessFocused =
        rect.top < rootRect.bottom - 80 &&
        rect.bottom > rootRect.top + 80 &&
        Math.abs(processCenter - viewportCenter) < rootRect.height * 0.42;

      if (!isProcessFocused) return;

      const direction = event.deltaY > 0 ? 1 : -1;
      const nextIndex = activeProcessIndex + direction;
      const targetTop = getProcessPinnedTop();

      if (nextIndex < 0) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        processSnapLockRef.current = false;
        processExitRef.current = false;
        window.clearTimeout(processReleaseTimerRef.current);
        requestAppScrollLock(false);
        const sectionTop = getApproachTop();
        if (sectionTop != null) {
          requestAppScrollTo(Math.max(0, sectionTop), 'slow');
        }
        return;
      }

      if (nextIndex >= processCards.length) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (processExitRef.current) return;
        if (targetTop != null) {
          requestAppScrollLock(true, targetTop);
        }
        if (processSnapLockRef.current) return;
        processSnapLockRef.current = true;
        processExitRef.current = true;
        processWheelActiveRef.current = false;
        window.clearTimeout(processReleaseTimerRef.current);
        processReleaseTimerRef.current = window.setTimeout(() => {
          const root = document.querySelector('.appScroll');
          const essence = document.querySelector('[data-section="essence"]');
          if (!root || !essence) {
            processSnapLockRef.current = false;
            processExitRef.current = false;
            requestAppScrollLock(false);
            return;
          }

          const rect = essence.getBoundingClientRect();
          const rootRect = root.getBoundingClientRect();
          const top = root.scrollTop + rect.top - rootRect.top;
          requestAppScrollLock(false);
          window.__portfolioSuppressEssenceSnapUntil = Date.now() + 3200;
          requestAppScrollTo(top, 'slow');
          window.setTimeout(() => {
            processSnapLockRef.current = false;
            processExitRef.current = false;
          }, 3200);
        }, 620);
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      if (targetTop != null) {
        requestAppScrollLock(true, targetTop);
      }
      if (processSnapLockRef.current) return;
      processSnapLockRef.current = true;
      selectProcessCard(nextIndex);
      settleProcessSnapSoon(620);
    };

    scrollRoot.addEventListener('wheel', handleProcessWheel, { passive: false, capture: true });
    return () => scrollRoot.removeEventListener('wheel', handleProcessWheel, { capture: true });
  }, [activeProcessIndex, allCollected, isCompact, textReady]);

  const handlePointerDown = (card) => (event) => {
    if (isCompact) return;
    if (!folderReady) return;
    const [id, title, lines, image, imageClass] = card;
    if (collected.includes(id)) return;

    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    setFolderOpen(true);
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

  useEffect(() => {
    if (isCompact) return undefined;
    const scrollRoot = document.querySelector('.appScroll');
    if (!scrollRoot) return undefined;
    let lastScrollTop = scrollRoot.scrollTop;

    const handleWheel = (event) => {
      if (completedRef.current) return;
      const node = sectionRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const rootRect = scrollRoot.getBoundingClientRect();
      const isApproachVisible = rect.top < rootRect.bottom && rect.bottom > rootRect.top;
      if (!isApproachVisible || isApproachPinSuppressed()) return;

      if ((pinnedRef.current || settlingRef.current) && event.deltaY < 0) {
        window.__portfolioSuppressApproachPinUntil = Date.now() + 900;
        const approachTop = getApproachTop();
        releaseApproachPin();
        setFolderReady(false);
        if (approachTop != null) {
          requestAppScrollTo(Math.max(0, approachTop - window.innerHeight * 0.82), 'smooth');
        }
        return;
      }

      const isAtPinPoint =
        event.deltaY > 0 &&
        rect.top <= rootRect.top + 2 &&
        rect.bottom >= rootRect.top + rootRect.height * 0.58;

      if (pinnedRef.current) {
        event.preventDefault();
        setFolderReady(true);
        pinApproachView('lock');
        return;
      }

      if (isAtPinPoint) {
        event.preventDefault();
        settlingRef.current = false;
        pinnedRef.current = true;
        setFolderReady(true);
        pinApproachView('lock');
      }
    };

    const keepPinned = () => {
      if (completedRef.current || isApproachPinSuppressed()) return;
      const currentScrollTop = scrollRoot.scrollTop;
      const isScrollingDown = currentScrollTop >= lastScrollTop;
      lastScrollTop = currentScrollTop;
      const node = sectionRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const rootRect = scrollRoot.getBoundingClientRect();

      if (
        isScrollingDown &&
        !pinnedRef.current &&
        rect.top <= rootRect.top + 1 &&
        rect.bottom >= rootRect.top + rootRect.height * 0.58
      ) {
        pinnedRef.current = true;
        settlingRef.current = false;
        setFolderReady(true);
        pinApproachView('lock');
        return;
      }

      if (!pinnedRef.current) return;
      pinApproachView('lock');
    };

    scrollRoot.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    scrollRoot.addEventListener('scroll', keepPinned, { passive: true });
    return () => {
      releaseApproachPin();
      scrollRoot.removeEventListener('wheel', handleWheel, { capture: true });
      scrollRoot.removeEventListener('scroll', keepPinned);
    };
  }, [isCompact]);

  const visibleFolderReady = isCompact || folderReady;
  const visibleTextReady = isCompact || textReady;

  return (
    <section
      ref={sectionRef}
      data-section="approach"
      className={`${styles.panel} ${styles.approachPanel} ${allCollected ? styles.approachPanelExpanded : ''}`}
    >
      <ScrollFloatTitle title="Approach" active={2} className={styles.approachTitle} />

      <div className={styles.approachList}>
        {cleanApproachCards.map((card, index) => {
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
        className={`${styles.folderDrop} ${visibleFolderReady ? styles.folderDropVisible : ''} ${
          draggingCard ? styles.folderDropActive : ''
        } ${folderOpen ? styles.folderDropOpen : ''} ${
          draggingCard && folderOpen ? styles.folderDropHovering : ''
        }`}
      >
        <div className={styles.folderStage}>
          <img src={imgApproachFolderBack} alt="" className={`${styles.folderImage} ${styles.folderImageBack}`} />
          <div className={styles.folderSlot}>
            {collected.map((id, index) => (
              <span key={id} style={{ '--slot-index': index }} />
            ))}
          </div>
          <img src={imgApproachFolderFront} alt="" className={`${styles.folderImage} ${styles.folderImageFront}`} />
        </div>
        <p>
          <img src={imgApproachDrag} alt="" />
          파일을 드래그해서 폴더 안에 넣어주세요!
        </p>
      </div>
      <div ref={summaryRef} className={`${styles.approachSummary} ${visibleTextReady ? styles.approachSummaryVisible : ''}`}>
        <div className={`${styles.approachText} ${visibleTextReady ? styles.approachTextReady : ''}`}>
          <p>
            <span>저는 완성된 결과물보다 </span>
            <span className={styles.approachTextAccent}>사용자가 왜 이 화면에서 멈추고, 어디로 이동해야 하는지</span>
            <span>를 생각합니다.</span>
          </p>
          <p>복잡한 구조를 단순한 흐름으로 정리하고, 그 흐름에 어울리는 시각적 무드를 더하며 디자인합니다.</p>
        </div>
        <div ref={processRef} className={styles.processFrame}>
          <div className={styles.processTop}>
            <div className={styles.processHeaderLeft}>
              <div className={styles.processIcon} aria-hidden="true">
                <img key={processCards[activeProcessIndex].id} src={processCards[activeProcessIndex].icon} alt="" />
              </div>
              <div className={styles.processHeaderText}>
                <strong>1 Process Selected</strong>
                <button
                  type="button"
                  className={styles.processOption}
                  onClick={() => selectProcessCard((activeProcessIndex + 1) % processCards.length)}
                >
                  <span>{processCards[activeProcessIndex].label}</span>
                  <img src={imgProcessChevron} alt="" />
                </button>
              </div>
            </div>
            <button type="button" className={styles.processCloseButton} aria-label="Close process preview">
              <span />
              <span />
            </button>
          </div>

          <div className={styles.processViewport}>
            <div
              className={styles.processTrack}
              style={{ '--process-index': activeProcessIndex }}
            >
              {processCards.map((card, index) => {
                const isActive = index === activeProcessIndex;
                const isPressed = index === pressedProcessIndex;

                return (
                  <button
                    key={card.id}
                    type="button"
                    className={`${styles.processCard} ${isActive ? styles.processCardActive : ''} ${
                      isPressed ? styles.processCardPressed : ''
                    }`}
                    onClick={() => selectProcessCard(index)}
                    aria-label={`Show ${card.label}`}
                  >
                    <img src={card.image} alt="" className={card.imageClass} draggable={false} />
                    <span className={styles.processCheckMark}>
                      {isActive && <img src={imgProcessCheck} alt="" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
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

function EssenceQuestionItem({ number, question, answer, index, itemRef }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const root = document.querySelector('.appScroll');

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.04, root: root ?? null, rootMargin: '0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={(node) => {
        ref.current = node;
        itemRef?.(node);
      }}
      className={`${styles.questionItem} ${visible ? styles.questionItemVisible : ''}`}
      style={{ '--question-index': index }}
    >
      <div className={`${styles.questionBubble} ${number === '04' ? styles.questionBubbleLarge : ''}`}>
        <strong>{number}</strong>
        <span>{formatQuestion(number, question)}</span>
      </div>
      <p className={styles.delivered}>Delivered</p>
      <div className={styles.answerBubble}>{answer}</div>
      <p className={styles.sender}>CHAEI</p>
    </article>
  );
}

function EssenceSection() {
  const sectionRef = useRef(null);
  const questionRefs = useRef([]);
  const snapLockRef = useRef(false);
  const activeQuestionIndexRef = useRef(null);

  const getQuestionTargetIndex = (direction) => {
    const root = document.querySelector('.appScroll');
    const rootRect = root ? root.getBoundingClientRect() : { top: 0, height: window.innerHeight };
    const center = rootRect.top + rootRect.height / 2;
    const items = questionRefs.current
      .map((node, index) => {
        if (!node) return null;
        const rect = node.getBoundingClientRect();
        return {
          index,
          center: rect.top + rect.height / 2,
        };
      })
      .filter(Boolean);

    if (!items.length) return -1;

    const centered = items
      .slice()
      .sort((a, b) => Math.abs(a.center - center) - Math.abs(b.center - center))[0];

    const activeIndex =
      activeQuestionIndexRef.current == null ? centered.index : activeQuestionIndexRef.current;
    const activeItem = items.find((item) => item.index === activeIndex);
    const activeDistance = activeItem ? Math.abs(activeItem.center - center) : Infinity;

    if (activeDistance < 96) {
      return activeIndex + direction;
    }

    if (Math.abs(centered.center - center) < 96) {
      activeQuestionIndexRef.current = centered.index;
      return centered.index + direction;
    }

    if (direction > 0) {
      return centered.center > center ? centered.index : Math.min(centered.index + 1, cleanQuestions.length - 1);
    }

    return centered.center < center ? centered.index : Math.max(centered.index - 1, 0);
  };

  const scrollQuestionToCenter = (index) => {
    const node = questionRefs.current[index];
    const root = document.querySelector('.appScroll');
    if (!node || !root) return;

    const rect = node.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    const targetTop = root.scrollTop + rect.top - rootRect.top - (rootRect.height - rect.height) / 2;

    activeQuestionIndexRef.current = index;
    snapLockRef.current = true;
    requestAppScrollTo(targetTop, 'smooth');
    window.setTimeout(() => {
      snapLockRef.current = false;
    }, 920);
  };

  const handleEssenceWheel = (event) => {
    if (Date.now() < (window.__portfolioSuppressEssenceSnapUntil ?? 0)) return;
    if (snapLockRef.current) {
      event.preventDefault();
      return;
    }
    if (Math.abs(event.deltaY) < 1) return;

    const direction = event.deltaY > 0 ? 1 : -1;
    const targetIndex = getQuestionTargetIndex(direction);
    if (targetIndex < 0 || targetIndex >= cleanQuestions.length) return;

    event.preventDefault();
    scrollQuestionToCenter(targetIndex);
  };

  useEffect(() => {
    if (isCompactViewport()) return undefined;
    const scrollRoot = document.querySelector('.appScroll');
    if (!scrollRoot) return undefined;

    const handleRootWheel = (event) => {
      if (Date.now() < (window.__portfolioSuppressEssenceSnapUntil ?? 0)) return;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const rootRect = scrollRoot.getBoundingClientRect();
      const isEssenceFrame = rect.top < rootRect.bottom && rect.bottom > rootRect.top;
      if (!isEssenceFrame || Math.abs(event.deltaY) < 1) return;

      if (snapLockRef.current) {
        event.preventDefault();
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;
      const targetIndex = getQuestionTargetIndex(direction);
      if (targetIndex < 0 || targetIndex >= cleanQuestions.length) return;

      event.preventDefault();
      scrollQuestionToCenter(targetIndex);
    };

    scrollRoot.addEventListener('wheel', handleRootWheel, { passive: false, capture: true });
    return () => scrollRoot.removeEventListener('wheel', handleRootWheel, { capture: true });
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="essence"
      className={`${styles.panel} ${styles.essencePanel}`}
    >
      <div className={styles.essenceIntro}>
        <ScrollFloatTitle title="Essence" active={3} align="left" className={styles.essenceTitle} />
        <p>
          <span className={styles.essenceIntroBold}>
            그래서, 저는 <span className={styles.essenceIntroAccent}>어떤 디자이너</span>가 되고 싶은 걸까요?
          </span>
          <br />
          만들고 배우며 제게 남은 질문들을 하나씩 펼쳐보았습니다.
        </p>
      </div>
      <div className={styles.questionList}>
        {cleanQuestions.map(([number, question, answer], index) => (
          <EssenceQuestionItem
            key={number}
            number={number}
            question={question}
            answer={answer}
            index={index}
            itemRef={(node) => {
              questionRefs.current[index] = node;
            }}
          />
        ))}
      </div>
    </section>
  );
}

function InvitationKeyScene({ onActivate, pressSignal, active }) {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    if (!pressSignal) return;
    setIsPressed(true);
    const timer = window.setTimeout(() => {
      setIsPressed(false);
    }, 260);
    return () => window.clearTimeout(timer);
  }, [pressSignal]);

  return (
    <button
      type="button"
      className={`${styles.invitationKeyButton} ${active ? styles.invitationKeyActive : ''}`}
      onClick={onActivate}
      aria-label="Open contact card"
    >
      <div className={styles.invitationKeyFloat}>
        <CharacterKeyDisplay pressed={isPressed} scale={1.42} className={styles.invitationKeyCanvas} />
      </div>
    </button>
  );
}

function InvitationSection() {
  const sectionRef = useRef(null);
  const contactRef = useRef(null);
  const openTimerRef = useRef(0);
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
        if (!entry.isIntersecting) {
          window.clearTimeout(openTimerRef.current);
          setIsOpen(false);
        }
      },
      { threshold: 0.35, root: root ?? null },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      window.clearTimeout(openTimerRef.current);
    };
  }, []);

  const triggerInvitation = () => {
    setPressSignal((prev) => prev + 1);
    window.clearTimeout(openTimerRef.current);

    if (isOpen) {
      setIsOpen(false);
      return;
    }

    openTimerRef.current = window.setTimeout(() => {
      setIsOpen(true);
    }, 220);
  };

  const handleInvitationPointerDown = (event) => {
    if (!isOpen) return;
    if (contactRef.current?.contains(event.target)) return;
    window.clearTimeout(openTimerRef.current);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isVisible) return undefined;

    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === 'c') {
        triggerInvitation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, isOpen]);

  useEffect(() => {
    const scrollRoot = document.querySelector('.appScroll');
    if (!scrollRoot) return undefined;

    const handleBottomWheel = (event) => {
      const section = sectionRef.current;
      if (!section || event.deltaY <= 0) return;

      const rect = section.getBoundingClientRect();
      const rootRect = scrollRoot.getBoundingClientRect();
      const maxScrollTop = Math.max(0, scrollRoot.scrollHeight - scrollRoot.clientHeight);
      const isInvitationAtEnd = rect.bottom <= rootRect.bottom + 2 && rect.top < rootRect.bottom;
      const isScrollRootAtEnd = scrollRoot.scrollTop >= maxScrollTop - 2;

      if (!isInvitationAtEnd && !isScrollRootAtEnd) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      requestAppScrollTo(maxScrollTop, 'auto');
    };

    scrollRoot.addEventListener('wheel', handleBottomWheel, { passive: false, capture: true });
    return () => scrollRoot.removeEventListener('wheel', handleBottomWheel, { capture: true });
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="invitation"
      className={`${styles.panel} ${styles.invitationPanel}`}
      onPointerDown={handleInvitationPointerDown}
    >
      <InvitationKeyScene
        active={isVisible}
        pressSignal={pressSignal}
        onActivate={triggerInvitation}
      />
      <div className={styles.invitationTitle}>
        <ScrollFloatTitle title="Invitation" active={4} />
        <div className={`${styles.invitationSub} ${isVisible ? styles.invitationSubVisible : ''}`}>
          <p>포트폴리오 공유가 거의 완료되었습니다.</p>
          <strong>이제 마지막 키를 눌러, 다음 연결을 시작해보세요.</strong>
        </div>
      </div>
      <aside
        ref={contactRef}
        className={`${styles.contactCard} ${isOpen ? styles.contactCardVisible : styles.contactCardHidden}`}
      >
        <div className={styles.contactTitle}>
          <h3>Contact us</h3>
          <p>채이 님이 연락처를 공유하려고 합니다.</p>
        </div>
        <img src={asset('profile.png')} alt="김채이 연락처 이미지" />
        <div className={styles.contactActions}>
          <button type="button" onClick={scrollToMainTop}>View Again</button>
          <button type="button" onClick={() => window.open('mailto:36irth@gmail.com')}>Accept</button>
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
  const [activeSection, setActiveSection] = useState('character');
  const [showTopButton, setShowTopButton] = useState(false);
  const [characterResetSignal, setCharacterResetSignal] = useState(0);
  const [approachAllCollected, setApproachAllCollected] = useState(false);
  const showCharacterInteractionHint =
    activeSection === 'character' &&
    characterWindowIds.some((_, index) => getFloatState(isActive, scrollProgress, index));

  const scrollToSection = (sectionId) => {
    const target = document.querySelector(`[data-section="${sectionId}"]`);
    const root = document.querySelector('.appScroll');
    if (!target || !root) return;

    window.__portfolioSuppressEssenceSnapUntil = Date.now() + 1100;
    window.__portfolioSuppressApproachPinUntil = Date.now() + 1100;
    window.dispatchEvent(new CustomEvent('portfolio:scroll-lock', { detail: { locked: false } }));
    if (sectionId === 'character') {
      window.dispatchEvent(new CustomEvent('portfolio:character-reset'));
    }

    const rect = target.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    const top =
      sectionId === 'character'
        ? root.scrollTop + rect.top - rootRect.top + window.innerHeight * 3.2 * characterReturnProgress
        : root.scrollTop + rect.top - rootRect.top;
    requestAppScrollTo(top, 'smooth');
    setActiveSection(sectionId);
  };

  useEffect(() => {
    const resetCharacter = () => setCharacterResetSignal((prev) => prev + 1);
    window.addEventListener('portfolio:character-reset', resetCharacter);
    return () => window.removeEventListener('portfolio:character-reset', resetCharacter);
  }, []);

  useEffect(() => {
    if (!isActive) return undefined;

    const root = document.querySelector('.appScroll');
    if (!root) return undefined;

    let frame = 0;

    const measureSections = () => {
      frame = 0;
      const sections = sectionEntries
        .map((entry) => {
          const node = document.querySelector(`[data-section="${entry.id}"]`);
          if (!node) return null;
          const rect = node.getBoundingClientRect();
          return { ...entry, rect };
        })
        .filter(Boolean);

      const viewportCenter = window.innerHeight / 2;
      const visibleSections = sections.filter((entry) => entry.rect.bottom > 0 && entry.rect.top < window.innerHeight);
      const current =
        visibleSections.find((entry) => entry.rect.top <= viewportCenter && entry.rect.bottom >= viewportCenter) ??
        visibleSections.sort((a, b) => Math.abs(a.rect.top - 140) - Math.abs(b.rect.top - 140))[0];

      if (current) {
        setActiveSection(current.id);
      }

      setShowTopButton(root.scrollTop > window.innerHeight * 0.75);
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measureSections);
    };

    measureSections();
    root.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      root.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return undefined;

    const handleKeyDown = (event) => {
      const letter = event.key.toLowerCase();
      if (!sectionLetters.includes(letter)) return;
      if (activeSection === 'invitation' && letter === 'c') return;

      const target = sectionEntries.find((entry) => entry.letter === letter);
      if (!target) return;

      event.preventDefault();
      scrollToSection(target.id);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, isActive]);

  return (
    <main className={styles.page}>
      <nav className={styles.sectionNavigation} aria-label="Section navigation">
        <div className={styles.sectionNavigationList}>
          {sectionEntries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={`${styles.sectionNavigationButton} ${
                activeSection === entry.id ? styles.sectionNavigationButtonActive : ''
              }`}
              onClick={() => scrollToSection(entry.id)}
              aria-label={`Go to ${entry.label}`}
            >
              {entry.letter}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`${styles.windowResetButton} ${activeSection === 'character' ? styles.windowResetButtonVisible : ''}`}
          onClick={() => {
            setCharacterResetSignal((prev) => prev + 1);
            requestAppScrollTo(window.innerHeight * 3.2 * characterReturnProgress, 'smooth');
          }}
          aria-label="창 초기화"
          title="창 초기화"
        >
          ↺
        </button>
      </nav>
      <div
        className={`${styles.scrollDownHint} ${
          (activeSection === 'approach' && !approachAllCollected) || activeSection === 'invitation' ? styles.scrollDownHintHidden : ''
        }`}
        aria-hidden="true"
      >
        <span className={styles.scrollDownMouse} />
        <span>Scroll down</span>
      </div>
      <div
        className={`${styles.characterInteractionHint} ${
          showCharacterInteractionHint ? styles.characterInteractionHintVisible : ''
        }`}
        aria-hidden="true"
      >
        <span>창은 드래그해서 옮기고, 클릭하면 닫을 수 있어요</span>
      </div>
      <button
        type="button"
        className={`${styles.topButton} ${showTopButton ? styles.topButtonVisible : ''}`}
        onClick={scrollToMainTop}
      >
        Top
      </button>
      <CharacterSection isActive={isActive} scrollProgress={scrollProgress} resetSignal={characterResetSignal} />
      <MemoHighlightsSection />
      <MemoApproachSection onAllCollected={setApproachAllCollected} />
      <MemoEssenceSection />
      <MemoInvitationSection />
    </main>
  );
}

export default MainPage;
