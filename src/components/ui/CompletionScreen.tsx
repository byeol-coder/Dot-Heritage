import { motion } from 'framer-motion';
import styles from './CompletionScreen.module.css';

interface Props {
  heritageTitle: string;
  mode: string;
  totalSlides: number;
  onRestart: () => void;
  onMore: () => void;
}

export function CompletionScreen({ heritageTitle, mode, totalSlides, onRestart, onMore }: Props) {
  const isSchool = mode === 'school';
  const isMuseum = mode === 'museum';

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.card}>
        <div className={styles.icon}>⬡</div>
        <h2 className={styles.title}>
          {isSchool ? '학습 완료!' : isMuseum ? '탐색 완료' : '감상 완료'}
        </h2>
        <p className={styles.sub}>
          {heritageTitle}의 핵심 형태와 구조를<br/>
          {totalSlides}개 슬라이드로 탐색했습니다.
        </p>
        {isSchool && (
          <div className={styles.checklist}>
            <div className={styles.checkItem}>✓ 전체 형태 탐색</div>
            <div className={styles.checkItem}>✓ 중앙 창 위치 확인</div>
            <div className={styles.checkItem}>✓ 하단 기단부 이해</div>
            <div className={styles.checkItem}>✓ 상단 구조 비교</div>
            <div className={styles.checkItem}>✓ 창 위치 퀴즈 완료</div>
          </div>
        )}
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={onMore}>
            다른 유산 보기 →
          </button>
          <button className={styles.btnSecondary} onClick={onRestart}>
            처음부터 다시
          </button>
        </div>
      </div>
    </motion.div>
  );
}
