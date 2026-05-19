import ExplodedKeyScene from './ExplodedKeyScene';
import styles from './MainPage.module.css';

export function MainPage() {
  return (
    <div className={styles.page}>
      <div className={styles.keyStage}>
        <ExplodedKeyScene />
      </div>
    </div>
  );
}

export default MainPage;
