import SplitText from '../components/KeyboardIntro/SplitText';
import styles from './MainPage.module.css';

const asset = (name) => `/assets/portfolio/${name}`;

const awards = [
  ['블루어워즈', '시각디자인 분야 입선', '2022.06.14'],
  ['블루어워즈', '시각디자인 분야 입선', '2022.06.22'],
  ['관악현대미술대전', '디자인 분야 특선', '2023.11.21'],
];

const certificates = [
  ['웹디자인개발기능사(필기)', '26.01.24'],
  ['컴퓨터그래픽기능사', '19.07.19'],
  ['JLPT N2', '19.01.20'],
];

const designTools = [
  ['Figma', 'Design / Prototyping', 'Advanced', 'tool-figma.png'],
  ['Photoshop', 'Image editing', 'Advanced', 'tool-photoshop.png'],
  ['Illustrator', 'Graphic assets / icons / logo', 'Intermediate', 'tool-illustrator.png'],
  ['AfterEffects', 'Design / Prototyping', 'Basic', 'tool-aftereffects.png'],
  ['InDesign', 'Design / Prototyping', 'Basic', 'tool-indesign.png'],
  ['HTML · CSS · JavaScript', 'Implementation understanding', 'Basic', 'tool-code.png'],
  ['React', 'Component structure', 'Basic', 'tool-react.png'],
];

const aiTools = [
  ['ChatGPT', 'Expand ideas / Create Images', 'ai-chatgpt.png'],
  ['Claude', 'Writing / Coding / Product management', 'ai-claude.png'],
  ['Perplexity', 'Survey of data', 'ai-perplexity.png'],
  ['Codex', 'Coding', 'tool-code.png'],
  ['Midjourney', 'Create images and videos', 'ai-chatgpt.png'],
  ['Gemini', 'Writing / Product management', 'ai-perplexity.png'],
];

const projects = [
  ['project-1.png', 'Mobile App', 'Brand UX'],
  ['project-2.png', 'Shopping UX', 'Service'],
  ['project-3.png', 'Portrait Study', 'Visual'],
  ['project-4.png', 'Dashboard', 'Web UX'],
  ['project-5.png', 'Editorial', 'Content'],
  ['project-6.png', 'Commerce', 'UI System'],
];

const approaches = [
  ['1', 'Observe', '사용자가 어디서 불편함을 느끼는지 파악합니다.', 'approach-observe.png'],
  ['2', 'Organize', '사용자가 다음 행동을 쉽게 찾을 수 있도록 정리합니다.', 'approach-organize.png'],
  ['3', 'Visualize', '기능 뿐만이 아닌, 기억에 남는 화면을 만듭니다.', 'approach-visualize.png'],
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
    '앞으로 무엇을 더 배우고 싶나요?',
    'UI/UX 디자인 역량을 쌓아가는 동시에 장기적으로는 블렌더, 어도비 디멘션 같은 3D 툴을 익혀 시각적 표현의 폭을 넓히고 싶습니다. 또한 일본어, 중국어 등 낯선 언어를 배우며 다양한 문화권의 디자인 감각을 흡수하는 것도 목표 중 하나입니다.',
  ],
  [
    '04',
    'AI가 자연스러운 도구가 된 지금, 디자이너는 무엇을 직접 판단해야 할까요?',
    'AI에 의존하지 않는 것이라고 생각합니다. 직접 사용해보니 도움을 받을수록 오히려 사고가 막히는 경험을 했고, 그래서 큰 그림은 스스로 그린 뒤 신선한 시각이 필요한 순간에만 활용하는 방식을 선호합니다. 처음부터 끝까지 맡기는 것이 아니라, 내 작업 과정의 일부로 두는 것이 중요하다고 생각합니다.',
  ],
];

const keys = ['C', 'H', 'A', 'E', 'I'];
const floatDelays = [0.02, 0.22, 0.11, 0.31, 0.17, 0.27, 0.06];

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

function SectionTitle({ title, active = 0, align = 'center' }) {
  return (
    <header className={`${styles.sectionTitle} ${align === 'left' ? styles.sectionTitleLeft : ''}`}>
      <KeyboardBadge active={active} />
      <h2>
        <span>{title.slice(0, 1)}</span>
        {title.slice(1)}
      </h2>
    </header>
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

function GlassHeader({ icon, label }) {
  return (
    <div className={styles.glassHeader}>
      <div className={styles.windowTitle}>
        <img src={asset(icon)} alt="" />
        <strong>{label}</strong>
      </div>
      <img src={asset('x-icon.svg')} alt="" className={styles.windowClose} />
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
        <div className={styles.accentLine}>
          <strong>구조와 감각의 균형</strong>
          <span>을 고민하는</span>
          <strong>UI/UX 디자이너</strong>
          <span>를 지향합니다.</span>
        </div>
      </div>

      <div className={`${styles.awards} ${floatClass(isActive, scrollProgress, 6)}`} style={floatStyle(6)}>
        {awards.map(([line1, line2, date]) => (
          <article className={styles.awardItem} key={`${line1}-${line2}-${date}`}>
            <img src={asset('award.png')} alt="" />
            <div>
              <p>{line1}</p>
              <p>{line2}</p>
              <time>{date}</time>
            </div>
          </article>
        ))}
      </div>

      <aside
        className={`${styles.glassCard} ${styles.designToolsCard} ${floatClass(isActive, scrollProgress, 0)}`}
        style={floatStyle(0)}
      >
        <GlassHeader icon="tool-icon.svg" label="Tools" />
        <div className={styles.glassBody}>
          <p className={styles.bodyLabel}>Tools I can use</p>
          {designTools.map(([name, desc, level, image]) => (
            <div className={styles.toolRow} key={name}>
              <div className={styles.toolLeft}>
                <img src={asset(image)} alt="" />
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
        className={`${styles.glassCard} ${styles.profileCard} ${floatClass(isActive, scrollProgress, 1)}`}
        style={floatStyle(1)}
      >
        <div className={styles.profileTitle}>
          <h3>Profile</h3>
          <p>김채이</p>
        </div>
        <img src={asset('profile.png')} alt="김채이 프로필" className={styles.profileImage} />
        <p className={styles.profileMeta}>2001.03.06</p>
        <p className={styles.profileMeta}>36irth@gmail.com</p>
      </aside>

      <aside
        className={`${styles.glassCard} ${styles.aiCard} ${floatClass(isActive, scrollProgress, 2)}`}
        style={floatStyle(2)}
      >
        <GlassHeader icon="ai-icon.svg" label="AI" />
        <div className={styles.glassBody}>
          {aiTools.map(([name, desc, image]) => (
            <div className={styles.toolRow} key={name}>
              <div className={styles.toolLeft}>
                <img src={asset(image)} alt="" />
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
        className={`${styles.glassCard} ${styles.certificateCard} ${floatClass(isActive, scrollProgress, 3)}`}
        style={floatStyle(3)}
      >
        <div className={styles.cardTop}>
          <img src={asset('certificate-icon.svg')} alt="" />
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

      <div
        className={`${styles.chatBubble} ${styles.schoolOne} ${floatClass(isActive, scrollProgress, 4)}`}
        style={floatStyle(4)}
      >
        <p>2021~2023 안산대학교 시각미디어디자인학과</p>
      </div>
      <div
        className={`${styles.chatBubble} ${styles.schoolTwo} ${floatClass(isActive, scrollProgress, 5)}`}
        style={floatStyle(5)}
      >
        <p>2017~2020 안산디자인문화고등학교 시각디자인과</p>
      </div>
      </div>
    </section>
  );
}

function HighlightsSection() {
  return (
    <section className={`${styles.panel} ${styles.highlightsPanel}`}>
      <SectionTitle title="Highlights" active={1} />
      <div className={styles.projectGrid}>
        {projects.map(([image, title, tag], index) => (
          <article className={index < 3 ? styles.projectLarge : styles.projectSmall} key={image}>
            <img src={asset(image)} alt="" />
            <div>
              <strong>{title}</strong>
              <span>{tag}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ApproachSection() {
  return (
    <section className={`${styles.panel} ${styles.approachPanel}`}>
      <SectionTitle title="Approach" active={2} />
      <div className={styles.approachList}>
        {approaches.map(([number, title, desc, image]) => (
          <article className={styles.approachCard} key={title}>
            <img src={asset(image)} alt="" />
            <div>
              <h3>
                <span>{number}</span>
                {title}
              </h3>
              <p>{desc}</p>
            </div>
          </article>
        ))}
      </div>
      <div className={styles.folderDrop}>
        <img src={asset('folder.png')} alt="" />
        <p>
          <img src={asset('drag-icon.svg')} alt="" />
          파일을 드래그해서 폴더 안에 넣어주세요!
        </p>
      </div>
      <p className={styles.approachText}>
        저는 완성된 결과물보다 사용자가 왜 이 화면에서 멈추고, 어디로 이동해야 하는지를 생각합니다. 복잡한 구조를 단순한 흐름으로 정리하고, 그 흐름에 어울리는 시각적 무드를 더하며 디자인합니다.
      </p>
    </section>
  );
}

function EssenceSection() {
  return (
    <section className={`${styles.panel} ${styles.essencePanel}`}>
      <div className={styles.essenceIntro}>
        <SectionTitle title="Essence" active={3} align="left" />
        <p>
          그래서, 저는 어떤 디자이너가 되고 싶은 걸까요?
          <br />
          만들고 배우며 제게 남은 질문들을 하나씩 펼쳐보았습니다.
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

function InvitationSection() {
  return (
    <section className={`${styles.panel} ${styles.invitationPanel}`}>
      <img src={asset('invitation-key.png')} alt="" className={styles.invitationKey} />
      <div className={styles.invitationTitle}>
        <SectionTitle title="Invitation" active={4} />
        <p>포트폴리오 공유가 거의 완료되었습니다.</p>
        <strong>이제 마지막 키를 눌러, 다음 연결을 시작해보세요.</strong>
      </div>
      <aside className={styles.contactCard}>
        <div className={styles.contactTitle}>
          <h3>Contact us</h3>
          <p>채이 님이 연락처를 공유하려고 합니다.</p>
        </div>
        <img src={asset('profile.png')} alt="김채이 연락처 이미지" />
        <div className={styles.contactActions}>
          <button type="button">View Agian</button>
          <button type="button">Accept</button>
        </div>
      </aside>
    </section>
  );
}

export function MainPage({ isActive = false, scrollProgress = 0 }) {
  return (
    <main className={styles.page}>
      <CharacterSection isActive={isActive} scrollProgress={scrollProgress} />
      <HighlightsSection />
      <ApproachSection />
      <EssenceSection />
      <InvitationSection />
    </main>
  );
}

export default MainPage;
