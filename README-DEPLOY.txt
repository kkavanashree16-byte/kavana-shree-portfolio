KAVANA SHREE K — PREMIUM PORTFOLIO
==================================

This is a complete static-site update for your existing GitHub Pages portfolio.
It does not require Node.js, npm, a backend, or a build command.

WHAT'S INCLUDED
---------------
index.html             Complete redesigned portfolio content
style.css              Original base stylesheet retained
script.js              Project filters, copy-email action and footer year
theme-overrides.css    Existing black/beige theme retained
project-demos.css      Existing demo component styles retained
project-demos.js       Existing interactive demo logic retained
premium.css            New premium responsive design system
premium.js             Motion, ambient canvas, live clock and simulated telemetry
images/                Your existing profile and home project images

HOW TO PUBLISH TO YOUR EXISTING GITHUB PAGES SITE
-------------------------------------------------
1. Extract this ZIP file.
2. Open the extracted folder named Kavana_Shree_Premium_Portfolio.
3. Open your repository:
   https://github.com/kkavanashree16-byte/kavana-shree-portfolio
4. Make sure you are on the main branch and at the repository root.
5. Choose Add file > Upload files.
6. Upload ALL files and the images folder from this extracted folder.
   Upload the files directly into the repository root, not into another folder.
7. When GitHub detects files with the same names, the uploaded versions replace
   the older versions after you commit. The new premium.css and premium.js files
   will be added.
8. Click Commit changes.
9. Open the Actions tab and wait until the latest Pages deployment has a green
   check mark.
10. Open your portfolio and press Ctrl + Shift + R to force-refresh it.

IMPORTANT
---------
- Keep the images folder and both image files in the repository root's images
  folder. The website references images/kavana-profile.png and
  images/modern-home.png.
- Keep the existing GitHub Pages setting: Deploy from a branch > main > /(root).
- The animation library GSAP and its ScrollTrigger plugin are loaded from the
  jsDelivr CDN (version 3.15.0). If that CDN is unavailable, the page still has
  a native animation fallback and all main content remains visible.
- The ThermAssure temperature chart and readings are simulated portfolio
  animations. They are not connected to an ESP32, BLE, MQTT, HiveMQ, Timescale
  Cloud or Grafana data source.
- The fruit classifier, study planner, password checker and home price estimate
  remain illustrative browser demos; they are not deployed ML model endpoints.
- The password demo runs in the browser. Never enter a real account password.
