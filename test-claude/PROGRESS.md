# yulssem 키캡 인트로 — 작업 진행 기록

## 개요

Three.js + GSAP + React(Vite) 기반 타이핑 인트로 애니메이션.  
`y → u → l → s → s → e → m` 순서로 키를 입력하면 각 3D 키캡이 눌리고,  
완료 시 웨이브 애니메이션 후 메인 페이지로 전환.

---

## 프로젝트 구조

```
c:\최율희\연습\claude\
├── index.html
├── vite.config.js          # server.host: true (모든 인터페이스 바인딩)
├── package.json
├── .gitignore
├── .gitattributes          # LF 라인엔딩 정규화
├── PROGRESS.md             # 이 파일
└── src/
    ├── main.jsx
    ├── App.jsx              # intro / main 2-phase 상태 전환
    ├── index.css            # 전역 리셋
    ├── utils/
    │   └── webgl.js         # WebGL1/2 진단 유틸 (차단용 아님)
    ├── components/
    │   └── KeyboardIntro/
    │       ├── constants.js          # SEQUENCE, KEYCAP_CONFIGS, SCENE 상수
    │       ├── Keycap.js             # 키캡 지오메트리/재질 팩토리
    │       ├── SceneManager.js       # Three.js 씬 생명주기
    │       ├── animations.js         # GSAP 애니메이션 함수들
    │       ├── index.jsx             # React 래퍼 컴포넌트
    │       └── KeyboardIntro.module.css
    └── pages/
        ├── MainPage.jsx
        └── MainPage.module.css
```

---

## 핵심 파일별 역할

### `constants.js`
- `SEQUENCE` — 입력 순서 배열 `['y','u','l','s','s','e','m']`
- `KEYCAP_CONFIGS` — 키캡별 색상 팔레트 (7종)
- `SCENE` — 카메라/지오메트리/애니메이션 수치 상수

### `Keycap.js`
- `createKeycap(config, index)` → `THREE.Group` 반환
- `RoundedBoxGeometry` + `MeshPhysicalMaterial` (clearcoat 0.75)
- Canvas 텍스처로 레이블 렌더링
- `group.userData` = `{ body, bodyMat, glowMat, labelMat, index, restY, letter }`

### `SceneManager.js`
- `constructor(canvas, { onComplete, onProgress })`
- `handleKey(key)` — 시퀀스 처리, 콜백 호출
- `setAnimationCallbacks({ onPress, onWrongKey, onCompletion, onEntrance })`
- `destroy()` — rAF/리사이즈/GSAP/Three.js 리소스 전체 정리

### `animations.js`
- `animateEntrance(keycaps)` — 위에서 떨어지며 등장 + float 시작
- `animatePress(keycap)` — 누름/반동/글로우 플래시
- `animateWrongKey(keycap)` — 좌우 흔들림
- `animateCompletion(keycaps, onDone)` — 웨이브 → 하늘로 이탈
- `startFloat(keycap, index)` / `stopFloat(keycap)` — 유휴 부유

### `index.jsx` (KeyboardIntro)
- StrictMode 이중 초기화 방지 (`ownedRef` + `_instanceCount`)
- 키보드 이벤트 처리 (`Escape` = 스킵)
- WebGL 실패 시 fallback UI (인트로 건너뛰기 버튼)

---

## 의존성

```json
"three": "0.162.0"    // WebGL1/2 모두 지원 (r163+ 는 WebGL2 전용)
"gsap": "^3.12.5"
"react": "^18.3.1"
"react-dom": "^18.3.1"
```

---

## 카메라 튜닝 포인트 (`constants.js` → `SCENE`)

| 값 | 의미 | 현재값 |
|---|---|---|
| `cameraFov` | 시야각. 낮을수록 망원(납작), 높을수록 광각 | `38` |
| `cameraY` | 높이. 올릴수록 위에서 내려다봄 | `7.4` |
| `cameraZ` | 거리. 줄이면 가까이, 늘리면 멀리 | `7.5` |

---

## 트러블슈팅 이력

| 문제 | 원인 | 해결 |
|---|---|---|
| 일반 브라우저에서 접속 불가 | Vite가 IPv6(`::1`)에만 바인딩 | `vite.config.js`에 `server: { host: true }` 추가 |
| WebGL 컨텍스트 생성 실패 | 화면 공유 소프트웨어가 GPU 점유 | 화면 공유 종료 후 Chrome 재시작 |
| Vercel 배포 후 fallback 표시 | probe canvas에서 같은 canvas에 webgl2/webgl1 순서로 context 요청 → 충돌 → `any: false` | 타입별 별도 canvas 사용 + probe 결과로 차단하지 않고 SceneManager 실패 시에만 fallback |
| Vercel WebGL2 미지원 환경 | Three.js r163+ WebGL2 전용, Chrome SW 렌더링은 WebGL1만 지원 | `three@0.162.0`으로 다운그레이드 (WebGL1 자동 폴백) |
| GSAP 트윈 미정리 (StrictMode) | `destroy()`에서 `keycaps = []` 이후에 `killTweensOf` 호출 | kill을 배열 비우기 전으로 이동 |

---

## 로컬 실행

```bash
cd c:\최율희\연습\claude
npm install
npm run dev
# → http://localhost:5173
```

## 빌드 / 배포

```bash
npm run build   # dist/ 생성
# Vercel: git push → 자동 배포
```
