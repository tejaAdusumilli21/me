/* -------------------------
   Configuration / Helpers
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
  if (n >= arr.length) return [...arr];
  return shuffle([...arr]).slice(0, n);
}

/* create element helper */
function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else if (k === 'html') e.innerHTML = v;
    else e.setAttribute(k, String(v));
  });
  children.forEach(c => {
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else if (c) e.appendChild(c);
  });
  return e;
}

/* Utility functions for timestamp and naming */
function pad2(num) {
  return String(num).padStart(2, '0');
}

function formatAttemptTimestamp(date = new Date()) {
  return (
    date.getFullYear() +
    '-' +
    pad2(date.getMonth() + 1) +
    '-' +
    pad2(date.getDate()) +
    ' ' +
    pad2(date.getHours()) +
    ':' +
    pad2(date.getMinutes())
  );
}

function buildQuizAttemptName(testLabel, participantName, startedAt) {
  const baseName = participantName && participantName.trim() ? participantName.trim() : 'Anonymous';
  const timestamp = formatAttemptTimestamp(startedAt instanceof Date ? startedAt : new Date());
  return `${baseName} - ${timestamp} - ${testLabel}`;
}

function getSectionKey(question) {
  if (question.section != null) return String(question.section);
  if (question.sectionName) return question.sectionName;
  return 'unknown';
}

function getSectionTitle(question) {
  if (question.sectionName) return question.sectionName;
  if (question.section != null) return `Section ${question.section}`;
  return 'Unknown Section';
}

/* -------------------------
   Quiz State
   ------------------------- */
const quizState = {
  participantName: '',
  questions: [],
  currentIndex: 0,
  score: 0,
  perSectionScore: {},
  status: 'Not Started',
  startedAt: null,
  hasPostedResult: false,
};

/* -------------------------
   UI Mount
   ------------------------- */
const quizRoot = document.querySelector('#quiz-root') || (function(){
  const d = document.createElement('div');
  d.id = 'quiz-root';
  document.body.appendChild(d);
  return d;
})();

/* create quiz UI shell */
function createQuizShell() {
  quizRoot.innerHTML = '';
  const shell = el('div', { class: 'quiz-container' });

  const header = el('div', { class: 'quiz-header' }, [
    el('div', { class: 'progress', html: `<span id="progress-text">Question 0 / 0</span>` }),
    el('div', { class: 'score', html: `<strong>Score: <span id="score-text">0</span></strong>` })
  ]);
  shell.appendChild(header);

  const qbox = el('div', { class: 'quiz-body' });
  qbox.appendChild(el('div', { class: 'quiz-question', id: 'question-text' }, []));
  qbox.appendChild(el('ul', { class: 'options', id: 'options-list' }, []));
  qbox.appendChild(el('div', { class: 'feedback', id: 'feedback' }));

  const controls = el('div', { class: 'controls' });
  const submitBtn = el('button', { class: 'btn', id: 'submit-answer' }, ['Submit Answer']);
  const nextBtn = el('button', { class: 'btn hidden', id: 'next-question' }, ['Next']);
  const quitBtn = el('button', { class: 'btn', id: 'quit-quiz' }, ['Quit']);
  controls.append(submitBtn, nextBtn, quitBtn);

  shell.appendChild(qbox);
  shell.appendChild(controls);

  quizRoot.appendChild(shell);

  document.getElementById('submit-answer').addEventListener('click', onSubmitAnswer);
  document.getElementById('next-question').addEventListener('click', onNextQuestion);
  document.getElementById('quit-quiz').addEventListener('click', () => {
    quizState.status = 'Quit';
    showFinalResult();
  });
}

/* -------------------------
   Loading JSONs and building question list
   ------------------------- */
function extractQuestionsFromJson(json) {
  if (!json || typeof json !== 'object') return [];
  if (Array.isArray(json.questions)) return json.questions;
  if (Array.isArray(json.Questions)) return json.Questions;
  if (Array.isArray(json.items)) return json.items;
  if (json.levels && typeof json.levels === 'object') {
    const blocks = Object.values(json.levels);
    return blocks.flatMap(b => {
      if (Array.isArray(b)) return b;
      if (Array.isArray(b?.questions)) return b.questions;
      return [];
    });
  }
  if (Array.isArray(json.data)) return json.data;
  return [];
}

async function loadAllSections() {
  const keys = Object.keys(SECTION_JSON_MAP);
  const sections = [];
  for (const key of keys) {
    const rawPath = SECTION_JSON_MAP[key];
    const path = rawPath.includes('&') ? rawPath.replace(/&/g, '%26') : rawPath;
    try {
      console.log('[Quiz] Fetching section', key, 'from', path);
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) {
        console.warn(`Unable to load section ${key} from ${path}: ${res.status}`);
        continue;
      }
      const json = await res.json();
      const questions = extractQuestionsFromJson(json);
      console.log(`[Quiz] Section ${key}: ${questions.length} questions`);
      sections.push({
        section: Number(key),
        sectionName: json.section || json.title || json.name || `Section ${key}`,
        questions
      });
    } catch (err) {
      console.error(`Error loading section ${key} from ${path}:`, err);
    }
  }
  console.log('[Quiz] Loaded sections:', sections.map(s => ({ section: s.section, count: s.questions.length })));
  return sections;
}

/* Normalize various option shapes to entries [key,text] */
function getOptionEntries(q) {
  let opts = q.options ?? q.Options ?? q.choices ?? q.Choices;
  if (!opts) return [];
  if (Array.isArray(opts)) {
    const labels = ['A','B','C','D','E','F','G','H'];
    return opts.map((text, idx) => [labels[idx] || String(idx), text]);
  }
  if (typeof opts === 'object') return Object.entries(opts);
  return [];
}

/* build final quiz array (10 per section) */
function buildQuizFromSections(sections) {
  const final = [];
  sections.forEach(s => {
    if (!s.questions || s.questions.length === 0) return;
    const picked = pickRandom(s.questions, QUESTIONS_PER_SECTION);
    picked.forEach(q => {
      const optionEntries = getOptionEntries(q);
      if (optionEntries.length < 2) {
        console.warn('[Quiz] Skipping question with insufficient options', q);
        return;
      }
      const randomizedOptions = shuffle(optionEntries.map(([key, text]) => ({ origKey: key, text })));
      const optionsWithLabels = randomizedOptions.slice(0, 4).map((opt, idx) => ({
        label: String.fromCharCode(65 + idx),
        origKey: opt.origKey,
        text: opt.text
      }));
      final.push({
        section: s.section,
        sectionName: s.sectionName,
        originalId: q.id || q.ID || q.qid || '?',
        questionText: q.question || q.Question || '',
        options: optionsWithLabels,
        correctKey: q.answer || q.Answer || q.correct || q.Correct || '',
        explanation: q.explanation || q.Explanation || q.explain || ''
      });
    });
  });
  console.log('[Quiz] Final question count:', final.length);
  return final;
}

/* -------------------------
   Render helpers
   ------------------------- */
function renderQuestion() {
  const i = quizState.currentIndex;
  const total = quizState.questions.length;
  const progressText = document.getElementById('progress-text');
  const scoreText = document.getElementById('score-text');
  progressText.textContent = `Question ${i+1} / ${total}`;
  scoreText.textContent = `${quizState.score}`;

  const q = quizState.questions[i];
  if (!q) return;

  // Removed question number prefix (QX:) as requested
  document.getElementById('question-text').innerHTML = `
    <div class="section-title" style="font-size:1.25rem;font-weight:600;margin-bottom:8px;">
      ${q.sectionName}
    </div>
    <div class="question-text" style="font-size:1.1rem;font-weight:500;line-height:1.6;">
      ${q.questionText}
    </div>
  `;

  const optionsList = document.getElementById('options-list');
  optionsList.innerHTML = '';

  q.options.forEach(opt => {
    const li = el('li', { class: 'option', 'data-orig-key': opt.origKey }, [
      el('div', { class: 'option-label' }, [opt.label]),
      el('div', { class: 'option-text', text: opt.text })
    ]);
    li.addEventListener('click', () => {
      Array.from(optionsList.children).forEach(c => c.classList.remove('selected'));
      li.classList.add('selected');
    });
    optionsList.appendChild(li);
  });

  document.getElementById('feedback').innerHTML = '';
  document.getElementById('submit-answer').classList.remove('hidden');
  document.getElementById('next-question').classList.add('hidden');
}

/* -------------------------
   Answer submission flow
   ------------------------- */
function getSelectedOption() {
  const optionsList = document.getElementById('options-list');
  const sel = optionsList.querySelector('.option.selected');
  return sel ? { origKey: sel.getAttribute('data-orig-key'), element: sel } : null;
}

function onSubmitAnswer() {
  const sel = getSelectedOption();
  if (!sel) {
    const f = document.getElementById('feedback');
    f.textContent = 'Please select an option.';
    f.style.color = '#c00';
    return;
  }
  const current = quizState.questions[quizState.currentIndex];
  const submitBtn = document.getElementById('submit-answer');
  submitBtn.classList.add('hidden');

  Array.from(document.getElementById('options-list').children).forEach(c => c.classList.add('disabled'));

  const feedback = document.getElementById('feedback');
  const correctKey = String(current.correctKey || '').trim();
  const sectionKey = getSectionKey(current);
  
  if (sel.origKey === correctKey) {
    sel.element.classList.add('correct');
    quizState.score += 1;
    quizState.perSectionScore[sectionKey] = (quizState.perSectionScore[sectionKey] || 0) + 1;
    feedback.innerHTML = `<div style="color:green;"><strong>Correct!</strong></div><div style="margin-top:6px">${current.explanation || ''}</div>`;
  } else {
    sel.element.classList.add('wrong');
    feedback.innerHTML = `<div style="color:#b00;"><strong>Incorrect.</strong> The correct answer is highlighted below.</div><div style="margin-top:6px">${current.explanation || ''}</div>`;
    const options = document.getElementById('options-list').children;
    for (const o of options) {
      if (o.getAttribute('data-orig-key') === correctKey) {
        o.classList.add('correct');
      }
    }
  }

  document.getElementById('score-text').textContent = quizState.score;
  document.getElementById('next-question').classList.remove('hidden');
}

function onNextQuestion() {
  quizState.currentIndex += 1;
  if (quizState.currentIndex >= quizState.questions.length) {
    quizState.status = 'Completed';
    showFinalResult();
  } else {
    renderQuestion();
  }
}

/* -------------------------
   Final result
   ------------------------- */
function computeSectionSummary() {
  if (!Array.isArray(quizState.questions) || !quizState.questions.length) return [];
  const summaryMap = {};
  quizState.questions.forEach(question => {
    const key = getSectionKey(question);
    if (!summaryMap[key]) {
      summaryMap[key] = {
        number: question.section != null ? Number(question.section) : null,
        title: getSectionTitle(question),
        total: 0,
        correct: 0,
      };
    }
    summaryMap[key].total += 1;
  });
  Object.keys(summaryMap).forEach(key => {
    summaryMap[key].correct = quizState.perSectionScore[key] || 0;
  });
  return Object.values(summaryMap).sort((a, b) => {
    if (a.number != null && b.number != null) return a.number - b.number;
    if (a.number != null) return -1;
    if (b.number != null) return 1;
    return a.title.localeCompare(b.title);
  });
}

function showFinalResult() {
  quizRoot.innerHTML = '';
  const panel = el('div', { class: 'score-panel' });
  const total = quizState.questions.length;
  const score = quizState.score;
  const percent = total ? ((score / total) * 100).toFixed(1) : '0.0';
  const status = quizState.status === 'Quit' ? 'Quit' : 'Completed';
  const sectionSummary = computeSectionSummary();
  
  panel.appendChild(el('h2', {}, ['Test Summary']));
  panel.appendChild(el('div', {}, [`Participant: ${quizState.participantName || 'Anonymous'}`]));
  panel.appendChild(el('div', {}, [`Status: ${status}`]));
  panel.appendChild(el('div', {}, [`Score: ${score} / ${total} (${percent}%)`]));
  
  if (sectionSummary.length) {
    const tableWrap = el('div', {
      style: 'margin-top:12px;text-align:left;max-width:520px;margin-left:auto;margin-right:auto',
    });
    tableWrap.appendChild(el('h4', {}, ['Per-section score:']));
    const ul = el('ul');
    sectionSummary.forEach(entry => {
      const displayName =
        entry.number != null
          ? `Section ${entry.number}${entry.title ? ` – ${entry.title}` : ''}`
          : entry.title;
      ul.appendChild(el('li', {}, [`${displayName}: ${entry.correct} / ${entry.total}`]));
    });
    tableWrap.appendChild(ul);
    panel.appendChild(tableWrap);
  }
  
  const restart = el('button', { class: 'btn', id: 'restart-quiz', style: 'margin-top:14px' }, ['Restart']);
  restart.addEventListener('click', () => location.reload());
  panel.appendChild(restart);
  quizRoot.appendChild(panel);

  if (!quizState.hasPostedResult) {
    const resultPayload = {
      name: buildQuizAttemptName('Main Test', quizState.participantName, quizState.startedAt),
      testType: 'Main',
      status,
      totalQuestions: total,
      totalCorrect: score,
      totalScore: score,
      sections: sectionSummary.map((entry, idx) => ({
        number: entry.number != null ? entry.number : idx + 1,
        title: entry.title,
        correct: entry.correct,
      })),
    };

    quizState.hasPostedResult = true;
    if (typeof window.postQuizAttemptToSalesforce === 'function') {
      window
        .postQuizAttemptToSalesforce(resultPayload)
        .then(() => console.log('Posted main quiz result'))
        .catch(err => {
          console.error('Post failed', err);
          quizState.hasPostedResult = false;
        });
    } else {
      console.warn('postQuizAttemptToSalesforce not available');
      quizState.hasPostedResult = false;
    }
  }
}

/* -------------------------
   Modal / Pretest flow
   ------------------------- */
function setupPretestModal() {
  const takeTestBtn = document.querySelector('.sparkle-button');
  const modal = document.getElementById('quiz-modal');
  const startBtn = document.getElementById('start-test-btn');
  const cancelBtn = document.getElementById('cancel-test-btn');
  const nameInput = document.getElementById('participant-name');
  const acceptCheck = document.getElementById('accept-terms');
  const modalCloseButtons = modal ? modal.querySelectorAll('[data-action="close"], .quiz-modal-close') : [];

  function openModal() {
    if (!modal) return;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    if (nameInput) {
      nameInput.value = '';
      nameInput.focus();
    }
    if (acceptCheck) acceptCheck.checked = false;
    updateStartBtnState();
  }
  
  function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }

  if (takeTestBtn) takeTestBtn.addEventListener('click', openModal);
  modalCloseButtons.forEach(b => b.addEventListener('click', closeModal));
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  function updateStartBtnState() {
    if (!startBtn) return;
    startBtn.disabled = !(nameInput && nameInput.value.trim()) || !(acceptCheck && acceptCheck.checked);
  }
  
  if (nameInput) nameInput.addEventListener('input', updateStartBtnState);
  if (acceptCheck) acceptCheck.addEventListener('change', updateStartBtnState);

  if (startBtn) startBtn.addEventListener('click', async () => {
    if (!nameInput || !nameInput.value.trim()) { alert('Please enter your name'); return; }
    if (!acceptCheck || !acceptCheck.checked) { alert('Please accept Terms & Conditions'); return; }
    
    quizState.participantName = nameInput.value.trim();
    quizState.startedAt = new Date();
    quizState.status = 'In Progress';
    quizState.hasPostedResult = false;
    quizState.perSectionScore = {};
    quizState.currentIndex = 0;
    quizState.score = 0;
    
    closeModal();
    if (typeof window.toggleQuizSections === 'function') window.toggleQuizSections('full');
    
    createQuizShell();
    quizRoot.innerHTML = '<div class="quiz-loading">Loading questions...</div>';
    
    try {
      const sections = await loadAllSections();
      const questions = buildQuizFromSections(sections);
      if (!questions.length) {
        quizRoot.innerHTML = '<div class="quiz-error" style="background:#fffbe6;border:1px solid #d4aa00;padding:14px;border-radius:8px;color:#222;">No questions available. Check console for missing/misnamed JSON files.</div>';
        return;
      }
      quizState.questions = questions;
      quizState.currentIndex = 0;
      quizState.score = 0;
      createQuizShell();
      renderQuestion();
    } catch (err) {
      console.error('Error loading quiz:', err);
      quizRoot.innerHTML = '<div class="quiz-error">Failed to load quiz. Please try again.</div>';
    }
  });
}

/* -------------------------
   Bootstrap once DOM ready
   ------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  setupPretestModal();
  window._quizState = quizState;
});

if (typeof window !== 'undefined' && !window.buildQuizAttemptName) {
  window.buildQuizAttemptName = buildQuizAttemptName;
}