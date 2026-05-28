import styles from './MainPage.module.css';

const imgAward = 'https://www.figma.com/api/mcp/asset/60fed665-a621-4dde-8530-7f91bd3faae7';
const imgImage51 = 'https://www.figma.com/api/mcp/asset/444fd0d9-d7ce-4ace-9919-a3b8ba1bdabf';
const imgImage52 = 'https://www.figma.com/api/mcp/asset/f34d463a-446d-4ec2-93ed-4c149475749b';
const imgImage53 = 'https://www.figma.com/api/mcp/asset/834d876f-adb9-4e66-8766-18a52387c4ba';
const imgImage54 = 'https://www.figma.com/api/mcp/asset/a8a967a4-b708-419f-8c4c-fd8db00a4219';
const imgImage55 = 'https://www.figma.com/api/mcp/asset/925992be-bd26-4f93-8380-9cf196af99ca';
const imgImage56 = 'https://www.figma.com/api/mcp/asset/b1363532-444e-4bea-ba33-bd1e06d910c5';
const imgImage57 = 'https://www.figma.com/api/mcp/asset/eff1f025-7f88-44d4-9a6f-138853c8f9c1';
const imgImage58 = 'https://www.figma.com/api/mcp/asset/2ea26c4b-8a8b-4635-8fdc-2d038bb7d564';
const imgImage59 = 'https://www.figma.com/api/mcp/asset/beb4ece6-6702-43e0-ac36-9a6bfdddfb36';
const imgImage60 = 'https://www.figma.com/api/mcp/asset/8490492f-694e-4fce-bf65-6b727258852b';
const imgImage61 = 'https://www.figma.com/api/mcp/asset/6f3388b3-fab2-4f37-b687-ef917636a792';
const imgRectangle62 = 'https://www.figma.com/api/mcp/asset/00893c00-f2e6-4ca1-b5c4-d041d048f2ec';
const imgIcon = 'https://www.figma.com/api/mcp/asset/c7ef01cd-0de2-4964-973e-d7c47a715a2e';
const imgTool = 'https://www.figma.com/api/mcp/asset/2c47b936-f07c-4084-bfba-607701609dd8';
const imgX = 'https://www.figma.com/api/mcp/asset/3b0e76db-d305-4c37-a4f3-783c059d5183';
const imgGroup = 'https://www.figma.com/api/mcp/asset/5965c2f7-ce57-4108-a843-4b800f80c8ad';
const imgVector1 = 'https://www.figma.com/api/mcp/asset/3e2bafd1-088d-4f9e-9d3f-7b56859e3731';

const awards = [
  ['블루어워즈', '시각디자인 분야 입선', '2022.06.14'],
  ['블루어워즈', 'S.P디자인 분야 입선', '2022.06.14'],
  ['블루어워즈', '시각디자인 분야 입선', '2022.06.22'],
  ['관악현대미술대전', '디자인 분야 특선', '2023.11.21'],
];

const certificates = [
  ['웹디자인개발기능사(필기)', '26.01.24'],
  ['컴퓨터그래픽기능사', '19.07.19'],
  ['JLPT N2', '19.01.20'],
];

const designTools = [
  { name: 'Figma', desc: 'Design / Prototyping', level: 'Advanced', image: imgImage52, imageClass: styles.figureFigma },
  { name: 'Photoshop', desc: 'Image editing', level: 'Advanced', image: imgImage53, imageClass: styles.figurePs },
  { name: 'Illustrator', desc: 'Graphic assets / icons / logo', level: 'Intermediate', image: imgImage53, imageClass: styles.figureAi },
  { name: 'AfterEffects', desc: 'Design / Prototyping', level: 'Basic', image: imgImage53, imageClass: styles.figureAe },
  { name: 'InDesign', desc: 'Design / Prototyping', level: 'Basic', image: imgImage53, imageClass: styles.figureId },
  { name: 'HTML · CSS · JavaScript', desc: 'Implementation understanding', level: 'Basic', image: imgImage54, imageClass: styles.figureCode },
  { name: 'React', desc: 'Component structure', level: 'Basic', image: imgImage55, imageClass: styles.figureReact },
];

const aiTools = [
  { name: 'ChatGPT', desc: 'Expand ideas / Create Images', image: imgImage56, imageClass: styles.figureCover },
  { name: 'Claude', desc: 'Writing / Coding / Product management', image: imgImage57, imageClass: styles.figureCover },
  { name: 'Perplexity', desc: 'Survey of data', image: imgImage58, imageClass: styles.figureCover },
  { name: 'Codex', desc: 'Coding', image: imgImage59, imageClass: styles.figureCover },
  { name: 'Midjourney', desc: 'Create images and videos', image: imgImage60, imageClass: styles.figureMidjourney },
  { name: 'Gemini', desc: 'Writing / Product management', image: imgImage61, imageClass: styles.figureGemini },
];

const keys = ['C', 'H', 'A', 'E', 'I'];

function KeyboardBadge() {
  return (
    <div className={styles.keyboardBadge} aria-hidden="true">
      {keys.map((key, index) => (
        <div key={key} className={index === 0 ? styles.keyActive : styles.keyInactive}>
          {key}
        </div>
      ))}
    </div>
  );
}

function ToolThumb({ image, imageClass, alt }) {
  return (
    <div className={styles.thumb}>
      <img src={image} alt={alt} className={imageClass} />
    </div>
  );
}

export function MainPage() {
  return (
    <section className={styles.page}>
      <div className={styles.desktopFrame}>
        <header className={styles.titleBlock}>
          <div className={styles.titleInner}>
            <KeyboardBadge />
            <h1 className={styles.title}>
              <span className={styles.titleAccent}>C</span>haracter
            </h1>
          </div>
          <div className={styles.copy}>
            <div className={styles.copyLead}>
              <p>키보드의 작은 키들이 모여 하나의 문장을 완성하듯,</p>
              <p>작은 요소들이 모여 하나의 경험을 만든다고 생각합니다.</p>
            </div>
            <p className={styles.copyStrong}>
              <strong>구조와 감각의 균형을 고민하는 UI/UX 디자이너</strong>를 지향합니다.
            </p>
          </div>
        </header>

        <section className={styles.awards}>
          {awards.map(([line1, line2, date], index) => (
            <article key={`${line1}-${date}`} className={styles.awardItem}>
              <div className={styles.awardImageFrame}>
                <img src={imgAward} alt={`${line1} 상장`} className={styles.awardImage} />
              </div>
              <div className={styles.awardText}>
                <div className={styles.awardTitle}>
                  <p>{line1}</p>
                  <p>{line2}</p>
                </div>
                <p className={styles.awardDate}>{date}</p>
              </div>
            </article>
          ))}
        </section>

        <div className={styles.image51Wrap}>
          <img src={imgImage51} alt="Mechanical keyboard switch" className={styles.image51} />
        </div>

        <aside className={styles.certificateCard}>
          <div className={styles.cardTop}>
            <img src={imgIcon} alt="" className={styles.icon50} />
            <span className={styles.counter}>3</span>
          </div>
          <div className={styles.certificateBody}>
            <h2 className={styles.certificateTitle}>Certificate</h2>
            <div className={styles.certificateList}>
              {certificates.map(([label, date]) => (
                <div key={label} className={styles.certificateRow}>
                  <span className={styles.certificateLabel}>{label}</span>
                  <span className={styles.certificateDate}>{date}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <aside className={styles.designToolsCard}>
          <div className={styles.glassHeader}>
            <div className={styles.headerTitle}>
              <img src={imgTool} alt="" className={styles.icon24} />
              <span className={styles.headerTitleText}>Tools</span>
            </div>
            <img src={imgX} alt="" className={styles.icon24} />
          </div>
          <div className={styles.glassBody}>
            <p className={styles.sectionLabel}>Tools I can use</p>
            <div className={styles.toolList}>
              {designTools.map((tool) => (
                <div key={tool.name} className={styles.toolRow}>
                  <div className={styles.toolLeft}>
                    <ToolThumb image={tool.image} imageClass={tool.imageClass} alt={`${tool.name} icon`} />
                    <div className={styles.toolCopy}>
                      <strong>{tool.name}</strong>
                      <p>{tool.desc}</p>
                    </div>
                  </div>
                  <span className={styles.toolLevel}>{tool.level}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <aside className={styles.aiCard}>
          <div className={styles.glassHeader}>
            <div className={styles.headerTitle}>
              <div className={styles.aiIcon}>
                <img src={imgGroup} alt="" className={styles.aiIconImage} />
              </div>
              <span className={styles.headerTitleText}>AI</span>
            </div>
            <img src={imgX} alt="" className={styles.icon24} />
          </div>
          <div className={styles.aiBody}>
            <div className={styles.aiList}>
              {aiTools.map((tool) => (
                <div key={tool.name} className={styles.aiRow}>
                  <div className={styles.toolLeft}>
                    <ToolThumb image={tool.image} imageClass={tool.imageClass} alt={`${tool.name} icon`} />
                    <div className={styles.toolCopy}>
                      <strong>{tool.name}</strong>
                      <p>{tool.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <aside className={styles.profileCard}>
          <div className={styles.profileTitleArea}>
            <h2 className={styles.profileTitle}>Profile</h2>
            <p className={styles.profileName}>김채이</p>
          </div>
          <div className={styles.profileImageWrap}>
            <img src={imgRectangle62} alt="김채이 프로필" className={styles.profileImage} />
            <div className={styles.profileOverlay} />
          </div>
          <div className={styles.profileMetaPrimary}>2001.03.06</div>
          <div className={styles.profileMetaSecondary}>36irth@gmail.com</div>
        </aside>

        <div className={`${styles.speechGroup} ${styles.speechGroupOne}`}>
          <div className={styles.speechBubble}>
            <p>2021~2023</p>
            <p>안산대학교 시각미디어디자인학과</p>
          </div>
          <div className={styles.speechTailWrap}>
            <img src={imgVector1} alt="" className={styles.speechTail} />
          </div>
        </div>

        <div className={`${styles.speechGroup} ${styles.speechGroupTwo}`}>
          <div className={styles.speechBubble}>
            <p>2017~2020</p>
            <p>안산디자인문화고등학교 시각디자인과</p>
          </div>
          <div className={styles.speechTailWrap}>
            <img src={imgVector1} alt="" className={styles.speechTail} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default MainPage;
