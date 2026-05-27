export const SEQUENCE = ['c', 'h', 'a', 'e', 'i'];

export const KEYCAP_CONFIGS = SEQUENCE.map((letter, index) => ({
  letter: letter.toUpperCase(),
  color: '#EDE8DF',
  textColor: '#1C1C1C',
  glow: '#FF8040',
  emissive: '#C05228',
  labelFont: 'miller',
}));

export const SCENE = {
  keycapW: 1.1,
  keycapH: 0.52,
  keycapD: 1.1,
  radius: 0.17,
  bevelSegments: 3,
  spacing: 1.44,
  mobileSpacing: 1.44,
  desktopOffsetX: -0.35,
  desktopOffsetY: -0.85,
  desktopOffsetZ: 0,
  desktopDepthStep: 0.24,
  desktopKeyRotationY: -0.24,
  pressDepth: 0.17,
  cameraFov: 38,
  cameraY: 7.4,
  cameraZ: 7.5,
  bg: '#0d0d0d',
  pressedColor:    '#C8562A',
  pressedEmissive: '#8B3518',
};
