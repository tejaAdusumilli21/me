/* =======================================================
   QUIZ APP – Full JS
   - Loads JSON from SECTION_JSON_MAP (same behavior as before)
   - Shows 10 random questions per section (configurable)
   - Clean toggle between .quiz-buttons and .quiz-block
   - Modal open/close + Start/Mini Test flows
   ======================================================= */

/* -------------------------
   Configuration / Helpers
   ------------------------- */

// Map of section index -> JSON path (same keys/paths as your old file)
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
  17: './assets/json/Design_Patterns_&_Frameworks_17.json',
  18: './assets/json/Advanced_Topics_18.json'
};

const QUESTIONS_PER_SECTION = 10;

/* random shuffle helper */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* pick n unique random items */
function pickRandom(arr, n) {
  if (!Array.isArray(arr)) return [];
  if (n >= arr.length) return [...arr];
  return shuffle([...arr]).slice(0, n);
}

/* create element helper */
function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else e.setAttribute(k, String(v));
  });
  children.forEach(c => {
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else if (c) e.appendChild(c);
  });
  return e;
}

/* -------------------------
   Quiz State
   ------------------------- */
const quizState = {
  participantName: '',
  questions: [], // {section, sectionName, originalId, questionText, options, correctKey, explanation}
  currentIndex: 0,
  score: 0,
  perSectionScore: {}, // section -> correct count
  locked: false
};

/* -------------------------
   UI Mount
   ------------------------- */
const quizRoot = document.getElementById('quiz-root');

/* create quiz UI shell */
function createQuizShell() {
  if (!quizRoot) return;

  quizRoot.innerHTML = `
    <div class="quiz-app">
      <div class="quiz-meta">
        <h3 class="section-title">Quiz</h3>
        <div class="scorecard small">
          <span id="progress">Question 0/0</span> · Score: <span id="score">0</span>
        </div>
      </div>

      <div id="card" class="question-card">
        <div id="qtext" class="q-text"></div>
        <ul id="opts" class="options"></ul>
        <div id="explain" class="explanation hidden"></div>
        <div class="controls">
          <button id="submit" class="btn primary">Submit</button>
          <button id="next" class="btn ghost hidden">Next</button>
          <button id="finish" class="btn ghost hidden">Finish</button>
          <button id="exit" class="btn ghost">Exit</button>
        </div>
      </div>

      <div id="results" class="results hidden"></div>
    </div>
  `;

  document.getElementById('submit')?.addEventListener('click', onSubmit);
  document.getElementById('next')?.addEventListener('click', onNext);
  document.getElementById('finish')?.addEventListener('click', onFinish);
  document.getElementById('exit')?.addEventListener('click', () => setQuizView('buttons'));
}

/* -------------------------
   Loading JSONs and building question list
   ------------------------- */
async function loadAllSections() {
  const keys = Object.keys(SECTION_JSON_MAP);
  const sections = [];

  for (const key of keys) {
    const path = SECTION_JSON_MAP[key];
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) {
        console.warn('Failed to load', path, res.status);
        continue;
      }
      const json = await res.json();

      // Expected shapes your old data used:
      // 1) { section: "Name", levels: { level1: {questions:[...]}, ... } }
      // 2) { section: "Name", questions:[...] }
      let questions = [];
      if (json.levels) {
        Object.values(json.levels).forEach(level => {
          if (Array.isArray(level.questions)) questions = questions.concat(level.questions);
        });
      } else if (Array.isArray(json.questions)) {
        questions = json.questions;
      }

      sections.push({
        sectionIndex: Number(key),
        sectionName: json.section || `Section ${key}`,
        questions
      });
    } catch (err) {
      console.error('Error loading json', path, err);
    }
  }

  return sections;
}

/* build final quiz array (10 per section) */
function buildQuizFromSections(sections) {
  const final = [];
  sections.forEach(s => {
    if (!s.questions || s.questions.length === 0) return;

    const picked = pickRandom(s.questions, QUESTIONS_PER_SECTION);
    picked.forEach(q => {
      // q.options is assumed to be an object {A:'',B:'',C:'',D:''}
      const entries = Object.entries(q.options || {});
      const randomized = shuffle(entries.map(([key, text]) => ({ key, text }))).slice(0, 4);

      final.push({
        section: s.sectionIndex,
        sectionName: s.sectionName,
        originalId: q.id,
        questionText: q.question,
        options: randomized.map((o, i) => ({
          label: ['A', 'B', 'C', 'D'][i],
          origKey: o.key,
          text: o.text
        })),
        correctKey: q.answer, // original key like "A"
        explanation: q.explanation || ''
      });
    });
  });

  return final;
}

/* -------------------------
   Render & Flow
   ------------------------- */
function renderQuestion() {
  const q = quizState.questions[quizState.currentIndex];
  if (!q) return;

  document.querySelector('.section-title').textContent = q.sectionName || 'Quiz';
  document.getElementById('progress').textContent = `Question ${quizState.currentIndex + 1}/${quizState.questions.length}`;
  document.getElementById('score').textContent = String(quizState.score);

  // text
  const qtext = document.getElementById('qtext');
  qtext.innerHTML = `
    <div class="question-text">${q.questionText}</div>
  `;

  // options
  const opts = document.getElementById('opts');
  opts.innerHTML = '';
  q.options.forEach((opt, i) => {
    const li = el('li', { class: 'option', 'data-orig-key': opt.origKey }, [
      el('div', { class: 'option-label' }, [opt.label]),
      el('div', { class: 'option-text', html: opt.text })
    ]);
    li.addEventListener('click', () => selectOption(i));
    opts.appendChild(li);
  });

  quizState.locked = false;
  show('#submit', true);
  show('#next', false);
  show('#finish', false);
  show('#explain', false);
}

function selectOption(i) {
  if (quizState.locked) return;
  document.querySelectorAll('.option').forEach(el => el.classList.remove('selected'));
  const chosen = document.querySelectorAll('.option')[i];
  chosen?.classList.add('selected');
}

function onSubmit() {
  if (quizState.locked) return;

  const sel = document.querySelector('.option.selected');
  if (!sel) {
    pulseCard();
    return;
  }

  quizState.locked = true;
  const chosenKey = sel.getAttribute('data-orig-key');
  const q = quizState.questions[quizState.currentIndex];

  document.querySelectorAll('.option').forEach(o => o.classList.add('disabled'));

  if (chosenKey === q.correctKey) {
    sel.classList.add('correct');
    quizState.score += 1;
    quizState.perSectionScore[q.section] = (quizState.perSectionScore[q.section] || 0) + 1;
    showExplanation(`Correct! ${q.explanation || ''}`);
  } else {
    sel.classList.add('wrong');
    // mark the correct one
    document.querySelectorAll('.option').forEach(o => {
      if (o.getAttribute('data-orig-key') === q.correctKey) o.classList.add('correct');
    });
    showExplanation(`Incorrect. ${q.explanation || ''}`);
  }

  document.getElementById('score').textContent = String(quizState.score);

  const last = quizState.currentIndex === quizState.questions.length - 1;
  show('#submit', false);
  show('#next', !last);
  show('#finish', last);
}

function onNext() {
  if (quizState.currentIndex < quizState.questions.length - 1) {
    quizState.currentIndex += 1;
    renderQuestion();
  }
}

function onFinish() {
  const res = document.getElementById('results');
  const total = quizState.questions.length;
  const pct = total ? ((quizState.score / total) * 100).toFixed(1) : '0.0';

  res.innerHTML = `
    <strong>Done!</strong><br/>
    You scored <b>${quizState.score}</b> out of <b>${total}</b> (${pct}%).
  `;
  show('#results', true);
  res.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* -------------------------
   Utilities
   ------------------------- */
function show(selector, on) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.classList.toggle('hidden', !on);
}

function showExplanation(text) {
  const ex = document.getElementById('explain');
  ex.textContent = text;
  show('#explain', true);
}

function pulseCard() {
  const card = document.getElementById('card');
  card.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.55)';
  setTimeout(() => { card.style.boxShadow = ''; }, 300);
}

/* =======================================================
   View toggling for .quiz-buttons / .quiz-block
   ======================================================= */
const view = {
  buttons: document.querySelector('.quiz-buttons'),
  block:   document.querySelector('.quiz-block')
};

/** Show exactly one: 'buttons' or 'block' (default shows buttons). */
function setQuizView(which = 'buttons') {
  const showButtons = which === 'buttons';
  view.buttons?.classList.toggle('is-hidden', !showButtons);
  view.block?.classList.toggle('is-hidden', showButtons);
}

/** Flip view: if buttons visible -> show block, else show buttons. */
function toggleQuizView() {
  const buttonsVisible = view.buttons && !view.buttons.classList.contains('is-hidden');
  setQuizView(buttonsVisible ? 'block' : 'buttons');
}

window.toggleQuizSections = toggleQuizView; // for your inline Exit if needed
window.setQuizView = setQuizView;

/* =======================================================
   Modal / pretest flow
   ======================================================= */
const modal     = document.getElementById('quiz-modal');
const accept    = document.getElementById('accept-terms');
const startBtn  = document.getElementById('start-test-btn');
const cancelBtn = document.getElementById('cancel-test-btn');

function openModal() {
  if (!modal) return;
  modal.style.display = 'flex'; // flex -> centered per CSS
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal() {
  if (!modal) return;
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
}

/* Build + load quiz */
async function bootstrapQuiz() {
  createQuizShell();
  try {
    const sections = await loadAllSections();
    if (!sections.length) {
      quizRoot.innerHTML = '<div style="padding:20px">No sections loaded. Check JSON paths and CORS.</div>';
      return;
    }
    quizState.questions = buildQuizFromSections(sections);
    quizState.currentIndex = 0;
    quizState.score = 0;
    quizState.perSectionScore = {};
    renderQuestion();
  } catch (err) {
    console.error('Quiz load error:', err);
    quizRoot.innerHTML = '<div style="padding:20px">Error preparing quiz. Check console.</div>';
  }
}

/* =======================================================
   Startup wiring
   ======================================================= */
document.addEventListener('DOMContentLoaded', () => {
  // default: show buttons, hide quiz area (requires .is-hidden in CSS)
  setQuizView('buttons');

  // Take Test opens modal
  document.querySelector('.sparkle-button')?.addEventListener('click', openModal);

  // Mini Test: skip modal, show quiz
  document.querySelector('.learn-more')?.addEventListener('click', () => {
    closeModal();
    setQuizView('block');
    bootstrapQuiz();
    quizRoot?.scrollIntoView({ behavior: 'smooth' });
  });

  // Modal closers
  modal?.querySelectorAll('[data-action="close"], .quiz-modal-backdrop, .quiz-modal-close')
    ?.forEach(el => el.addEventListener('click', closeModal));
  cancelBtn?.addEventListener('click', closeModal);

  // Enable Start when terms checked (and optionally name filled if you enforce it)
  accept?.addEventListener('change', e => { startBtn.disabled = !e.target.checked; });

  // Start Test -> close modal, show quiz, load JSON
  startBtn?.addEventListener('click', () => {
    if (startBtn.disabled) return;
    closeModal();
    setQuizView('block');
    bootstrapQuiz();
    quizRoot?.scrollIntoView({ behavior: 'smooth' });
  });

  // expose for debugging if needed
  window._quizState = quizState;
});