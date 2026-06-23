import { motion } from 'framer-motion';
import { Logo } from '../components/brand/Logo';
import { HeritageCard } from '../components/heritage/HeritageCard';
import { heritageList } from '../data/heritageData';
import styles from './Collection.module.css';

interface Props {
  onSelect: (id: string) => void;
  onBack: () => void;
}

export function Collection({ onSelect, onBack }: Props) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button onClick={onBack} className={styles.backBtn} aria-label="Back to home">← Back</button>
        <Logo size="sm" variant="full" />
      </header>
      <main className={styles.main}>
        <motion.div className={styles.intro} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className={styles.eyebrow}>COLLECTIONS</p>
          <h1 className={styles.title}>Cultural Heritage Guide</h1>
          <p className={styles.sub}>Choose a heritage item to begin your guided tactile exploration.</p>
        </motion.div>
        <motion.div className={styles.grid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          {heritageList.map((h, i) => (
            <motion.div key={h.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.3 }}>
              <HeritageCard heritage={h} lang="ko" onSelect={onSelect} />
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
