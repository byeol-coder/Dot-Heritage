import styles from './HeritageGlobeHero.module.css';

interface Props {
  onStart: () => void;
  onMuseum: () => void;
  onSchool: () => void;
}

export function HeritageGlobeHero({ onStart, onMuseum, onSchool }: Props) {
  return (
    <section className={styles.hero} aria-labelledby="globe-hero-title">
      <h1 id="globe-hero-title">Heritage<br />Beyond Borders</h1>
      <button type="button" onClick={onStart}>Explore Collection</button>
      <button type="button" onClick={onMuseum}>Museum Mode</button>
      <button type="button" onClick={onSchool}>Tactile Guide</button>
    </section>
  );
}
