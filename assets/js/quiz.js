/* =======================================================
   QUIZ APP – Robust version
   ======================================================= */

/* -------------------------
   CONFIG  (adjust paths to EXACT GitHub Pages casing)
   ------------------------- */

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

/* -------------------------
   UTILS
   ------------------------- */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

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
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else e.setAttribute(k, String(v));
  }
  for (const c of children) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  return e;
}
function show(selector, on) {
  const node = $(selector);
  if (!node) return;
  node.classList.toggle('hidden', !on);
}

/* -------------------------
   SAFE VIEW TOGGLING
   ------------------------- */

function getViews() {
  return {
    buttons: $('.quiz-buttons'),
    block:   $('.quiz-block'),
  };
}

/** Show exactly one: 'buttons' | 'block'. Safe if nodes aren’t there yet. */
function setQuizView(which = 'buttons') {
  const { buttons, block } = getViews();
  if (!buttons || !block) {
    console.warn('[quiz] containers not found (.quiz-buttons / .quiz-block). Toggle skipped.');
    return;
  }
  const showButtons = which === 'buttons';
  buttons.classList.toggle('is-hidden', !showButtons);
  block.classList.toggle('is-hidden', showButtons);
}

/** Flip view safely */
function toggleQuizView() {
  const { buttons } = getViews();
  const buttonsVisible = !!buttons && !buttons.classList.contains('is-hidden');
  setQuizView(buttonsVisible ? 'block' : 'buttons');
}

// expose for inline onclick="toggleQuizSections()"
window.setQuizView = setQuizView;
window.toggleQuizSections = toggleQuizView;

/* -------------------------
   MODAL (fix aria warning by blurring before hide)
   ------------------------- */

const modal     = $('#quiz-modal');
const accept    = $('#accept-terms');
const startBtn  = $('#start-test-btn');
const cancelBtn = $('#cancel-test-btn');

function openModal() {
  if (!modal) return;
  modal.style.display = 'flex';      // center via CSS
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal() {
  if (!modal) return;
  try { document.activeElement?.blur(); } catch (_) {}
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  $('#quiz-root')?.focus?.();
}

/* -------------------------
   STATE & SHELL
   ------------------------- */

const quizRoot = $('#quiz-root');

const quizState = {
  participantName: '',
  questions: [],
  currentIndex: 0,
  score: 0,
  perSectionScore: {},
  locked: false
};

function createQuizShell() {
  if (!quizRoot) return;
  quizRoot.innerHTML = `
    <div class="quiz-app" tabindex="-1">
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
  $('#submit')?.addEventListener('click', onSubmit);
  $('#next')?.addEventListener('click', onNext);
  $('#finish')?.addEventListener('click', onFinish);
  $('#exit')?.addEventListener('click', () => setQuizView('buttons'));
}

/* -------------------------
   JSON LOADING (LOUD + URL-ENCODED)
   ------------------------- */

async function loadAllSections() {
  const keys = Object.keys(SECTION_JSON_MAP);
  const sections = [];

  for (const key of keys) {
    // encode URI to survive special chars like &
    const url = encodeURI(SECTION_JSON_MAP[key]);
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        console.error(`[quiz] Failed to load ${url}: ${res.status} ${res.statusText}`);
        continue;
      }
      const json = await res.json();

      // Accept {section, levels:{...}} or {section, questions:[...]}
      let questions = [];
      if (json?.levels) {
        Object.values(json.levels).forEach(level => {
          if (Array.isArray(level?.questions)) questions.push(...level.questions);
        });
      } else if (Array.isArray(json?.questions)) {
        questions = json.questions;
      }

      if (!questions.length) {
        console.warn(`[quiz] No questions in ${url} (section ${key}). Check JSON shape.`);
      }

      sections.push({
        sectionIndex: Number(key),
        sectionName: json?.section || `Section ${key}`,
        questions
      });
    } catch (err) {
      console.error(`[quiz] Error fetching ${url}:`, err);
    }
  }

  if (!sections.length && quizRoot) {
    quizRoot.innerHTML = `
      <div style="padding:20px">
        Couldn't load any question files.<br/>
        Verify JSON paths in <code>SECTION_JSON_MAP</code> (case-sensitive on GitHub Pages).
      </div>`;
  }
  return sections;
}

function buildQuizFromSections(secs) {
  const final = [];
  secs.forEach(s => {
    if (!s.questions?.length) return;
    const picked = pickRandom(s.questions, QUESTIONS_PER_SECTION);
    picked.forEach(q => {
      const entries = Object.entries(q.options || {});
      const randomized = shuffle(entries.map(([key, text]) => ({ key, text }))).slice(0, 4);
      final.push({
        section: s.sectionIndex,
        sectionName: s.sectionName,
        originalId: q.id,
        questionText: q.question,
        options: randomized.map((o, i) => ({
          label: ['A','B','C','D'][i],
          origKey: o.key,
          text: o.text
        })),
        correctKey: q.answer,
        explanation: q.explanation || ''
      });
    });
  });
  return final;
}

/* -------------------------
   RENDER FLOW
   ------------------------- */

function renderQuestion() {
  const q = quizState.questions[quizState.currentIndex];
  if (!q) return;

  $('.section-title').textContent = q.sectionName || 'Quiz';
  $('#progress').textContent = `Question ${quizState.currentIndex + 1}/${quizState.questions.length}`;
  $('#score').textContent = String(quizState.score);

  $('#qtext').innerHTML = `<div class="question-text">${q.questionText}</div>`;

  const opts = $('#opts');
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
  $$('.option').forEach(el => el.classList.remove('selected'));
  const chosen = $$('.option')[i];
  chosen?.classList.add('selected');
}

function onSubmit() {
  if (quizState.locked) return;

  const sel = $('.option.selected');
  if (!sel) { pulseCard(); return; }

  quizState.locked = true;
  const chosenKey = sel.getAttribute('data-orig-key');
  const q = quizState.questions[quizState.currentIndex];

  $$('.option').forEach(o => o.classList.add('disabled'));

  if (chosenKey === q.correctKey) {
    sel.classList.add('correct');
    quizState.score += 1;
    quizState.perSectionScore[q.section] = (quizState.perSectionScore[q.section] || 0) + 1;
    showExplanation(`Correct! ${q.explanation || ''}`);
  } else {
    sel.classList.add('wrong');
    $$('.option').forEach(o => {
      if (o.getAttribute('data-orig-key') === q.correctKey) o.classList.add('correct');
    });
    showExplanation(`Incorrect. ${q.explanation || ''}`);
  }

  $('#score').textContent = String(quizState.score);
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
  const res = $('#results');
  const total = quizState.questions.length;
  const pct = total ? ((quizState.score / total) * 100).toFixed(1) : '0.0';
  res.innerHTML = `
    <strong>Done!</strong><br/>
    You scored <b>${quizState.score}</b> out of <b>${total}</b> (${pct}%).
  `;
  show('#results', true);
  res.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function showExplanation(text) {
  const ex = $('#explain');
  ex.textContent = text;
  show('#explain', true);
}
function pulseCard() {
  const card = $('#card');
  card.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.55)';
  setTimeout(() => { card.style.boxShadow = ''; }, 300);
}

/* -------------------------
   BOOTSTRAP SEQUENCE
   ------------------------- */

async function bootstrapQuiz() {
  // ensure containers exist before we proceed
  const { buttons, block } = getViews();
  if (!buttons || !block || !quizRoot) {
    console.warn('[quiz] Required containers missing; quiz bootstrap skipped.');
    return;
  }

  createQuizShell();
  try {
    const secs = await loadAllSections();
    if (!secs.length) return;
    quizState.questions = buildQuizFromSections(secs);
    quizState.currentIndex = 0;
    quizState.score = 0;
    quizState.perSectionScore = {};
    renderQuestion();
  } catch (err) {
    console.error('Quiz load error:', err);
    quizRoot.innerHTML = '<div style="padding:20px">Error preparing quiz. Check console.</div>';
  }
}

/* -------------------------
   WIRING
   ------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // default view: show buttons
  setQuizView('buttons');
  // retry once for late DOM
  setTimeout(() => setQuizView('buttons'), 0);

  // Take Test -> open modal
  $('.sparkle-button')?.addEventListener('click', openModal);

  // Mini Test -> skip modal
  $('.learn-more')?.addEventListener('click', () => {
    closeModal();
    setQuizView('block');
    bootstrapQuiz();
    $('#quiz-root')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Modal closers
  modal?.querySelectorAll('[data-action="close"], .quiz-modal-backdrop, .quiz-modal-close')
    ?.forEach(el => el.addEventListener('click', closeModal));
  cancelBtn?.addEventListener('click', closeModal);

  // Enable Start on terms check
  accept?.addEventListener('change', e => { startBtn.disabled = !e.target.checked; });

  // Start Test -> close modal, show quiz, load JSONs
  startBtn?.addEventListener('click', () => {
    if (startBtn.disabled) return;
    closeModal();
    setQuizView('block');
    bootstrapQuiz();
    $('#quiz-root')?.scrollIntoView({ behavior: 'smooth' });
  });

  // expose for quick debugging
  window._quizState = quizState;
});
