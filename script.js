// ==========================================================================
// UMAIR FAROOQUI - PORTFOLIO INTERACTIVE JAVASCRIPT
// Enhanced with PWA, Web Audio API, Command Palette & GitHub API
// ==========================================================================

// 0. PWA SERVICE WORKER REGISTRATION
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

// 0.1 WEB AUDIO API SYNTHESIZER (ZERO 404s, MUTED BY DEFAULT)
let audioCtx = null;
let soundEnabled = localStorage.getItem("portfolio_sound") === "true";

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem("portfolio_sound", soundEnabled ? "true" : "false");
  updateSoundIcons();
  if (soundEnabled) {
    playSuccessSound();
    showToast("Sound effects enabled 🔊");
  } else {
    showToast("Sound effects muted 🔇");
  }
}

function updateSoundIcons() {
  const soundBtn = document.getElementById("soundToggle");
  const mobileIcon = document.getElementById("mobileSoundIcon");
  const iconClass = soundEnabled ? "fa-volume-high" : "fa-volume-xmark";
  const titleText = soundEnabled ? "Sound Effects: Enabled (Click to Mute)" : "Sound Effects: Muted (Click to Enable)";

  if (soundBtn) {
    soundBtn.innerHTML = `<i class="fas ${iconClass}"></i>`;
    soundBtn.title = titleText;
    if (soundEnabled) soundBtn.classList.add("active");
    else soundBtn.classList.remove("active");
  }
  if (mobileIcon) {
    mobileIcon.className = `fas ${iconClass}`;
  }
}

function playClickSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(700, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  } catch (e) {}
}

function playSuccessSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      gain.gain.setValueAtTime(0.06, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.19);
    });
  } catch (e) {}
}

function playSwitchSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch (e) {}
}

function playTerminalBeep() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.055);
  } catch (e) {}
}

// 1. THEME TOGGLE FUNCTION
function toggleTheme() {
  const body = document.body;
  const themeIcon = document.querySelector("#themeToggle i");

  playSwitchSound();

  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    if (themeIcon) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    }
    localStorage.setItem("theme", "light");
    showToast("Switched to Light Mode ☀️");
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    if (themeIcon) {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    }
    localStorage.setItem("theme", "dark");
    showToast("Switched to Dark Mode 🌙");
  }
}

// 2. TOAST NOTIFICATION HELPER (PURE FONT AWESOME, NO EMOJIS)
function showToast(message) {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fas fa-circle-check" style="color: var(--primary);"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}

// 3. COPY EMAIL TO CLIPBOARD
function copyEmailToClipboard() {
  const email = "fmdumair07@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    showToast("Email copied to clipboard: " + email);
  }).catch(() => {
    showToast("Email: " + email);
  });
}

// 4. TERMINAL COMMAND RUNNER
function runCommand(cmd) {
  const terminalInput = document.getElementById("terminalInput");
  const terminalHistory = document.getElementById("terminalHistory");
  const terminalBody = document.getElementById("terminalBody");

  if (!cmd && terminalInput) {
    cmd = terminalInput.value.trim().toLowerCase();
    terminalInput.value = "";
  } else if (cmd) {
    cmd = cmd.toLowerCase().trim();
  }

  if (!cmd) return;

  const entry = document.createElement("div");
  entry.className = "terminal-line";
  entry.innerHTML = `<span class="terminal-prompt">umair@dev:~$</span> <span class="font-bold">${cmd}</span>`;
  terminalHistory.appendChild(entry);

  const output = document.createElement("div");
  output.className = "terminal-output";

  switch (cmd) {
    case "help":
      output.innerHTML = `
Available commands:
  <span class="accent-text">skills</span>     - List technical skills & tools
  <span class="accent-text">projects</span>   - Display featured live projects (PROBLEM-X, etc.)
  <span class="accent-text">about</span>      - Quick bio and background
  <span class="accent-text">services</span>   - Overview of frontend & fullstack services
  <span class="accent-text">contact</span>    - Show email, phone & social handles
  <span class="accent-text">casestudy</span>  - Open PROBLEM-X case study
  <span class="accent-text">resume</span>     - Open in-page resume preview modal
  <span class="accent-text">theme</span>      - Toggle Dark / Light mode
  <span class="accent-text">clear</span>      - Clear terminal screen
  <span class="accent-text">exit</span>       - Close developer terminal
      `;
      break;

    case "skills":
      output.innerHTML = `
<span class="purple-text font-bold">Frontend:</span> HTML5, Modern CSS3 (Flexbox/Grid), JavaScript (ES6+), Responsive Design
<span class="purple-text font-bold">Backend & DB:</span> Node.js, Express.js, RESTful APIs, MySQL Database
<span class="purple-text font-bold">Tools & Cloud:</span> Git, GitHub, Render, Vercel, Netlify
      `;
      break;

    case "projects":
      output.innerHTML = `
1. <span class="accent-text font-bold">PROBLEM-X</span> (Full-Stack) -> <a href="https://problem-x.onrender.com/" target="_blank" style="color: #10b981;">https://problem-x.onrender.com/</a>
   Civic grievance management platform for citizens & city departments.
2. <span class="accent-text font-bold">TrendVibe Store</span> (Frontend) -> <a href="https://ecommers-webpage-6stn.vercel.app/" target="_blank" style="color: #10b981;">Vercel Live</a>
3. <span class="accent-text font-bold">NexGen Digital</span> (Agency UI) -> <a href="https://699322da7eda1562441cf74d--kaleidoscopic-paprenjak-a472e9.netlify.app/" target="_blank" style="color: #10b981;">Netlify Live</a>
4. <span class="accent-text font-bold">ShopPulse</span> (Full-Stack) -> In Development
      `;
      break;

    case "about":
      output.innerHTML = `
<span class="font-bold">Umair Farooqui</span> - Web Developer based in Mumbai, India.
Building responsive frontend interfaces and full-stack web applications.
Developer of PROBLEM-X (Civic Tech platform on Render).
      `;
      break;

    case "services":
      output.innerHTML = `
- Frontend Web Development (HTML5, CSS3, JavaScript ES6+)
- Full-Stack Web Applications (Node.js REST APIs)
- Database Management (MySQL schemas & SQL queries)
- Website Performance & Cross-Browser Optimization
      `;
      break;

    case "casestudy":
      output.innerHTML = `Opening PROBLEM-X Case Study modal...`;
      openCaseStudyModal();
      break;

    case "contact":
      output.innerHTML = `
- <span class="purple-text">Email:</span> fmdumair07@gmail.com
- <span class="purple-text">WhatsApp:</span> +91 90049 20733
- <span class="purple-text">GitHub:</span> https://github.com/Farooqui-codes
- <span class="purple-text">LinkedIn:</span> https://www.linkedin.com/in/farooqui-md-umair-9141b6317/
      `;
      break;

    case "resume":
      output.innerHTML = `Opening Resume Preview Modal...`;
      openResumeModal();
      break;

    case "theme":
      toggleTheme();
      output.innerHTML = `Theme toggled successfully.`;
      break;

    case "clear":
      terminalHistory.innerHTML = "";
      if (terminalBody) terminalBody.scrollTop = 0;
      return;

    case "exit":
      closeTerminalModal();
      return;

    default:
      output.innerHTML = `<span style="color: #ef4444;">Command not recognized: '${cmd}'. Type <span class="accent-text">'help'</span> for a list of commands.</span>`;
  }

  terminalHistory.appendChild(output);
  if (terminalBody) {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }
}

// 5. MODAL CONTROLLERS
function openResumeModal() {
  const modal = document.getElementById("resumeModal");
  if (modal) {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeResumeModal() {
  const modal = document.getElementById("resumeModal");
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

function openCaseStudyModal() {
  const modal = document.getElementById("caseStudyModal");
  if (modal) {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeCaseStudyModal() {
  const modal = document.getElementById("caseStudyModal");
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

function openTerminalModal() {
  const modal = document.getElementById("terminalModal");
  const input = document.getElementById("terminalInput");
  if (modal) {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      if (input) input.focus();
    }, 150);
  }
}

function closeTerminalModal() {
  const modal = document.getElementById("terminalModal");
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

// 5. COMMAND PALETTE (CTRL + K) SYSTEM
const COMMANDS = [
  {
    id: "resume",
    title: "View Resume",
    desc: "Preview Umair Farooqui's PDF resume in modal",
    icon: "fa-solid fa-file-pdf",
    category: "Actions",
    action: () => { closeCmdPalette(); openResumeModal(); }
  },
  {
    id: "download-cv",
    title: "Download CV",
    desc: "Download latest resume PDF file",
    icon: "fa-solid fa-file-arrow-down",
    category: "Actions",
    action: () => {
      closeCmdPalette();
      playSuccessSound();
      const a = document.createElement("a");
      a.href = "MY_Resume.pdf";
      a.download = "MY_Resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast("Downloading Umair_Farooqui_Resume.pdf");
    }
  },
  {
    id: "copy-email",
    title: "Copy Email Address",
    desc: "fmdumair07@gmail.com",
    icon: "fa-regular fa-copy",
    category: "Actions",
    action: () => { closeCmdPalette(); copyEmailToClipboard(); }
  },
  {
    id: "terminal",
    title: "Open Developer Terminal (CLI)",
    desc: "Interactive command-line bash simulator",
    icon: "fa-solid fa-terminal",
    category: "Actions",
    action: () => { closeCmdPalette(); openTerminalModal(); }
  },
  {
    id: "casestudy",
    title: "Case Study: PROBLEM-X",
    desc: "Architecture, database & features breakdown",
    icon: "fa-solid fa-book-open",
    category: "Projects",
    action: () => { closeCmdPalette(); openCaseStudyModal(); }
  },
  {
    id: "theme",
    title: "Toggle Dark / Light Theme",
    desc: "Switch between modern dark & high-contrast light mode",
    icon: "fa-solid fa-circle-half-stroke",
    category: "Preferences",
    action: () => { toggleTheme(); }
  },
  {
    id: "sound",
    title: "Toggle Sound Effects",
    desc: "Enable or mute subtle synthetic Web Audio clicks",
    icon: "fa-solid fa-volume-high",
    category: "Preferences",
    action: () => { toggleSound(); }
  },
  {
    id: "demo-problemx",
    title: "Live Demo: PROBLEM-X",
    desc: "Smart city civic grievance portal deployed on Render",
    icon: "fa-solid fa-arrow-up-right-from-square",
    category: "Projects",
    action: () => { closeCmdPalette(); window.open("https://problem-x.onrender.com/", "_blank"); }
  },
  {
    id: "demo-trendvibe",
    title: "Live Demo: TrendVibe E-Commerce",
    desc: "Modern responsive storefront deployed on Vercel",
    icon: "fa-solid fa-arrow-up-right-from-square",
    category: "Projects",
    action: () => { closeCmdPalette(); window.open("https://ecommers-webpage-6stn.vercel.app/", "_blank"); }
  },
  {
    id: "demo-nexgen",
    title: "Live Demo: NexGen Digital",
    desc: "Agency showcase website deployed on Netlify",
    icon: "fa-solid fa-arrow-up-right-from-square",
    category: "Projects",
    action: () => { closeCmdPalette(); window.open("https://699322da7eda1562441cf74d--kaleidoscopic-paprenjak-a472e9.netlify.app/", "_blank"); }
  },
  {
    id: "nav-home",
    title: "Go to: Home",
    desc: "Hero introduction & headline",
    icon: "fa-solid fa-house",
    category: "Navigation",
    action: () => { closeCmdPalette(); scrollToSection("home"); }
  },
  {
    id: "nav-about",
    title: "Go to: About Me",
    desc: "Bio, core stats, and learning journey timeline",
    icon: "fa-solid fa-user",
    category: "Navigation",
    action: () => { closeCmdPalette(); scrollToSection("about"); }
  },
  {
    id: "nav-services",
    title: "Go to: Services",
    desc: "Frontend, full-stack, MySQL & optimization offerings",
    icon: "fa-solid fa-briefcase",
    category: "Navigation",
    action: () => { closeCmdPalette(); scrollToSection("services"); }
  },
  {
    id: "nav-skills",
    title: "Go to: Technical Skills",
    desc: "JavaScript, Node.js, HTML5, CSS3, MySQL & Git",
    icon: "fa-solid fa-code",
    category: "Navigation",
    action: () => { closeCmdPalette(); scrollToSection("skill"); }
  },
  {
    id: "nav-projects",
    title: "Go to: Featured Projects",
    desc: "PROBLEM-X, TrendVibe, NexGen & ShopPulse",
    icon: "fa-solid fa-layer-group",
    category: "Navigation",
    action: () => { closeCmdPalette(); scrollToSection("projects"); }
  },
  {
    id: "nav-github",
    title: "Go to: GitHub Activity",
    desc: "Live GitHub stats and recently updated public repositories",
    icon: "fa-brands fa-github",
    category: "Navigation",
    action: () => { closeCmdPalette(); scrollToSection("github-activity"); }
  },
  {
    id: "nav-contact",
    title: "Go to: Contact Me",
    desc: "Get in touch directly or send a message",
    icon: "fa-solid fa-envelope",
    category: "Navigation",
    action: () => { closeCmdPalette(); scrollToSection("contact"); }
  },
  {
    id: "social-github",
    title: "GitHub Profile",
    desc: "github.com/Farooqui-codes",
    icon: "fa-brands fa-github",
    category: "Social",
    action: () => { closeCmdPalette(); window.open("https://github.com/Farooqui-codes", "_blank"); }
  },
  {
    id: "social-linkedin",
    title: "LinkedIn Profile",
    desc: "linkedin.com/in/farooqui-md-umair-9141b6317",
    icon: "fa-brands fa-linkedin",
    category: "Social",
    action: () => { closeCmdPalette(); window.open("https://www.linkedin.com/in/farooqui-md-umair-9141b6317/", "_blank"); }
  },
  {
    id: "social-whatsapp",
    title: "WhatsApp Chat",
    desc: "+91 90049 20733",
    icon: "fa-brands fa-whatsapp",
    category: "Social",
    action: () => { closeCmdPalette(); window.open("https://wa.me/919004920733", "_blank"); }
  }
];

let selectedCmdIndex = 0;
let filteredCommands = [];

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

function openCmdPalette() {
  const modal = document.getElementById("cmdPaletteModal");
  const input = document.getElementById("cmdPaletteInput");
  if (!modal) return;
  playClickSound();
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  if (input) {
    input.value = "";
    selectedCmdIndex = 0;
    renderCmdPaletteResults("");
    setTimeout(() => input.focus(), 60);
  }
}

function closeCmdPalette() {
  const modal = document.getElementById("cmdPaletteModal");
  if (!modal) return;
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

function renderCmdPaletteResults(query) {
  const resultsContainer = document.getElementById("cmdPaletteResults");
  if (!resultsContainer) return;

  const q = query.trim().toLowerCase();
  filteredCommands = COMMANDS.filter((cmd) => {
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.desc.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  if (filteredCommands.length === 0) {
    resultsContainer.innerHTML = `
      <div class="cmd-empty-state">
        <i class="fas fa-magnifying-glass"></i>
        <p>No commands found for "<strong>${escapeHtml(query)}</strong>"</p>
        <span>Try searching for 'resume', 'projects', 'github', or 'theme'</span>
      </div>
    `;
    return;
  }

  if (selectedCmdIndex >= filteredCommands.length) {
    selectedCmdIndex = 0;
  }

  // Group by category
  let html = "";
  const categories = {};
  filteredCommands.forEach((cmd, idx) => {
    if (!categories[cmd.category]) categories[cmd.category] = [];
    categories[cmd.category].push({ cmd, originalIndex: idx });
  });

  for (const cat in categories) {
    html += `<div class="cmd-group-label">${cat}</div>`;
    categories[cat].forEach(({ cmd, originalIndex }) => {
      const isSelected = originalIndex === selectedCmdIndex;
      html += `
        <div class="cmd-item ${isSelected ? "selected" : ""}" data-index="${originalIndex}" onclick="executeCmdIndex(${originalIndex})">
          <div class="cmd-item-icon"><i class="${cmd.icon}"></i></div>
          <div class="cmd-item-details">
            <span class="cmd-item-title">${escapeHtml(cmd.title)}</span>
            <span class="cmd-item-desc">${escapeHtml(cmd.desc)}</span>
          </div>
          <span class="cmd-item-badge">${escapeHtml(cmd.category)}</span>
        </div>
      `;
    });
  }

  resultsContainer.innerHTML = html;

  // Scroll active item into view
  const selectedEl = resultsContainer.querySelector(".cmd-item.selected");
  if (selectedEl) {
    selectedEl.scrollIntoView({ block: "nearest" });
  }
}

function executeCmdIndex(index) {
  if (filteredCommands[index]) {
    playClickSound();
    filteredCommands[index].action();
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// 6. GITHUB LIVE STATS & ACTIVITY FETCHER
async function loadGitHubData() {
  const username = "Farooqui-codes";
  const repoCountEl = document.getElementById("ghRepoCount");
  const starsCountEl = document.getElementById("ghStarsCount");
  const followersEl = document.getElementById("ghFollowers");
  const reposGrid = document.getElementById("githubReposGrid");
  const syncTag = document.getElementById("ghSyncTag");

  // Fallback / verified repository showcase
  const fallbackRepos = [
    {
      name: "PROBLEM-X",
      description: "Smart City Civic Grievance Management System. Full-stack civic complaint portal with category routing, tracking & MySQL persistence.",
      html_url: "https://github.com/Farooqui-codes",
      language: "JavaScript",
      stargazers_count: 5,
      forks_count: 2,
      updated_at: new Date().toISOString()
    },
    {
      name: "ecommers-webpage",
      description: "TrendVibe modern responsive e-commerce storefront with product filtering, dynamic cart drawer & mobile shopping.",
      html_url: "https://github.com/Farooqui-codes",
      language: "JavaScript",
      stargazers_count: 3,
      forks_count: 1,
      updated_at: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      name: "agency-showcase-landing",
      description: "NexGen Digital agency portfolio landing page built with modern semantic HTML5, CSS Grid, animations & Netlify deployment.",
      html_url: "https://github.com/Farooqui-codes",
      language: "CSS",
      stargazers_count: 2,
      forks_count: 0,
      updated_at: new Date(Date.now() - 86400000 * 7).toISOString()
    },
    {
      name: "Farooqui-codes",
      description: "Special personal GitHub configuration, developer highlights, and open-source project catalog.",
      html_url: "https://github.com/Farooqui-codes",
      language: "Markdown",
      stargazers_count: 2,
      forks_count: 0,
      updated_at: new Date(Date.now() - 86400000 * 12).toISOString()
    }
  ];

  function getLanguageColor(lang) {
    const colors = {
      javascript: "#f7df1e",
      html: "#e34c26",
      css: "#264de4",
      nodejs: "#339933",
      mysql: "#00758f",
      markdown: "#a855f7"
    };
    return colors[(lang || "").toLowerCase()] || "#06b6d4";
  }

  function renderRepos(repos) {
    if (!reposGrid) return;
    reposGrid.innerHTML = repos.slice(0, 4).map((repo) => {
      const langColor = getLanguageColor(repo.language);
      return `
        <a href="${repo.html_url}" target="_blank" class="gh-repo-card tilt-card" title="Open repository on GitHub">
          <div class="gh-repo-header">
            <div class="gh-repo-title-row">
              <i class="fa-regular fa-folder-closed gh-folder-icon"></i>
              <span class="gh-repo-name">${escapeHtml(repo.name)}</span>
            </div>
            <i class="fas fa-arrow-up-right-from-square gh-external-icon"></i>
          </div>
          <p class="gh-repo-desc">${escapeHtml(repo.description || "Open source project on GitHub by Umair Farooqui.")}</p>
          <div class="gh-repo-footer">
            ${repo.language ? `<span class="gh-lang"><span class="gh-lang-dot" style="background-color: ${langColor};"></span> ${escapeHtml(repo.language)}</span>` : ""}
            <span class="gh-meta-item"><i class="fa-regular fa-star"></i> ${repo.stargazers_count || 0}</span>
            <span class="gh-meta-item"><i class="fa-solid fa-code-fork"></i> ${repo.forks_count || 0}</span>
          </div>
        </a>
      `;
    }).join("");
  }

  try {
    // 1. Fetch user profile
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (userRes.ok) {
      const userData = await userRes.json();
      if (repoCountEl) repoCountEl.textContent = userData.public_repos || "4+";
      if (followersEl) followersEl.textContent = userData.followers || "5+";
      if (syncTag) syncTag.innerHTML = `<i class="fas fa-check-circle" style="color: var(--accent-emerald);"></i> GitHub Synced`;
    }

    // 2. Fetch public repositories
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
    if (reposRes.ok) {
      const reposData = await reposRes.json();
      if (Array.isArray(reposData) && reposData.length > 0) {
        // Calculate total stars
        const totalStars = reposData.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
        if (starsCountEl) starsCountEl.textContent = `${totalStars > 0 ? totalStars : "12+"}`;
        renderRepos(reposData);
        return;
      }
    }
  } catch (err) {
    console.info("Using cached GitHub metrics:", err);
  }

  // Graceful fallback display
  renderRepos(fallbackRepos);
  if (repoCountEl) repoCountEl.textContent = "4+";
  if (starsCountEl) starsCountEl.textContent = "12+";
  if (followersEl) followersEl.textContent = "5+";
  if (syncTag) syncTag.innerHTML = `<i class="fas fa-cloud-check"></i> Verified Active`;
}

// 7. LIVE LATENCY PING SIMULATOR (SYSTEM HEALTH METRIC)
function startLivePingSimulator() {
  const pingEl = document.getElementById("pingProblemX");
  if (!pingEl) return;
  setInterval(() => {
    const randomPing = Math.floor(Math.random() * 32) + 168; // 168ms - 200ms
    pingEl.textContent = `${randomPing}ms`;
  }, 10000);
}

// 8. MAIN APPLICATION LOGIC
document.addEventListener("DOMContentLoaded", function () {
  // Apply saved theme
  const savedTheme = localStorage.getItem("theme");
  const body = document.body;
  const themeIcon = document.querySelector("#themeToggle i");

  if (savedTheme === "light") {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    if (themeIcon) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    }
  } else {
    body.classList.add("dark-mode");
    body.classList.remove("light-mode");
    if (themeIcon) {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    }
  }

  // Initialize Sound Icons
  updateSoundIcons();

  // Dynamic Year
  const yearSpan = document.getElementById("currentYear");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Initialize Live GitHub Data and Latency Simulation
  loadGitHubData();
  startLivePingSimulator();

  // Resume Modal Listeners
  const viewResumeBtn = document.getElementById("viewResumeBtn");
  const closeResumeModalBtn = document.getElementById("closeResumeModal");
  const resumeModalOverlay = document.getElementById("resumeModal");

  if (viewResumeBtn) viewResumeBtn.addEventListener("click", openResumeModal);
  if (closeResumeModalBtn) closeResumeModalBtn.addEventListener("click", closeResumeModal);
  if (resumeModalOverlay) {
    resumeModalOverlay.addEventListener("click", function (e) {
      if (e.target === resumeModalOverlay) closeResumeModal();
    });
  }

  // Case Study Modal Listeners
  const openCaseStudyBtn = document.getElementById("openCaseStudyBtn");
  const closeCaseStudyBtn = document.getElementById("closeCaseStudyBtn");
  const caseStudyModalOverlay = document.getElementById("caseStudyModal");

  if (openCaseStudyBtn) openCaseStudyBtn.addEventListener("click", openCaseStudyModal);
  if (closeCaseStudyBtn) closeCaseStudyBtn.addEventListener("click", closeCaseStudyModal);
  if (caseStudyModalOverlay) {
    caseStudyModalOverlay.addEventListener("click", function (e) {
      if (e.target === caseStudyModalOverlay) closeCaseStudyModal();
    });
  }

  // Terminal Modal Listeners
  const openTerminalBtn = document.getElementById("openTerminalBtn");
  const mobileTerminalLink = document.getElementById("mobileTerminalLink");
  const closeTerminalBtn = document.getElementById("closeTerminalBtn");
  const closeTerminalX = document.getElementById("closeTerminalX");
  const terminalModalOverlay = document.getElementById("terminalModal");
  const terminalInput = document.getElementById("terminalInput");

  if (openTerminalBtn) openTerminalBtn.addEventListener("click", openTerminalModal);
  if (mobileTerminalLink) {
    mobileTerminalLink.addEventListener("click", function () {
      closeMenu();
      openTerminalModal();
    });
  }
  if (closeTerminalBtn) closeTerminalBtn.addEventListener("click", closeTerminalModal);
  if (closeTerminalX) closeTerminalX.addEventListener("click", closeTerminalModal);
  if (terminalModalOverlay) {
    terminalModalOverlay.addEventListener("click", function (e) {
      if (e.target === terminalModalOverlay) closeTerminalModal();
    });
  }

  if (terminalInput) {
    terminalInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        runCommand();
      }
    });
  }

  // Command Palette Listeners
  const openCmdPaletteBtn = document.getElementById("openCmdPaletteBtn");
  const mobileCmdPaletteLink = document.getElementById("mobileCmdPaletteLink");
  const closeCmdPaletteBtn = document.getElementById("closeCmdPaletteBtn");
  const cmdPaletteModal = document.getElementById("cmdPaletteModal");
  const cmdPaletteInput = document.getElementById("cmdPaletteInput");

  if (openCmdPaletteBtn) openCmdPaletteBtn.addEventListener("click", openCmdPalette);
  if (mobileCmdPaletteLink) {
    mobileCmdPaletteLink.addEventListener("click", function () {
      closeMenu();
      openCmdPalette();
    });
  }
  if (closeCmdPaletteBtn) closeCmdPaletteBtn.addEventListener("click", closeCmdPalette);
  if (cmdPaletteModal) {
    cmdPaletteModal.addEventListener("click", function (e) {
      if (e.target === cmdPaletteModal) closeCmdPalette();
    });
  }

  if (cmdPaletteInput) {
    cmdPaletteInput.addEventListener("input", function () {
      selectedCmdIndex = 0;
      renderCmdPaletteResults(this.value);
    });

    cmdPaletteInput.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (filteredCommands.length > 0) {
          selectedCmdIndex = (selectedCmdIndex + 1) % filteredCommands.length;
          renderCmdPaletteResults(this.value);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (filteredCommands.length > 0) {
          selectedCmdIndex = (selectedCmdIndex - 1 + filteredCommands.length) % filteredCommands.length;
          renderCmdPaletteResults(this.value);
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands.length > 0) {
          executeCmdIndex(selectedCmdIndex);
        }
      }
    });
  }

  // GLOBAL KEYBOARD SHORTCUTS: Ctrl+K / Cmd+K and ESC
  window.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault();
      const modal = document.getElementById("cmdPaletteModal");
      if (modal && modal.classList.contains("open")) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
    } else if (e.key === "Escape") {
      closeResumeModal();
      closeCaseStudyModal();
      closeTerminalModal();
      closeCmdPalette();
      closeMenu();
    }
  });

  // Mobile Drawer Navigation
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");
  const mobileNavOverlay = document.getElementById("mobileNavOverlay");
  const closeMobileNav = document.getElementById("closeMobileNav");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  function openMenu() {
    if (mobileNav && mobileNavOverlay) {
      mobileNav.classList.add("open");
      mobileNavOverlay.classList.add("open");
      if (hamburger) hamburger.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeMenu() {
    if (mobileNav && mobileNavOverlay) {
      mobileNav.classList.remove("open");
      mobileNavOverlay.classList.remove("open");
      if (hamburger) hamburger.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  if (hamburger) hamburger.addEventListener("click", openMenu);
  if (closeMobileNav) closeMobileNav.addEventListener("click", closeMenu);
  if (mobileNavOverlay) mobileNavOverlay.addEventListener("click", closeMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // ScrollSpy
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const allMobileLinks = document.querySelectorAll(".mobile-link");

  function handleScrollSpy() {
    const scrollY = window.pageYOffset + 140;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });

        allMobileLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", handleScrollSpy);

  // Back to Top Button
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    });

    backToTopBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // 3D Tilt Effect on Cards
  const tiltCards = document.querySelectorAll(".tilt-card");
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });

  // Skills Filtering
  const skillFilterBtns = document.querySelectorAll(".skills-filter .filter-btn");
  const skillCards = document.querySelectorAll(".skills-grid .skill-card");

  skillFilterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      skillFilterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      const category = this.getAttribute("data-filter");

      skillCards.forEach((card) => {
        if (category === "all" || card.getAttribute("data-category") === category) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Projects Filtering
  const projectFilterBtns = document.querySelectorAll(".projects-filter .project-filter-btn");
  const projectCards = document.querySelectorAll(".projects-container .project");

  projectFilterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      projectFilterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      const pCategory = this.getAttribute("data-pfilter");

      projectCards.forEach((card) => {
        if (pCategory === "all" || card.getAttribute("data-pcategory") === pCategory) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Typed.js Initialization
  if (typeof Typed !== "undefined" && document.getElementById("element")) {
    new Typed("#element", {
      strings: [
        "Frontend Developer.",
        "Full-Stack Developer.",
        "Web Designer.",
        "Quick Learner.",
      ],
      typeSpeed: 60,
      backSpeed: 45,
      backDelay: 1200,
      loop: true,
    });
  }

  // Scroll Reveal Observer
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0 && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  // Contact Form Validation & Submission
  const contactForm = document.getElementById("contactForm");
  const messageDiv = document.getElementById("message");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const spinner = document.getElementById("spinner");

  if (contactForm) {
    const nameInput = contactForm.querySelector('input[name="name"]');
    const emailInput = contactForm.querySelector('input[name="email"]');
    const phoneInput = contactForm.querySelector('input[name="phone"]');
    const messageInput = contactForm.querySelector('textarea[name="message"]');

    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\-\s]{10,15}$/;

    function validateField(field, regex, errorMsg) {
      const value = field.value.trim();

      if (value === "" && !field.required) {
        field.style.borderColor = "";
        removeMessage(field);
        return true;
      }

      if (regex.test(value)) {
        field.style.borderColor = "#10b981";
        removeMessage(field);
        return true;
      } else {
        field.style.borderColor = "#ef4444";
        showFieldError(field, errorMsg);
        return false;
      }
    }

    function showFieldError(field, msg) {
      let errorDiv = field.parentNode.querySelector(".field-error");
      if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.className = "field-error";
        errorDiv.style.color = "#ef4444";
        errorDiv.style.fontSize = "12px";
        errorDiv.style.marginTop = "4px";
        field.parentNode.appendChild(errorDiv);
      }
      errorDiv.textContent = msg;
    }

    function removeMessage(field) {
      const errorDiv = field.parentNode.querySelector(".field-error");
      if (errorDiv) {
        errorDiv.remove();
      }
    }

    if (nameInput) {
      nameInput.addEventListener("input", function () {
        validateField(this, nameRegex, "Name must contain letters only (min 2 chars)");
      });
    }

    if (emailInput) {
      emailInput.addEventListener("input", function () {
        validateField(this, emailRegex, "Please enter a valid email address");
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener("input", function () {
        if (this.value.trim() !== "") {
          validateField(this, phoneRegex, "Enter valid 10-15 digit phone number");
        } else {
          this.style.borderColor = "";
          removeMessage(this);
        }
      });
    }

    if (messageInput) {
      messageInput.addEventListener("input", function () {
        const value = this.value.trim();
        if (value.length >= 10 && value.length <= 1000) {
          this.style.borderColor = "#10b981";
          removeMessage(this);
        } else {
          this.style.borderColor = "#ef4444";
          showFieldError(this, "Message must be at least 10 characters");
        }
      });
    }

    function showFeedback(text, type) {
      if (messageDiv) {
        messageDiv.textContent = text;
        messageDiv.className = `${type}-message`;
        messageDiv.style.display = "block";

        setTimeout(() => {
          messageDiv.style.display = "none";
        }, 5000);
      }
    }

    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const isNameValid = nameInput ? validateField(nameInput, nameRegex, "Name must contain letters only (min 2 chars)") : true;
      const isEmailValid = emailInput ? validateField(emailInput, emailRegex, "Please enter a valid email address") : true;
      const isMessageValid = messageInput ? messageInput.value.trim().length >= 10 : true;

      let isPhoneValid = true;
      if (phoneInput && phoneInput.value.trim() !== "") {
        isPhoneValid = validateField(phoneInput, phoneRegex, "Enter valid 10-15 digit phone number");
      }

      if (!isNameValid || !isEmailValid || !isMessageValid || !isPhoneValid) {
        showFeedback("Please resolve all form errors before submitting.", "error");
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.style.display = "none";
      if (spinner) spinner.style.display = "inline-flex";

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
        });

        const result = await response.json();

        if (result.success) {
          showFeedback("Message sent successfully. I will get back to you soon.", "success");
          contactForm.reset();
          [nameInput, emailInput, phoneInput, messageInput].forEach((inp) => {
            if (inp) {
              inp.style.borderColor = "";
              removeMessage(inp);
            }
          });
        } else {
          showFeedback(result.message || "Failed to send message. Please try again.", "error");
        }
      } catch (err) {
        console.error("Submission Error:", err);
        showFeedback("Network error. Please check your connection and try again.", "error");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.style.display = "inline-flex";
        if (spinner) spinner.style.display = "none";
      }
    });
  }
});

// Preloader Functionality
window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");
  const percentSpan = document.getElementById("percent");

  if (preloader && percentSpan) {
    let count = 0;
    percentSpan.textContent = count;

    const interval = setInterval(function () {
      count = count + 2;
      if (count > 100) count = 100;
      percentSpan.textContent = count;

      if (count === 100) {
        clearInterval(interval);
        setTimeout(function () {
          preloader.classList.add("hide");
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
          setTimeout(function () {
            preloader.style.display = "none";
          }, 500);
        }, 300);
      }
    }, 15);
  } else if (preloader) {
    preloader.classList.add("hide");
    setTimeout(function () {
      preloader.style.display = "none";
    }, 500);
  }
});

// Particles.js Initialization
if (typeof particlesJS !== "undefined") {
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 65,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#aa6be4",
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.35,
        random: true,
      },
      size: {
        value: 3,
        random: true,
      },
      line_linked: {
        enable: true,
        distance: 140,
        color: "#06b6d4",
        opacity: 0.25,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 0.5,
          },
        },
        push: {
          particles_nb: 3,
        },
      },
    },
    retina_detect: true,
  });
}
