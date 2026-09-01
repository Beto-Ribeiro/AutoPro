import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  :root {
    /* ── Primary ── */
    --primary: #b70011;
    --primary-container: #dc2626;
    --on-primary: #ffffff;
    --on-primary-container: #fff6f5;
    --primary-fixed: #ffdad6;
    --primary-fixed-dim: #ffb4ab;
    --inverse-primary: #ffb4ab;

    /* ── Secondary ── */
    --secondary: #565e74;
    --secondary-container: #dae2fd;
    --on-secondary: #ffffff;
    --on-secondary-container: #5c647a;
    --secondary-fixed: #dae2fd;
    --secondary-fixed-dim: #bec6e0;

    /* ── Tertiary ── */
    --tertiary: #4c5b6f;
    --tertiary-container: #657388;
    --on-tertiary: #ffffff;
    --on-tertiary-container: #f7f8ff;
    --tertiary-fixed: #d5e3fc;
    --tertiary-fixed-dim: #b9c7df;

    /* ── Surface ── */
    --surface: #f7f9fb;
    --surface-dim: #d8dadc;
    --surface-bright: #f7f9fb;
    --surface-container-lowest: #ffffff;
    --surface-container-low: #f2f4f6;
    --surface-container: #eceef0;
    --surface-container-high: #e6e8ea;
    --surface-container-highest: #e0e3e5;
    --surface-variant: #e0e3e5;
    --surface-tint: #bf0715;
    --on-surface: #191c1e;
    --on-surface-variant: #5c403c;
    --inverse-surface: #2d3133;
    --inverse-on-surface: #eff1f3;

    /* ── Background ── */
    --background: #f7f9fb;
    --on-background: #191c1e;

    /* ── Outline ── */
    --outline: #916f6b;
    --outline-variant: #e6bdb8;

    /* ── Error ── */
    --error: #ba1a1a;
    --error-container: #ffdad6;
    --on-error: #ffffff;
    --on-error-container: #93000a;

    /* ── Spacing ── */
    --margin-desktop: 40px;
    --margin-mobile: 16px;
    --gutter: 24px;
    --stack-lg: 24px;
    --stack-md: 12px;
    --stack-sm: 4px;
    --base: 8px;
    --container-max: 1280px;

    /* ── Radius ── */
    --radius-sm: 0.25rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-full: 9999px;

    /* ── Shadow ── */
    --shadow-sm: 0px 4px 20px rgba(15,23,42,0.08);
    --shadow-md: 0px 8px 30px rgba(15,23,42,0.12);
  }

  body {
    background-color: var(--background);
    color: var(--on-background);
    font-family: "Inter", sans-serif;
    font-size: 1rem;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ul { list-style: none; }
  a  { text-decoration: none; color: inherit; }
  button { cursor: pointer; font-family: inherit; }
  input, select, textarea { font-family: inherit; }

  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    vertical-align: middle;
    user-select: none;
  }
`;
