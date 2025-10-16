"use strict";

/* ----------------------------------------------------
   CONFIG (override with window.SECTION_JSON_MAP if you want)
---------------------------------------------------- */
const SECTION_JSON_MAP = window.SECTION_JSON_MAP || {
  1: './assets/json/Apex_Fundamentals_&_OOP_Concepts_1.json',
  2: './assets/json/Salesforce_Triggers_2.json',
  3: './assets/json/Asynchronous_Apex_3.json',
  4: './assets/json/Lightning_Web_Components_4.json',
  5: './assets/json/Aura_Components_&_Migration_to_LWC_5.json',
  6: './assets/json/Visualforce_6.json',
  7: './assets/json/SOQL_&_SOSL_7.json',
  8: './assets/json/Integration_8.json',
  9: './assets/json/OmniStudio_9.json',
  10: './assets/json/Sales_Cloud_10.json',
  11: './assets/json/Service_Cloud_11.json',
  12: './assets/json/Experience_Cloud_12.json',
  13: './assets/json/Security_&_Sharing_13.json',
  14: './assets/json/Deployment_&_DevOps_14.json',
  15: './assets/json/Governor_Limits_&_Performance_Tuning_15.json',
  16: './assets/json/Testing_16.json',
  17: './assets/json/Design_PatternS_&_Frameworks_17.json',
  18: './assets/json/Advanced_Topics_18.json'
};

const QUESTIONS_PER_SECTION = 10;

/* ----------------------------------------------------
   SMALL HELPERS
---------------------------------------------------- */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickRandom(arr, n) {
  if (!Array.isArray(arr)) return [];
  if (n >= arr.length) return [...arr];
  return shuffle([...arr]).slice(0, n);
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else node.setAttribute(k, String(v));
  }
  for (const child of [].concat(children)) {
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

const quizRoot = document.querySelector("#quiz-root") || (() => {
  const d = document.createElement("div");
  d.id = "quiz-root";
  document.body.appendChild(d);
  return d;
})();

/* ----------------------------------------------------
   VIEW TOGGLING — SINGLE SOURCE OF TRUTH
   - "buttons": show .quiz-buttons, hide .quiz-block
   - "block"  : show .quiz-block,  hide .quiz-buttons
   - "toggle" : switch to the other one
---------------------------------------------------- */
function setQuizView(mode) {
  const buttons = document.querySelector(".quiz-buttons");
  const block   = document.querySelector(".quiz-block");
  if (!buttons || !block) return;

  const isButtonsVisible = getComputedStyle(buttons).display !== "none";
  const isBlockVisible   = getComputedStyle(block).display   !== "none";

  if (mode === "buttons") {
    buttons.style.display = "block";
    block.style.display   = "none";
    return;
  }
  if (mode === "block") {
    buttons.style.display = "none";
    block.style.display   = "block";
    return;
  }
  // mode === "toggle" or undefined -> flip
  if (isButtonsVisible || (!isButtonsVisible && !isBlockVisible)) {
    buttons.style.display = "none";
    block.style.display   = "block";
  } else {
    block.style.display   = "none";
    buttons.style.display = "block";
  }
}

// keep your existing onclicks working
window.toggleQuizSections = function () {
  setQuizView("toggle");
};

/* ----------------------------------------------------
   MODAL (centered, no style/class fights)
---------------------------------------------------- */
function setupPretestModal() {
  const takeTestBtn  = document.querySelector(".sparkle-button");
  const modal        = document.getElementById("quiz-modal");
  const startBtn     = document.getElementById("start-test-btn");
  const cancelBtn    = document.getElementById("cancel-test-btn");
  const nameInput    = document.getElementById("participant-name");
  const acceptCheck  = document.getElementById("accept-terms");
  const closeBtns    = modal ? modal.querySelectorAll('[data-action="close"], .quiz-modal-close') : [];

  function openModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "false");
    // Force flex (centers per your CSS: display:flex; align-items:center; justify-content:center)
    modal.style.display = "flex";
  }
  function closeModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    modal.style.display = "none";
  }

  function validName(s) {
    return !!(s && s.trim().length >= 2);
  }
  function updateStart() {
    const ok = validName(nameInput?.value) && !!acceptCheck?.checked;
    if (startBtn) startBtn.disabled = !ok;
  }

  takeTestBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    // make sure we’re on buttons view until the user actually starts
    setQuizView("buttons");
    openModal();
  });

  nameInput?.addEventListener("input", updateStart);
  acceptCheck?.addEventListener("change", updateStart);
  updateStart();

  closeBtns.forEach(btn => btn.addEventListener("click", closeModal));
  cancelBtn?.addEventListener("click", closeModal);

  // Start Test
  startBtn?.addEventListener("click", async () => {
    if (startBtn.disabled) return;
    closeModal();
    setQuizView("block");
    await startQuiz(); // loads JSONs & renders first question
    quizRoot?.scrollIntoView({ behavior: "smooth" });
  });
}

/* ----------------------------------------------------
   BUILD QUIZ SHELL (static UI once)
---------------------------------------------------- */
function mountQuizUI() {
  quizRoot.innerHTML = "";

  const meta = el("div", { class: "quiz-meta" }, [
    el("div", { class: "progress", id: "progress-text" }, "Question 0 / 0"),
    el("div", { class: "scorecard" }, [
      el("span", { class: "small" }, "Score: "),
      el("strong", { id: "score-text" }, "0")
    ])
  ]);

  const qCard = el("div", { class: "question-card" }, [
    el("div", { class: "q-text" }, [
      el("div", { class: "section-title" }, "Section"),
      el("div", { id: "question-text", class: "question-text" }, "—")
    ]),
    el("ul", { id: "options-list", class: "options", role: "listbox" }),
    el("div", { id: "feedback", class: "feedback" }, "")
  ]);

  const controls = el("div", { class: "controls" }, [
    el("button", { id: "submit-answer", class: "btn primary", type: "button" }, "Submit"),
    el("button", { id: "next-question", class: "btn ghost", type: "button", style: "display:none" }, "Next"),
    el("button", { id: "quit-quiz", class: "btn ghost", type: "button" }, "Quit")
  ]);

  quizRoot.append(meta, qCard, controls);

  document.getElementById("submit-answer").addEventListener("click", onSubmitAnswer);
  document.getElementById("next-question").addEventListener("click", onNextQuestion);
  document.getElementById("quit-quiz").addEventListener("click", showFinalResult);
}

/* ----------------------------------------------------
   STATE
---------------------------------------------------- */
const quizState = {
  questions: [],
  currentIndex: 0,
  score: 0,
  perSectionScore: {} // {sectionIndex: {correct, total}}
};

/* ----------------------------------------------------
   LOADING JSON -> BUILD FLAT QUIZ LIST
---------------------------------------------------- */
async function fetchJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function loadAllSections(map) {
  const entries = Object.entries(map);
  const sections = [];
  const failures = [];

  for (const [key, path] of entries) {
    try {
      const json = await fetchJSON(path);
      let questions = [];
      if (Array.isArray(json?.levels)) {
        json.levels.forEach(lvl => Array.isArray(lvl?.questions) && (questions = questions.concat(lvl.questions)));
      } else if (Array.isArray(json?.questions)) {
        questions = json.questions;
      }
      sections.push({
        sectionIndex: Number(key),
        sectionName: json?.section || `Section ${key}`,
        questions
      });
    } catch (e) {
      failures.push({ key, path, error: e.message });
      // continue with others
    }
  }

  if (failures.length) {
    console.warn("[Quiz] Some sections failed to load:", failures);
  }
  return sections;
}

function buildQuizFromSections(sections) {
  const final = [];
  sections.forEach(s => {
    if (!s.questions?.length) return;
    const picked = pickRandom(s.questions, QUESTIONS_PER_SECTION);
    const labeled = picked.map(q => {
      // Stable map to A/B/C/D while remembering original key
      const opts = Object.entries(q.options || {});
      const randomized = shuffle(opts.map(([key, text]) => ({ key, text }))).slice(0, 4);
      const withLabels = randomized.map((o, i) => ({
        label: ["A", "B", "C", "D"][i],
        origKey: o.key,
        text: o.text
      }));
      return {
        section: s.sectionIndex,
        sectionName: s.sectionName,
        question: q.question || q.Question || "",
        explanation: q.explanation || q.Explanation || "",
        correctKey: (q.answer || q.Answer || "").toString(),
        displayedOptions: withLabels
      };
    });
    final.push(...labeled);
  });
  return shuffle(final);
}

/* ----------------------------------------------------
   RENDERING
---------------------------------------------------- */
function renderQuestion() {
  const i = quizState.currentIndex;
  const total = quizState.questions.length;
  const q = quizState.questions[i];
  if (!q) return;

  const progress = document.getElementById("progress-text");
  const scoreTxt = document.getElementById("score-text");
  progress.textContent = `Question ${i + 1} / ${total}`;
  scoreTxt.textContent = `${quizState.score}`;

  const qText = document.getElementById("question-text");
  qText.innerHTML = `
    <div class="section-title" style="font-size:1.1rem;margin-bottom:6px;">${q.sectionName}</div>
    <div style="line-height:1.6;">${q.question}</div>
  `;

  const optionsList = document.getElementById("options-list");
  optionsList.innerHTML = "";
  q.displayedOptions.forEach(opt => {
    const li = el("li", { class: "option", tabindex: "0", "data-orig-key": opt.origKey }, [
      el("span", { class: "option-label", style: "font-weight:700" }, `${opt.label}.`),
      el("span", {}, opt.text)
    ]);
    li.addEventListener("click", () => {
      Array.from(optionsList.children).forEach(c => c.classList.remove("selected"));
      li.classList.add("selected");
      const fb = document.getElementById("feedback");
      fb.textContent = "";
      fb.removeAttribute("style");
    });
    optionsList.appendChild(li);
  });

  document.getElementById("submit-answer").style.display = "inline-block";
  document.getElementById("next-question").style.display = "none";
  document.getElementById("feedback").textContent = "";
  document.getElementById("feedback").removeAttribute("style");
}

function getSelectedOption() {
  const sel = document.querySelector("#options-list .option.selected");
  return sel ? { origKey: sel.getAttribute("data-orig-key"), element: sel } : null;
}

function onSubmitAnswer() {
  const sel = getSelectedOption();
  const feedback = document.getElementById("feedback");
  if (!sel) {
    feedback.textContent = "Please select an option.";
    feedback.style.color = "#c00";
    return;
  }

  const current = quizState.questions[quizState.currentIndex];
  const submitBtn = document.getElementById("submit-answer");
  submitBtn.style.display = "none";

  // disable clicks
  Array.from(document.getElementById("options-list").children).forEach(c => c.classList.add("disabled"));

  const isCorrect = sel.origKey.toString() === current.correctKey.toString();
  const optionsList = document.getElementById("options-list");
  const markCorrectWrong = () => {
    for (const li of optionsList.children) {
      const k = li.getAttribute("data-orig-key");
      if (k === current.correctKey.toString()) li.classList.add("correct");
      if (li.classList.contains("selected") && k !== current.correctKey.toString()) li.classList.add("wrong");
    }
  };

  if (isCorrect) {
    quizState.score++;
    quizState.perSectionScore[current.section] = quizState.perSectionScore[current.section] || { correct: 0, total: 0 };
    quizState.perSectionScore[current.section].correct++;
    feedback.textContent = current.explanation ? `✅ Correct. ${current.explanation}` : "✅ Correct!";
    feedback.style.color = "#0a7";
  } else {
    feedback.textContent = current.explanation ? `❌ Incorrect. ${current.explanation}` : "❌ Incorrect.";
    feedback.style.color = "#c00";
  }
  quizState.perSectionScore[current.section] = quizState.perSectionScore[current.section] || { correct: 0, total: 0 };
  quizState.perSectionScore[current.section].total++;

  markCorrectWrong();
  document.getElementById("next-question").style.display = "inline-block";
}

function onNextQuestion() {
  quizState.currentIndex++;
  if (quizState.currentIndex >= quizState.questions.length) {
    showFinalResult();
  } else {
    renderQuestion();
  }
}

function showFinalResult() {
  quizRoot.innerHTML = "";
  const total = quizState.questions.length || 1;
  const percent = Math.round((quizState.score / total) * 100);

  const card = el("div", { class: "results" }, [
    el("div", { class: "score-panel", html: `
      <h3 style="margin:0 0 10px;">Final Score</h3>
      <div style="font-size:1.1rem;margin-bottom:6px;"><strong>${quizState.score}</strong> / ${total} (${percent}%)</div>
      <div class="small">Great job! Use "Mini Test" / "Take Test" to try again.</div>
    `}),
    el("div", { class: "controls", style: "justify-content:center;margin-top:12px;" }, [
      el("button", { class: "btn primary", type: "button" }, "Try Again")
    ])
  ]);

  card.querySelector("button").addEventListener("click", () => {
    // back to landing buttons
    setQuizView("buttons");
    // reset state
    quizState.questions = [];
    quizState.currentIndex = 0;
    quizState.score = 0;
    quizState.perSectionScore = {};
    // clear UI (the next start will rebuild)
    quizRoot.innerHTML = "";
  });

  quizRoot.appendChild(card);
}

/* ----------------------------------------------------
   BOOT THE QUIZ
---------------------------------------------------- */
async function startQuiz() {
  mountQuizUI();

  const sections = await loadAllSections(SECTION_JSON_MAP);
  if (!sections.length) {
    quizRoot.innerHTML = `
      <div class="results" style="padding:16px;">
        <div style="font-weight:600;margin-bottom:6px;">No questions available.</div>
        <div class="small">Couldn’t load any JSON files. Check <code>assets/json</code> paths & filenames.</div>
      </div>`;
    return;
  }

  quizState.questions = buildQuizFromSections(sections);
  if (!quizState.questions.length) {
    quizRoot.innerHTML = `
      <div class="results" style="padding:16px;">
        <div style="font-weight:600;margin-bottom:6px;">No questions after building the quiz.</div>
        <div class="small">The JSONs loaded but contained no usable questions.</div>
      </div>`;
    return;
  }

  quizState.currentIndex = 0;
  quizState.score = 0;
  quizState.perSectionScore = {};
  renderQuestion();
}

/* ----------------------------------------------------
   INIT
---------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  setupPretestModal();

  // ensure initial layout: show buttons, hide block
  const buttons = document.querySelector(".quiz-buttons");
  const block   = document.querySelector(".quiz-block");
  if (buttons) buttons.style.display = "block";
  if (block)   block.style.display   = "none";

  // expose for debugging
  window._quizState = quizState;
  window.setQuizView = setQuizView;
});
