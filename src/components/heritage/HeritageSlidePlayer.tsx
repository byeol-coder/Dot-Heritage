import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Heritage } from '../../types/heritage';
import type { DotMatrix } from '../../types/heritage';
import { createEmptyMatrix } from '../../engine/dotpad/matrixUtils';
import {
  createCheomseongdaeSilhouette,
  createCheomseongdaeWindow,
  createCheomseongdaeBase,
  createCheomseongdaeTop,
  createCheomseongdaeQuiz,
} from '../../engine/tactile/createCheomseongdae';
import { Cheomseongdae3D } from './Cheomseongdae3D';
import { DotPadOutputPanel } from '../dotpad/DotPadOutputPanel';
import { TTSNarrationPanel } from '../narration/TTSNarrationPanel';
import { CompletionScreen } from '../ui/CompletionScreen';
import { useSwipe } from '../../hooks/useSwipe';
import styles from './HeritageSlidePlayer.module.css';

const TACTILE_MAP: Record<string, () => DotMatrix> = {
  'cheomseongdae-silhouette': createCheomseongdaeSilhouette,
  'cheomseongdae-window': createCheomseongdaeWindow,
  'cheomseongdae-base': createCheomseongdaeBase,
  'cheomseongdae-top': createCheomseongdaeTop,
  'cheomseongdae-quiz': createCheomseongdaeQuiz,
};

type Lang = 'ko' | 'en';

interface Props {
  heritage: Heritage;
  mode?: 'standard' | 'museum' | 'school';
  initialLang?: Lang;
  onComplete?: () => void;
  onBack?: () => void;
  onSlideChange?: (index: number) => void;
}

export function HeritageSlidePlayer({ heritage, mode, initialLang = 'ko', onComplete, onBack, onSlideChange }: Props) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [lang] = useState<Lang>(initialLang);
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);
  const [direction, setDirection] = useState(1);
  const [completed, setCompleted] = useState(false);

  const slide = heritage.slides[slideIndex];

  const matrix: DotMatrix = slide
    ? (TACTILE_MAP[slide.tactileGraphicId]?.() ?? createEmptyMatrix())
    : createEmptyMatrix();

  const goNext = useCallback(() => {
    if (slideIndex === heritage.slides.length - 1) {
      setCompleted(true);
      onComplete?.();
    } else {
      setDirection(1);
      setSlideIndex(i => {
        const next = i + 1;
        onSlideChange?.(next);
        return next;
      });
      setQuizSelected(null);
      setQuizResult(null);
    }
  }, [slideIndex, heritage.slides.length, onComplete, onSlideChange]);

  const goPrev = useCallback(() => {
    if (slideIndex > 0) {
      setDirection(-1);
      setSlideIndex(i => {
        const prev = i - 1;
        onSlideChange?.(prev);
        return prev;
      });
      setQuizSelected(null);
      setQuizResult(null);
    }
  }, [slideIndex, onSlideChange]);

  const swipe = useSwipe(goNext, goPrev);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  if (!slide) return null;

  const handleQuizSelect = (option: string) => {
    setQuizSelected(option);
    const answerKo = slide.quizAnswer;
    const answerEn = slide.quizOptions?.find(o => o.ko === answerKo)?.en;
    const correct = option === (lang === 'ko' ? answerKo : answerEn);
    setQuizResult(correct ? 'correct' : 'wrong');
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className={styles.player}>
      {/* Progress bar */}
      <div className={styles.progress} role="progressbar"
        aria-valuenow={slideIndex + 1} aria-valuemax={heritage.slides.length}
        aria-label={`Slide ${slideIndex + 1} of ${heritage.slides.length}`}>
        {heritage.slides.map((_, i) => (
          <div key={i} className={`${styles.dot} ${i === slideIndex ? styles.active : i < slideIndex ? styles.done : ''}`} />
        ))}
      </div>

      <div className={styles.layout} {...swipe}>
        {/* Left: 3D frame + slide info */}
        <div className={styles.left}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className={styles.frameWrap}
            >
              <div className={styles.slideLabel}>
                <span className={styles.slideNum}>{String(slideIndex + 1).padStart(2, '0')} / {String(heritage.slides.length).padStart(2, '0')}</span>
                <span className={styles.tactileTag}>{slide.tactileLayer.toUpperCase()}</span>
              </div>
              <div className={styles.frame3d}>
                <Cheomseongdae3D
                  highlightPart={slide.highlightPart}
                  cameraView={slide.cameraView}
                />
                {/* Gold particle connector hint */}
                <div className={styles.connector} aria-hidden="true">
                  <svg width="40" height="80" viewBox="0 0 40 80" fill="none">
                    <path d="M5 0 Q20 40 35 80" stroke="#C8A56A" strokeWidth="1" strokeDasharray="4 3" opacity="0.6"/>
                    <circle cx="35" cy="78" r="3" fill="#C8A56A" opacity="0.8"/>
                  </svg>
                </div>
              </div>
              <div className={styles.slideTitle}>
                <h2>{lang === 'ko' ? slide.title.ko : slide.title.en}</h2>
                <p>{lang === 'ko' ? slide.subtitle.ko : slide.subtitle.en}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Quiz panel */}
          {slide.interactionType === 'quiz' && slide.quizOptions && (
            <div className={styles.quiz} role="group" aria-label="Quiz">
              <p className={styles.quizQ}>{lang === 'ko' ? '위치를 선택하세요' : 'Select the location'}</p>
              <div className={styles.quizOptions}>
                {slide.quizOptions.map((opt, i) => {
                  const val = lang === 'ko' ? opt.ko : opt.en;
                  const isSelected = quizSelected === val;
                  const isCorrectAns = opt.ko === slide.quizAnswer;
                  return (
                    <button
                      key={i}
                      className={`${styles.quizBtn}
                        ${isSelected ? (quizResult === 'correct' ? styles.correct : styles.wrong) : ''}
                        ${quizResult && isCorrectAns && !isSelected ? styles.revealCorrect : ''}`}
                      onClick={() => !quizSelected && handleQuizSelect(val)}
                      aria-pressed={isSelected}
                      disabled={!!quizSelected}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
              {quizResult && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className={`${styles.feedback} ${styles[quizResult]}`}
                >
                  {quizResult === 'correct'
                    ? (lang === 'ko' ? '정답입니다!' : 'Correct!')
                    : (lang === 'ko' ? '다시 확인해보세요.' : 'Try again.')
                  }
                </motion.p>
              )}
            </div>
          )}
        </div>

        {/* Right: Dot Pad + TTS */}
        <div className={styles.right}>
          <DotPadOutputPanel
            matrix={matrix}
            brailleText={slide.brailleText}
          />
          <TTSNarrationPanel text={slide.ttsText} autoPlay={mode === 'museum' || mode === 'school'} />
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={styles.navBtn}
          onClick={goPrev}
          disabled={slideIndex === 0}
          aria-label="Previous slide"
        >← {lang === 'ko' ? '이전' : 'Prev'}</button>
        <button
          className={`${styles.navBtn} ${styles.outputBtn}`}
          aria-label="Send to Dot Pad"
        >
          ⬡ {lang === 'ko' ? '닷패드 출력' : 'Dot Pad Output'}
        </button>
        <button
          className={`${styles.navBtn} ${styles.nextBtn}`}
          onClick={goNext}
          aria-label="Next slide"
        >{lang === 'ko' ? '다음' : 'Next'} →</button>
      </div>

      {completed && (
        <CompletionScreen
          heritageTitle={heritage.title.ko}
          mode={mode ?? 'standard'}
          totalSlides={heritage.slides.length}
          onRestart={() => { setSlideIndex(0); setCompleted(false); onSlideChange?.(0); }}
          onMore={onBack ?? (() => {})}
        />
      )}
    </div>
  );
}
