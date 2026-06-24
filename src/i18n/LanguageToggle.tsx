import { useI18n } from './i18n';
import styles from './LanguageToggle.module.css';

/** KO / EN segmented toggle for language accessibility. */
export function LanguageToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className={styles.toggle} role="group" aria-label="Language / 언어 선택">
      <button
        type="button"
        className={`${styles.opt} ${lang === 'ko' ? styles.active : ''}`}
        onClick={() => setLang('ko')}
        aria-pressed={lang === 'ko'}
        lang="ko"
      >
        한국어
      </button>
      <button
        type="button"
        className={`${styles.opt} ${lang === 'en' ? styles.active : ''}`}
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        lang="en"
      >
        EN
      </button>
    </div>
  );
}
