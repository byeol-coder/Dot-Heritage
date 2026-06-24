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
import {
  createMoonJarSilhouette,
  createMoonJarStructure,
  createMoonJarDetail,
  createMoonJarFocus,
  createMoonJarQuiz,
} from '../../engine/tactile/createMoonJar';
import {
  createRoofTileSilhouette,
  createRoofTileStructure,
  createRoofTileDetail,
  createRoofTileFocus,
  createRoofTileQuiz,
} from '../../engine/tactile/createRoofTile';
import {
  createTraditionalShipSilhouette,
  createTraditionalShipStructure,
  createTraditionalShipDetail,
  createTraditionalShipFocus,
  createTraditionalShipQuiz,
} from '../../engine/tactile/createTraditionalShip';
import { createKoreanPalaceSilhouette, createKoreanPalaceStructure, createKoreanPalaceDetail, createKoreanPalaceFocus } from '../../engine/tactile/createKoreanPalace';
import { Heritage3D } from './Heritage3D';
import { DotPadOutputPanel } from '../dotpad/DotPadOutputPanel';
import type { TactileLayerType } from '../dotpad/DotPadOutputPanel';
import { TTSNarrationPanel } from '../narration/TTSNarrationPanel';
import { CompletionScreen } from '../ui/CompletionScreen';
import { useSwipe } from '../../hooks/useSwipe';
import styles from './HeritageSlidePlayer.module.css';

const TACTILE_MAP: Record<string, () => DotMatrix> = {
  // Cheomseongdae
  'cheomseongdae-silhouette': createCheomseongdaeSilhouette,
  'cheomseongdae-window': createCheomseongdaeWindow,
  'cheomseongdae-base': createCheomseongdaeBase,
  'cheomseongdae-top': createCheomseongdaeTop,
  'cheomseongdae-quiz': createCheomseongdaeQuiz,
  // Moon Jar
  'moon-jar-silhouette': createMoonJarSilhouette,
  'moon-jar-structure': createMoonJarStructure,
  'moon-jar-detail': createMoonJarDetail,
  'moon-jar-focus': createMoonJarFocus,
  'moon-jar-quiz': createMoonJarQuiz,
  // Roof Tile
  'roof-tile-silhouette': createRoofTileSilhouette,
  'roof-tile-structure': createRoofTileStructure,
  'roof-tile-detail': createRoofTileDetail,
  'roof-tile-focus': createRoofTileFocus,
  'roof-tile-quiz': createRoofTileQuiz,
  // Traditional Ship
  'traditional-ship-silhouette': createTraditionalShipSilhouette,
  'traditional-ship-structure': createTraditionalShipStructure,
  'traditional-ship-detail': createTraditionalShipDetail,
  'traditional-ship-focus': createTraditionalShipFocus,
  'traditional-ship-quiz': createTraditionalShipQuiz,
  // Korean Palace
  'korean-palace-silhouette': createKoreanPalaceSilhouette,
  'korean-palace-structure': createKoreanPalaceStructure,
  'korean-palace-detail': createKoreanPalaceDetail,
  'korean-palace-focus': createKoreanPalaceFocus,
};

/** Map a slide's TactileLayer to a TactileLayerType for the DotPad panel */
function slideLayerToType(tactileLayer: string, slideIndex: number): TactileLayerType {
  // Per-index default override first
  const indexDefaults: Record<number, TactileLayerType> = {
    0: 'silhouette',
    1: 'detail',
    2: 'structure',
    3: 'focus',
  };
  if (slideIndex in indexDefaults) return indexDefaults[slideIndex];

  // Fallback: map from slide's tactileLayer field
  switch (tactileLayer) {
    case 'overview': return 'silhouette';
    case 'part':     return 'structure';
    case 'focus':    return 'focus';
    case 'quiz':     return 'detail';
    default:         return 'silhouette';
  }
}

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

  // WOW #1 — Tactile Sync Reveal
  const [tactileScanning, setTactileScanning] = useState(false);

  // WOW #3 — Layer Morphing
  const [currentLayer, setCurrentLayer] = useState<TactileLayerType>('silhouette');

  // WOW #2 — Focus Point Bridge
  const [focusHighlight, setFocusHighlight] = useState(false);

  const slide = heritage.slides[slideIndex];

  const currentMatrix: DotMatrix = slide
    ? (TACTILE_MAP[slide.tactileGraphicId]?.() ?? createEmptyMatrix())
    : createEmptyMatrix();

  /** Trigger the row-by-row dot reveal on DotPadOutputPanel for 900 ms */
  const triggerTactileScan = useCallback(() => {
    setTactileScanning(true);
    setTimeout(() => setTactileScanning(false), 900);
  }, []);

  /** Trigger the jade-glow focus highlight for 1500 ms */
  const triggerFocusHighlight = useCallback(() => {
    setFocusHighlight(true);
    setTimeout(() => setFocusHighlight(false), 1500);
  }, []);

  /** Sync layer state whenever the slide index changes */
  const syncLayer = useCallback((index: number) => {
    const targetSlide = heritage.slides[index];
    if (targetSlide) {
      setCurrentLayer(slideLayerToType(targetSlide.tactileLayer, index));
    }
  }, [heritage.slides]);

  const goNext = useCallback(() => {
    if (slideIndex === heritage.slides.length - 1) {
      setCompleted(true);
      onComplete?.();
    } else {
      setDirection(1);
      setSlideIndex(i => {
        const next = i + 1;
        onSlideChange?.(next);
        syncLayer(next);
        return next;
      });
      setQuizSelected(null);
      setQuizResult(null);
      triggerTactileScan();
    }
  }, [slideIndex, heritage.slides.length, onComplete, onSlideChange, syncLayer, triggerTactileScan]);

  const goPrev = useCallback(() => {
    if (slideIndex > 0) {
      setDirection(-1);
      setSlideIndex(i => {
        const prev = i - 1;
        onSlideChange?.(prev);
        syncLayer(prev);
        return prev;
      });
      setQuizSelected(null);
      setQuizResult(null);
      triggerTactileScan();
    }
  }, [slideIndex, onSlideChange, syncLayer, triggerTactileScan]);

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

  // Sync layer on initial mount
  useEffect(() => {
    syncLayer(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const slideLabel = `${slideIndex + 1} / ${heritage.slides.length}`;

  return (
    <div className={styles.player}>
      {/* Progress rail */}
      <div
        className={styles.progressRail}
        role="progressbar"
        aria-valuenow={slideIndex + 1}
        aria-valuemax={heritage.slides.length}
        aria-label={`Slide ${slideIndex + 1} of ${heritage.slides.length}`}
      >
        {heritage.slides.map((_, i) => (
          <div
            key={i}
            className={`${styles.progressDot} ${i === slideIndex ? styles.progressDotActive : i < slideIndex ? styles.progressDotDone : ''}`}
          />
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
                {slide.cameraView && (
                  <span className={styles.cameraViewBadge}>
                    {slide.cameraView === 'front' ? 'FRONT VIEW'
                      : slide.cameraView === 'side' ? 'SIDE VIEW'
                      : slide.cameraView === 'top' ? 'TOP VIEW'
                      : 'DETAIL'}
                  </span>
                )}
              </div>
              <div className={styles.frame3d}>
                <Heritage3D
                  heritageId={heritage.id}
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

              {/* Slide title with fade-in animation */}
              <motion.div
                className={styles.slideTitle}
                key={`title-${slide.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
              >
                <h2>{lang === 'ko' ? slide.title.ko : slide.title.en}</h2>
                <p>{lang === 'ko' ? slide.subtitle.ko : slide.subtitle.en}</p>
              </motion.div>
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
          {/* WOW #2 — Focus Point Bridge: jade-glow wrapper */}
          <div className={`${styles.dotpadWrapper} ${focusHighlight ? styles.dotpadWrapperFocus : ''} ${tactileScanning ? styles.dotpadWrapperScanning : ''}`}>
            <DotPadOutputPanel
              matrix={currentMatrix}
              brailleText={slide.brailleText}
              scanning={tactileScanning}
              currentLayer={currentLayer}
              onLayerChange={setCurrentLayer}
              showLayerControls={true}
              heritageName={heritage.title.ko}
              slideLabel={slideLabel}
            />
          </div>
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

        {/* WOW #2 — TACTILE FOCUS button */}
        <button
          className={styles.tactileBtn}
          onClick={triggerFocusHighlight}
          aria-label="Tactile Focus — highlight current point on Dot Pad"
        >
          <span aria-hidden="true">⬡</span>
          {lang === 'ko' ? '촉각 포커스' : 'TACTILE FOCUS'}
        </button>

        {/* Focus Point Bridge banner */}
        {(slide.interactionType === 'find' || slide.interactionType === 'touch') && slide.focusInstruction && (
          <div className={styles.focusInstructionBar} role="status" aria-live="polite">
            <span aria-hidden="true">⬡</span>
            {lang === 'ko' ? slide.focusInstruction.ko : slide.focusInstruction.en}
          </div>
        )}

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
          onRestart={() => { setSlideIndex(0); setCompleted(false); onSlideChange?.(0); syncLayer(0); }}
          onMore={onBack ?? (() => {})}
        />
      )}
    </div>
  );
}
