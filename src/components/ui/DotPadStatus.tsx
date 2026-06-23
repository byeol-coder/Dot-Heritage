import { useState } from 'react';
import styles from './DotPadStatus.module.css';

export function DotPadStatus() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className={styles.wrap}>
      <button
        className={styles.chip}
        onClick={() => setShowInfo(v => !v)}
        aria-label="Dot Pad connection status"
        aria-expanded={showInfo}
      >
        <span className={styles.dot} />
        MOCK · 미연결
      </button>
      {showInfo && (
        <div className={styles.tooltip} role="tooltip">
          <strong>Dot Pad란?</strong>
          <p>
            Dot Pad는 60×40 점 행렬로 촉각 그래픽을 표현하는 점자 디스플레이입니다.
            현재 화면은 미리보기 모드입니다. 실제 기기를 연결하면 각 슬라이드의
            핵심 형태가 닷패드 위에 자동으로 출력됩니다.
          </p>
          <a href="https://dotincorp.com" target="_blank" rel="noopener noreferrer">
            Dot Inc. 제품 보기 →
          </a>
        </div>
      )}
    </div>
  );
}
