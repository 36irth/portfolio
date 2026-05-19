export function detectWebGL() {
  let webgl2 = false;
  let webgl1 = false;

  try {
    const c2 = document.createElement('canvas');
    c2.width = 1; c2.height = 1;
    webgl2 = !!(c2.getContext('webgl2') ?? c2.getContext('experimental-webgl2'));
  } catch (e) { /* ignore */ }

  try {
    const c1 = document.createElement('canvas');
    c1.width = 1; c1.height = 1;
    webgl1 = !!(c1.getContext('webgl') ?? c1.getContext('experimental-webgl'));
  } catch (e) { /* ignore */ }

  return { webgl1, webgl2, any: webgl1 || webgl2 };
}
