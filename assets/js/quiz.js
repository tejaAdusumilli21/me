
/*
  Quiz runtime:
  - Loads SECTION_JSON_MAP (you provided earlier)
  - Picks 10 random unique questions from each section
  - Randomizes option order per question and maps to labels A,B,C,D
  - Tracks score, shows explanation on correct, shows error + highlights correct on wrong
  - After all questions shows final score
*/

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
    else if (k === 'html') e.innerHTML = v;
    else e.setAttribute(k, String(v));
  });
  children.forEach(c => {
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else e.appendChild(c);
  });
  return e;
}

/* -------------------------
   Quiz State
   ------------------------- */
const quizState = {
  participantName: '',
  questions: [], // flattened list of {section, originalId, question, optionsMap, answerKey, explanation}
  currentIndex: 0,
  score: 0,
  perSectionScore: {}, // section -> correct count
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

  // attach listeners
  document.getElementById('submit-answer').addEventListener('click', onSubmitAnswer);
  document.getElementById('next-question').addEventListener('click', onNextQuestion);
  document.getElementById('quit-quiz').addEventListener('click', showFinalResult);
}

/* -------------------------
   Loading JSONs and building question list
   ------------------------- */
async function loadAllSections() {
  const keys = Object.keys(SECTION_JSON_MAP);
  // load all sequentially - you may use Promise.all if CORS allows
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
      // assumed structure: { section: "...", levels: { level1: { questions: [...] } } }
      // gather all questions under levels -> level1 (or merge all)
      let questions = [];
      if (json.levels) {
        Object.values(json.levels).forEach(level => {
          if (Array.isArray(level.questions)) questions = questions.concat(level.questions);
        });
      } else if (Array.isArray(json.questions)) {
        questions = json.questions;
      }
      sections.push({ sectionIndex: Number(key), sectionName: json.section || `Section ${key}`, questions });
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
      // convert options object to array to enable randomization of displayed options
      const optsEntries = Object.entries(q.options || {});
      const randOptEntries = shuffle(optsEntries.map(([k, v]) => ({ key: k, text: v })));
      // create mapping of displayed labels A/B/C/D -> original key so we can check answer
      const displayedOptions = randOptEntries.map((o, idx) => {
        return {
          label: ['A','B','C','D'][idx],
          origKey: o.key,
          text: o.text
        };
      }).slice(0,4); // ensure max 4
      final.push({
        section: s.sectionIndex,
        sectionName: s.sectionName,
        originalId: q.id,
        questionText: q.question,
        options: displayedOptions,
        correctKey: q.answer, // original key like "A"
        explanation: q.explanation || ''
      });
    });
  });
  // optional: little shuffle across sections to mix them, or keep grouped by section.
  // We keep them in section order but it's fine to shuffle entire list if desired:
  // shuffle(final);
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

  document.getElementById('question-text').textContent = `${q.sectionName} — Q${q.originalId}: ${q.questionText}`;

  const optionsList = document.getElementById('options-list');
  optionsList.innerHTML = '';

  q.options.forEach(opt => {
    const li = el('li', { class: 'option', 'data-orig-key': opt.origKey }, [
      el('div', { class: 'option-label' }, [opt.label]),
      el('div', { class: 'option-text', html: opt.text })
    ]);
    li.addEventListener('click', () => {
      // deselect others
      Array.from(optionsList.children).forEach(c => c.classList.remove('selected'));
      li.classList.add('selected');
    });
    optionsList.appendChild(li);
  });

  // clear feedback & buttons
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

  // disable further clicks on options
  Array.from(document.getElementById('options-list').children).forEach(c => c.classList.add('disabled'));

  const feedback = document.getElementById('feedback');
  const correctKey = current.correctKey; // original key like "A"
  if (sel.origKey === correctKey) {
    // Correct
    sel.element.classList.add('correct');
    quizState.score += 1;
    quizState.perSectionScore[current.section] = (quizState.perSectionScore[current.section] || 0) + 1;
    feedback.innerHTML = `<div style="color:green;"><strong>Correct!</strong></div><div style="margin-top:6px">${current.explanation || ''}</div>`;
  } else {
    // Wrong: highlight selected and highlight correct option
    sel.element.classList.add('wrong');
    feedback.innerHTML = `<div style="color:#b00;"><strong>Incorrect.</strong> The correct answer is highlighted below.</div><div style="margin-top:6px">${current.explanation || ''}</div>`;
    // find correct option element and mark
    const options = document.getElementById('options-list').children;
    for (const o of options) {
      if (o.getAttribute('data-orig-key') === correctKey) {
        o.classList.add('correct');
      }
    }
  }

  // update score UI
  document.getElementById('score-text').textContent = quizState.score;

  // show next button
  document.getElementById('next-question').classList.remove('hidden');
}

function onNextQuestion() {
  quizState.currentIndex += 1;
  if (quizState.currentIndex >= quizState.questions.length) {
    showFinalResult();
  } else {
    renderQuestion();
  }
}

/* -------------------------
   Final result
   ------------------------- */
function showFinalResult() {
  quizRoot.innerHTML = '';
  const panel = el('div', { class: 'score-panel' });
  const total = quizState.questions.length;
  const score = quizState.score;
  const percent = ((score / total) * 100).toFixed(1);
  panel.appendChild(el('h2', {}, [`Test Complete`]));
  panel.appendChild(el('div', {}, [`Participant: ${quizState.participantName || 'Anonymous'}`]));
  panel.appendChild(el('div', {}, [`Score: ${score} / ${total} (${percent}%)`]));
  // breakdown per section
  const tableWrap = el('div', { style: 'margin-top:12px;text-align:left;max-width:520px;margin-left:auto;margin-right:auto' });
  tableWrap.appendChild(el('h4', {}, ['Per-section score:']));
  const ul = el('ul');
  Object.keys(quizState.perSectionScore).sort((a,b)=>a-b).forEach(s => {
    const count = quizState.perSectionScore[s];
    ul.appendChild(el('li', {}, [`Section ${s}: ${count} / ${QUESTIONS_PER_SECTION}`]));
  });
  tableWrap.appendChild(ul);
  // restart button
  const restart = el('button', { class: 'btn', id: 'restart-quiz', style: 'margin-top:14px' }, ['Restart']);
  restart.addEventListener('click', () => location.reload());
  panel.appendChild(tableWrap);
  panel.appendChild(restart);
  quizRoot.appendChild(panel);
}

/* -------------------------
   Modal / Pretest flow (uses your existing modal HTML ids)
   ------------------------- */
function setupPretestModal() {
  // expected elements:
  const takeTestBtn = document.querySelector('.sparkle-button');
  const modal = document.getElementById('quiz-modal');
  const startBtn = document.getElementById('start-test-btn');
  const cancelBtn = document.getElementById('cancel-test-btn');
  const nameInput = document.getElementById('participant-name');
  const acceptCheck = document.getElementById('accept-terms');
  const modalCloseButtons = modal ? modal.querySelectorAll('[data-action="close"], .quiz-modal-close') : [];

  function openModal() {
    if (!modal) return;
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }

  // open modal on Take Test click
  if (takeTestBtn) takeTestBtn.addEventListener('click', openModal);

  modalCloseButtons.forEach(b => b.addEventListener('click', closeModal));
  cancelBtn && cancelBtn.addEventListener('click', closeModal);

  function updateStartBtnState() {
    startBtn.disabled = !(nameInput && nameInput.value.trim() && acceptCheck && acceptCheck.checked);
  }
  if (nameInput) nameInput.addEventListener('input', updateStartBtnState);
  if (acceptCheck) acceptCheck.addEventListener('change', updateStartBtnState);

  startBtn && startBtn.addEventListener('click', async () => {
    // validate
    if (!nameInput.value.trim()) { alert('Please enter your name'); return; }
    if (!acceptCheck.checked) { alert('Please accept Terms & Conditions'); return; }
    // set participant
    quizState.participantName = nameInput.value.trim();
    closeModal();
    // bootstrap quiz: load JSONs
    createQuizShell();
    try {
      const sections = await loadAllSections();
      if (!sections.length) {
        quizRoot.innerHTML = '<div style="padding:20px">Unable to load quiz data. Check console for errors and paths/CORS.</div>';
        return;
      }
      // build questions
      quizState.questions = buildQuizFromSections(sections);
      if (!quizState.questions.length) {
        quizRoot.innerHTML = '<div style="padding:20px">No questions available in loaded JSONs.</div>';
        return;
      }
      // initialize counts
      quizState.currentIndex = 0;
      quizState.score = 0;
      quizState.perSectionScore = {};
      // render first question
      renderQuestion();
    } catch (err) {
      console.error(err);
      quizRoot.innerHTML = `<div style="padding:20px">Error preparing quiz. Check console.</div>`;
    }
  });
}

/* -------------------------
   Bootstrap once DOM ready
   ------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  setupPretestModal();
  // expose start function for debug if needed
  window._quizState = quizState;
});

