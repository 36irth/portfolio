export const SEQUENCE = ['c', 'h', 'a', 'e', 'i'];

export const KEYCAP_CONFIGS = SEQUENCE.map((letter, index) => ({
  letter: letter.toUpperCase(),
  color: '#F9F9F4',
  textColor: '#1C1C1C',
  glow: '#7FDBFF',
  emissive: '#35AEE6',
  labelFont: 'nohemi',
}));

export const SCENE = {
  keycapW: 1.2,
  keycapH: 0.56,
  keycapD: 1.2,
  radius: 0.2,
  bevelSegments: 3,
  spacing: 1.58,
  mobileSpacing: 1.62,
  desktopOffsetX: 0,
  desktopOffsetY: -2.45,
  desktopOffsetZ: 0.2,
  mobileGroupOffsetY: -2.0,
  desktopDepthStep: 0.11,
  desktopKeyRotationY: -0.16,
  desktopKeyRotationX: 0.06,
  pressDepth: 0.17,
  cameraFov: 34,
  cameraY: 6.45,
  cameraZ: 7.15,
  bg: '#0d0d0d',
  pressedColor:    '#0188FB',
  pressedEmissive: '#0168c0',
};
