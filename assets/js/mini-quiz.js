const MINI_SOURCE_PATH = './assets/json/mini.json';
const MINI_DEFAULT_COUNT = 50;
const MINI_OPTION_LABELS = ['A', 'B', 'C', 'D'];

const miniState = {
  participantName: '',
  questions: [],
  currentIndex: 0,
  score: 0,
  quizTitle: 'Mini Test'
};

let miniQuestionBankCache = null;

function miniShuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function miniPickRandom(arr, count) {
  if (count >= arr.length) return [...arr];
  return miniShuffle(arr).slice(0, count);
}

async function loadMiniQuestionBank() {
  if (miniQuestionBankCache) return miniQuestionBankCache;
  const res = await fetch(MINI_SOURCE_PATH, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Unable to load mini quiz questions: ${res.status}`);
  }
  const json = await res.json();
  let questions = [];
  if (json.levels) {
    Object.values(json.levels).forEach(level => {
      if (Array.isArray(level.questions)) questions = questions.concat(level.questions);
    });
  } else if (Array.isArray(json.questions)) {
    questions = json.questions;
  }
  miniQuestionBankCache = {
    title: json.section || json.title || 'Mini Quiz',
    questions
  };
  return miniQuestionBankCache;
}

function formatMiniQuestion(raw, fallbackTitle) {
  const options = raw?.options || {};
  const randomizedOptions = miniShuffle(Object.entries(options).map(([key, text]) => ({ key, text })))
    .slice(0, MINI_OPTION_LABELS.length)
    .map((opt, idx) => ({
      label: MINI_OPTION_LABELS[idx],
      origKey: opt.key,
      text: opt.text
    }));
  return {
    sectionName: raw?.topic || raw?.section || fallbackTitle || 'Mini Quiz',
    questionText: raw?.question || '',
    options: randomizedOptions,
    correctKey: raw?.answer,
    explanation: raw?.explanation || ''
  };
}

async function prepareMiniQuizQuestions() {
  const bank = await loadMiniQuestionBank();
  if (!bank.questions.length) {
    return { title: bank.title, questions: [] };
  }
  const limit = Math.min(MINI_DEFAULT_COUNT, bank.questions.length);
  const selected = miniPickRandom(bank.questions, limit);
  const questions = selected.map(q => formatMiniQuestion(q, bank.title));
  return { title: bank.title, questions };
}

const miniCreateElement = typeof el === 'function'
  ? el
  : function(tag, attrs = {}, children = []) {
      const element = document.createElement(tag);
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'class') element.className = v;
        else if (k === 'text') element.textContent = v;
        else if (k === 'html') element.innerHTML = v;
        else element.setAttribute(k, String(v));
      });
      children.forEach(child => {
        if (typeof child === 'string') element.appendChild(document.createTextNode(child));
        else if (child) element.appendChild(child);
      });
      return element;
    };

function createMiniQuizShell() {
  const root = document.getElementById('mini-quiz-root');
  if (!root) return;
  root.innerHTML = '';
  const container = miniCreateElement('div', { class: 'quiz-container mini-mode' });

  const header = miniCreateElement('div', { class: 'quiz-header' }, [
    miniCreateElement('div', { class: 'progress', html: `<span id="mini-progress-text">Question 0 / 0</span>` }),
    miniCreateElement('div', { class: 'score', html: `<strong>Score: <span id="mini-score-text">0</span></strong>` })
  ]);
  container.appendChild(header);

  const body = miniCreateElement('div', { class: 'quiz-body' });
  body.appendChild(miniCreateElement('div', { class: 'quiz-question', id: 'mini-question-text' }));
  body.appendChild(miniCreateElement('ul', { class: 'options', id: 'mini-options-list' }));
  body.appendChild(miniCreateElement('div', { class: 'feedback', id: 'mini-feedback' }));

  const controls = miniCreateElement('div', { class: 'controls' });
  const submitBtn = miniCreateElement('button', { class: 'btn', id: 'mini-submit-answer', type: 'button' }, ['Submit Answer']);
  const nextBtn = miniCreateElement('button', { class: 'btn hidden', id: 'mini-next-question', type: 'button' }, ['Next']);
  const quitBtn = miniCreateElement('button', { class: 'btn', id: 'mini-quit-quiz', type: 'button' }, ['Quit']);
  controls.append(submitBtn, nextBtn, quitBtn);

  container.appendChild(body);
  container.appendChild(controls);

  root.appendChild(container);

  submitBtn.addEventListener('click', onMiniSubmitAnswer);
  nextBtn.addEventListener('click', onMiniNextQuestion);
  quitBtn.addEventListener('click', showMiniFinalResult);
}

function renderMiniQuestion() {
  const root = document.getElementById('mini-quiz-root');
  if (!root) return;
  const q = miniState.questions[miniState.currentIndex];
  if (!q) return;

  const total = miniState.questions.length;
  const progress = document.getElementById('mini-progress-text');
  const scoreText = document.getElementById('mini-score-text');
  if (progress) progress.textContent = `Question ${miniState.currentIndex + 1} / ${total}`;
  if (scoreText) scoreText.textContent = `${miniState.score}`;

  const questionNode = document.getElementById('mini-question-text');
  if (questionNode) {
    questionNode.innerHTML = `
      <div class="section-title" style="font-size:1.1rem;font-weight:600;margin-bottom:8px;">
        ${q.sectionName}
      </div>
      <div class="question-text" style="font-size:1.05rem;font-weight:500;line-height:1.6;">
        ${q.questionText}
      </div>
    `;
  }

  const optionsList = document.getElementById('mini-options-list');
  if (!optionsList) return;
  optionsList.innerHTML = '';

  q.options.forEach(opt => {
    const li = miniCreateElement('li', { class: 'option', 'data-orig-key': opt.origKey }, [
      miniCreateElement('div', { class: 'option-label', text: opt.label }),
      miniCreateElement('div', { class: 'option-text', text: opt.text })
    ]);
    li.addEventListener('click', () => {
      Array.from(optionsList.children).forEach(c => c.classList.remove('selected'));
      li.classList.add('selected');
    });
    optionsList.appendChild(li);
  });

  const feedback = document.getElementById('mini-feedback');
  if (feedback) feedback.innerHTML = '';
  const submitBtn = document.getElementById('mini-submit-answer');
  const nextBtn = document.getElementById('mini-next-question');
  if (submitBtn) submitBtn.classList.remove('hidden');
  if (nextBtn) nextBtn.classList.add('hidden');
}

function getMiniSelectedOption() {
  const optionsList = document.getElementById('mini-options-list');
  if (!optionsList) return null;
  const selected = optionsList.querySelector('.option.selected');
  return selected
    ? { element: selected, origKey: selected.getAttribute('data-orig-key') }
    : null;
}

function onMiniSubmitAnswer() {
  const selection = getMiniSelectedOption();
  if (!selection) {
    const feedback = document.getElementById('mini-feedback');
    if (feedback) {
      feedback.textContent = 'Please select an option.';
      feedback.style.color = '#c00';
    }
    return;
  }
  const current = miniState.questions[miniState.currentIndex];
  if (!current) return;

  const submitBtn = document.getElementById('mini-submit-answer');
  const nextBtn = document.getElementById('mini-next-question');
  if (submitBtn) submitBtn.classList.add('hidden');
  if (nextBtn) nextBtn.classList.remove('hidden');

  const optionsList = document.getElementById('mini-options-list');
  Array.from(optionsList.children).forEach(c => c.classList.add('disabled'));

  const feedback = document.getElementById('mini-feedback');
  const correctKey = current.correctKey;
  if (selection.origKey === correctKey) {
    selection.element.classList.add('correct');
    miniState.score += 1;
    if (feedback) {
      feedback.innerHTML = `<div style="color:green;"><strong>Correct!</strong></div><div style="margin-top:6px">${current.explanation || ''}</div>`;
    }
  } else {
    selection.element.classList.add('wrong');
    if (feedback) {
      feedback.innerHTML = `<div style="color:#b00;"><strong>Incorrect.</strong> The correct answer is highlighted below.</div><div style="margin-top:6px">${current.explanation || ''}</div>`;
    }
    Array.from(optionsList.children).forEach(option => {
      if (option.getAttribute('data-orig-key') === correctKey) {
        option.classList.add('correct');
      }
    });
  }

  const scoreText = document.getElementById('mini-score-text');
  if (scoreText) scoreText.textContent = `${miniState.score}`;
}

function onMiniNextQuestion() {
  miniState.currentIndex += 1;
  if (miniState.currentIndex >= miniState.questions.length) {
    showMiniFinalResult();
  } else {
    renderMiniQuestion();
  }
}

function showMiniFinalResult() {
  const root = document.getElementById('mini-quiz-root');
  if (!root) return;
  root.innerHTML = '';

  const total = miniState.questions.length;
  const score = miniState.score;
  const percent = total ? ((score / total) * 100).toFixed(1) : '0.0';

  const panel = miniCreateElement('div', { class: 'score-panel' });
  panel.appendChild(miniCreateElement('h2', { text: miniState.quizTitle || 'Mini Test Complete' }));
  panel.appendChild(miniCreateElement('div', { text: `Participant: ${miniState.participantName || 'Anonymous'}` }));
  panel.appendChild(miniCreateElement('div', { text: `Score: ${score} / ${total} (${percent}%)` }));

  const actions = miniCreateElement('div', { class: 'mini-final-actions' });
  const retakeBtn = miniCreateElement('button', { class: 'btn', type: 'button' }, ['Retake Mini Test']);
  retakeBtn.addEventListener('click', () => {
    miniState.currentIndex = 0;
    miniState.score = 0;
    startMiniQuiz({ retake: true });
  });
  const exitBtn = miniCreateElement('button', { class: 'btn-secondary', type: 'button', style: 'margin-left:12px' }, ['Back to Quiz Hub']);
  exitBtn.addEventListener('click', () => toggleQuizSections('exit'));
  actions.append(retakeBtn, exitBtn);

  panel.appendChild(actions);
  root.appendChild(panel);
}

async function startMiniQuiz(options = {}) {
  const { retake = false, triggerButton = null } = options;
  const root = document.getElementById('mini-quiz-root');
  if (!root) return;

  if (!retake) {
    toggleQuizSections('mini');
  }

  if (triggerButton) {
    triggerButton.dataset.originalText = triggerButton.dataset.originalText || triggerButton.textContent;
    triggerButton.textContent = 'Loading...';
    triggerButton.disabled = true;
  }

  root.innerHTML = '<div class="quiz-loading">Preparing mini test…</div>';

  try {
    const { title, questions } = await prepareMiniQuizQuestions();
    miniState.quizTitle = title || 'Mini Test Complete';
    if (!questions.length) {
      root.innerHTML = '<div class="quiz-error">No questions available for the mini test.</div>';
      return;
    }
    miniState.questions = questions;
    miniState.currentIndex = 0;
    miniState.score = 0;
    createMiniQuizShell();
    renderMiniQuestion();
  } catch (err) {
    console.error('Mini quiz: unable to prepare questions', err);
    root.innerHTML = '<div class="quiz-error">Unable to load the mini test. Please try again later.</div>';
  } finally {
    if (triggerButton) {
      triggerButton.textContent = triggerButton.dataset.originalText || 'Start Mini Test';
      triggerButton.disabled = false;
    }
  }
}

function setupMiniPretestModal() {
  const miniBtn = document.querySelector('.learn-more');
  const modal = document.getElementById('mini-quiz-modal');
  const startBtn = document.getElementById('start-mini-test-btn');
  const cancelBtn = document.getElementById('cancel-mini-test-btn');
  const nameInput = document.getElementById('mini-participant-name');
  if (!miniBtn || !modal || !startBtn || !nameInput) return;

  const closeButtons = modal.querySelectorAll('[data-mini-action="close"], .quiz-modal-close');

  function openModal() {
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    if (nameInput) nameInput.focus();
  }

  function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }

  miniBtn.addEventListener('click', openModal);
  closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  function updateStartState() {
    startBtn.disabled = !nameInput.value.trim();
  }

  nameInput.addEventListener('input', updateStartState);
  updateStartState();

  startBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      alert('Please enter your name.');
      return;
    }
    miniState.participantName = name;
    closeModal();
    startMiniQuiz({ triggerButton: startBtn });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupMiniPretestModal();
});
