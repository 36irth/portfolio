export type WebGLSupportReport = {
  userAgent: string;
  webgl: boolean;
  webgl2: boolean;
  threeRequiresWebGL2: boolean;
};

const contextOptions: WebGLContextAttributes = {
  alpha: true,
  antialias: true,
  failIfMajorPerformanceCaveat: false,
};

function canCreateContext(type: "webgl" | "webgl2" | "experimental-webgl") {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext(type, contextOptions);
    return Boolean(context);
  } catch {
    return false;
  }
}

export function getWebGLSupport(): WebGLSupportReport {
  const webgl2 = canCreateContext("webgl2");
  const webgl = canCreateContext("webgl") || canCreateContext("experimental-webgl");

  return {
    userAgent: navigator.userAgent,
    webgl,
    webgl2,
    threeRequiresWebGL2: true,
  };
}

export function logWebGLDiagnostics(
  report: WebGLSupportReport,
  rendererStatus: { success: boolean; errorMessage?: string },
) {
  console.groupCollapsed("[yulssem intro] WebGL diagnostics");
  console.info("navigator.userAgent:", report.userAgent);
  console.info("WebGL supported:", report.webgl);
  console.info("WebGL2 supported:", report.webgl2);
  console.info("Three.js WebGLRenderer requires WebGL2:", report.threeRequiresWebGL2);
  console.info("renderer creation success:", rendererStatus.success);
  if (!rendererStatus.success) {
    console.error("renderer creation error:", rendererStatus.errorMessage ?? "Unknown renderer creation error");
  }
  console.groupEnd();
}
