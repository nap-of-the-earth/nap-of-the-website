import type { MiddlewareHandler } from "astro";

const MAINTENANCE_HTML = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Under Construction — Yu-Wei Tseng</title>
  <meta name="robots" content="noindex, nofollow" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'JetBrains Mono', monospace;
      background: #0a0a0a;
      color: #fafafa;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }

    /* Subtle grid background */
    body::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
    }

    .container {
      text-align: center;
      position: relative;
      z-index: 1;
      padding: 2rem;
    }

    /* Animated icon */
    .icon {
      margin-bottom: 2rem;
      display: inline-block;
      animation: pulse 2s ease-in-out infinite;
    }

    .icon img {
      width: 48px;
      height: 48px;
      border-radius: 6px;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }

    .overline {
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #525252;
      margin-bottom: 1.5rem;
    }

    h1 {
      font-size: clamp(1.5rem, 4vw, 2.5rem);
      font-weight: 500;
      letter-spacing: -0.02em;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #fafafa 0%, #a3a3a3 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 0.8rem;
      font-weight: 400;
      color: #525252;
      line-height: 1.8;
      max-width: 400px;
      margin: 0 auto 2.5rem;
    }

    /* Animated progress bar */
    .progress-track {
      width: 200px;
      height: 2px;
      background: #1a1a1a;
      border-radius: 1px;
      margin: 0 auto 2rem;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      width: 30%;
      background: #0070f3;
      border-radius: 1px;
      animation: slide 2s ease-in-out infinite;
    }

    @keyframes slide {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(500%); }
    }

    .status {
      font-size: 0.6rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #404040;
    }

    .status span {
      color: #0070f3;
    }

    /* Bottom corner signature */
    .signature {
      position: fixed;
      bottom: 2rem;
      font-size: 0.6rem;
      letter-spacing: 0.1em;
      color: #262626;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon"><img src="/favicon.png" alt="Yu-Wei Tseng" width="48" height="48" /></div>
    <p class="overline">Status</p>
    <h1>Under Construction</h1>
    <p class="subtitle">
      This site is being built and will be available soon.
    </p>
    <div class="progress-track">
      <div class="progress-bar"></div>
    </div>
    <p class="status"><span>●</span> Building in progress</p>
  </div>
  <p class="signature">© ${new Date().getFullYear()} Yu-Wei Tseng</p>
</body>
</html>`;

export const onRequest: MiddlewareHandler = async (_context, next) => {
  const isMaintenanceMode = import.meta.env.MAINTENANCE_MODE === "true";

  if (!isMaintenanceMode) {
    return next();
  }

  // Allow API routes to still function (e.g. health checks)
  if (_context.url.pathname.startsWith("/api/")) {
    return next();
  }

  return new Response(MAINTENANCE_HTML, {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Retry-After": "3600",
    },
  });
};
