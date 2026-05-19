const TARGET = "yulssem";

type WebGLIntroProps = {
  cursor: number;
  reason: string | null;
  onKeyPress: (letter: string) => void;
  onSkip: () => void;
};

export function WebGLIntro({ cursor, reason, onKeyPress, onSkip }: WebGLIntroProps) {
  return (
    <div className="webgl-fallback" role="status">
      <div className="fallback-keycaps" aria-label="Fallback keycap input">
        {TARGET.split("").map((letter, index) => (
          <button
            key={`${letter}-fallback-${index}`}
            type="button"
            className="fallback-keycap"
            data-fallback-index={index}
            data-active={cursor === index}
            data-done={cursor > index}
            onClick={() => onKeyPress(letter)}
          >
            {letter.toUpperCase()}
          </button>
        ))}
      </div>

      <p className="webgl-fallback-message">
        이 브라우저에서는 3D 인트로를 실행할 수 없습니다.
        <br />
        Chrome 설정에서 하드웨어 가속과 WebGL2 지원 상태를 확인해 주세요.
      </p>

      {reason ? <p className="webgl-fallback-reason">진단: {reason}</p> : null}

      <button className="skip-intro-button" type="button" onClick={onSkip}>
        인트로 건너뛰기
      </button>
    </div>
  );
}
