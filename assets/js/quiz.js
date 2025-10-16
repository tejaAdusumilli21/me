/* quiz.js - full script
   Drop into your page and ensure quiz.css includes styles from previous message.
*/

(() => {
  // Config
  const SECTIONS_COUNT = 18;
  const QUESTIONS_PER_SECTION = 10;
  const JSON_PATH_TEMPLATE = (n) => `level${n}.json`; // adjust path if needed (e.g., '/data/level1.json')

  // Quiz state
  const quizState = {
    participantName: '',
    sections: [], // array of arrays (sections -> questions)
    currentSectionIndex: 0,
    currentQuestionIndex: 0,
    answers: {}, // { "s0q3": { selected: 'B', correct: true } }
    score: 0,
    started: false
  };

  /* ---------- Modal + pretest UI ---------- */
  function openModal() {
    const modal = document.getElementById('quiz-modal');
    if (!modal) return;
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    const modal = document.getElementById('quiz-modal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }

  function setupPretestModal() {
    const takeBtn = document.querySelector('.sparkle-button');
    const modal = document.getElementById('quiz-modal');
    const closeButtons = modal ? modal.querySelectorAll('[data-action="close"], .quiz-modal-close') : [];
    const startBtn = document.getElementById('start-test-btn');
    const cancelBtn = document.getElementById('cancel-test-btn');
      // Enable/disable Start button dynamically
  const nameInput = document.getElementById('participant-name');
  const acceptCheck = document.getElementById('accept-terms');
  const validateForm = () => {
    if (nameInput.value.trim() && acceptCheck.checked) {
      startBtn.removeAttribute('disabled');
    } else {
      startBtn.setAttribute('disabled', 'true');
    }
  };
  nameInput.addEventListener('input', validateForm);
  acceptCheck.addEventListener('change', validateForm);

    if (takeBtn) {
      takeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    }

    closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (!startBtn) return;

    startBtn.addEventListener('click', async () => {
      const nameInput = document.getElementById('participant-name');
      const acceptCheck = document.getElementById('accept-terms');
      if (!nameInput.value.trim()) {
        alert('Please enter your name');
        return;
      }
      if (!acceptCheck.checked) {
        alert('Please accept Terms & Conditions');
        return;
      }

      quizState.participantName = nameInput.value.trim();
      closeModal();

      // UI swap: hide .sp and show #quiz-root (place quiz-root where .sp was visually)
      const spBlock = document.querySelector('.sp');
      if (spBlock) spBlock.style.display = 'none'; // or spBlock.remove();

      const quizRootEl = document.getElementById('quiz-root');
      if (quizRootEl) {
        quizRootEl.classList.add('active');
        quizRootEl.style.display = 'block';
      }

      // Boot the quiz
      await bootQuiz();
    });
  }

  /* ---------- Loading sections JSON ---------- */
  async function loadSectionJson(index) {
    // index is 1-based for file naming (level1.json)
    const path = JSON_PATH_TEMPLATE(index);
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`Failed to fetch ${path} - ${res.status}`);
      const json = await res.json();
      // Expect json to be an array of questions. If not, try to handle gracefully.
      if (!Array.isArray(json)) throw new Error(`${path} did not return an array`);
      return json;
    } catch (err) {
      console.warn('loadSectionJson error:', err);
      return null; // caller will handle fallback
    }
  }

  async function loadAllSections() {
    const sections = [];
    for (let i = 1; i <= SECTIONS_COUNT; i++) {
      const sec = await loadSectionJson(i);
      if (sec && sec.length) {
        // Optionally shuffle and pick QUESTIONS_PER_SECTION if JSON has more.
        const picked = shuffleArray(sec).slice(0, QUESTIONS_PER_SECTION);
        sections.push(picked);
      } else {
        // Fallback: generate dummy questions if file missing
        const fallback = generateDummySection(i);
        sections.push(fallback);
      }
    }
    return sections;
  }

  /* ---------- Quiz UI creation ---------- */
  function createQuizShell() {
    const root = document.getElementById('quiz-root');
    if (!root) return;
    root.innerHTML = `
      <div class="quiz-container">
        <header class="quiz-header">
          <h2 id="quiz-title">Quiz — <span id="participant-name-display"></span></h2>
          <div class="progress">
            <span id="section-indicator"></span> | <span id="question-indicator"></span>
          </div>
        </header>
        <main id="quiz-main" class="quiz-main"></main>
        <footer class="quiz-footer">
          <div class="controls">
            <button id="prev-q" class="btn-secondary">Previous</button>
            <button id="submit-answer" class="btn-primary">Submit Answer</button>
            <button id="next-q" class="btn-secondary">Next</button>
          </div>
        </footer>
      </div>
    `;

    document.getElementById('participant-name-display').textContent = quizState.participantName || 'Participant';
    document.getElementById('prev-q').addEventListener('click', onPrev);
    document.getElementById('next-q').addEventListener('click', onNext);
    document.getElementById('submit-answer').addEventListener('click', onSubmitAnswer);
  }

  /* ---------- Render question ---------- */
  function renderCurrent() {
    const main = document.getElementById('quiz-main');
    if (!main) return;
    const sIdx = quizState.currentSectionIndex;
    const qIdx = quizState.currentQuestionIndex;
    const section = quizState.sections[sIdx];
    if (!section) {
      main.innerHTML = `<p>Section not loaded.</p>`;
      return;
    }
    const question = section[qIdx];
    if (!question) {
      main.innerHTML = `<p>Question not available.</p>`;
      return;
    }

    // Build question HTML. Expect question object shape:
    // { prompt: "Question text", options: { A: '...', B: '...', C: '...', D: '...' }, answer: 'A' }
    const prompt = escapeHtml(question.prompt || question.question || 'No prompt');
    const options = question.options || question.choices || question.answers || {};
    const keys = Object.keys(options);
    // ensure deterministic order A,B,C,D if present
    const order = ['A','B','C','D'].filter(k => keys.includes(k)).length ? ['A','B','C','D'] : keys;

    // Build options list
    const optionsHtml = order.map(k => {
      const label = escapeHtml(options[k] || options[k.toLowerCase()] || options[k.toUpperCase()] || '');
      return `<li class="option" data-key="${k}" role="button" tabindex="0" aria-pressed="false">
                <div class="option-key">${k}</div>
                <div class="option-label">${label}</div>
              </li>`;
    }).join('');

    main.innerHTML = `
      <section class="question-card">
        <div class="q-meta">
          <div id="section-indicator">Section ${sIdx+1} / ${SECTIONS_COUNT}</div>
          <div id="question-indicator">Q ${qIdx+1} / ${quizState.sections[sIdx].length}</div>
        </div>
        <h3 class="question-prompt">${prompt}</h3>
        <ul class="options-list" role="list">${optionsHtml}</ul>
        <div class="post-actions" aria-live="polite"></div>
      </section>
    `;

    // Wire option click & keyboard handlers
    const optionsList = main.querySelector('.options-list');
    Array.from(optionsList.children).forEach(li => {
      li.addEventListener('click', () => selectOption(li));
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          li.click();
        }
      });
    });

    // If previously answered, show selection and disabled state
    const answerKey = getAnswerKey(sIdx, qIdx);
    const stored = quizState.answers[answerKey];
    if (stored && stored.selected) {
      // mark selection
      const selectedEl = optionsList.querySelector(`.option[data-key="${stored.selected}"]`);
      if (selectedEl) {
        optionsList.querySelectorAll('.option').forEach(o => {
          o.classList.remove('selected');
          o.setAttribute('aria-pressed', 'false');
        });
        selectedEl.classList.add('selected');
        selectedEl.setAttribute('aria-pressed', 'true');
      }
      // if already evaluated (correct/wrong) show accordingly and disable
      if (stored.evaluated) {
        evaluateUIForAnswer(optionsList, question, stored);
      }
    }
  }

  function selectOption(li) {
    const optionsList = li.parentElement;
    Array.from(optionsList.children).forEach(c => {
      c.classList.remove('selected');
      c.setAttribute('aria-pressed', 'false');
    });
    li.classList.add('selected');
    li.setAttribute('aria-pressed', 'true');
    // store temporary selection (not evaluated until submit)
    const sIdx = quizState.currentSectionIndex;
    const qIdx = quizState.currentQuestionIndex;
    const answerKey = getAnswerKey(sIdx, qIdx);
    if (!quizState.answers[answerKey]) quizState.answers[answerKey] = {};
    quizState.answers[answerKey].selected = li.getAttribute('data-key');
    quizState.answers[answerKey].evaluated = !!quizState.answers[answerKey].evaluated; // keep if already evaluated
  }

  function onPrev() {
    if (quizState.currentQuestionIndex > 0) {
      quizState.currentQuestionIndex--;
      renderCurrent();
    } else if (quizState.currentSectionIndex > 0) {
      quizState.currentSectionIndex--;
      quizState.currentQuestionIndex = Math.max(0, quizState.sections[quizState.currentSectionIndex].length - 1);
      renderCurrent();
    }
  }
  function onNext() {
    const sec = quizState.sections[quizState.currentSectionIndex];
    if (!sec) return;
    if (quizState.currentQuestionIndex < sec.length - 1) {
      quizState.currentQuestionIndex++;
      renderCurrent();
    } else if (quizState.currentSectionIndex < quizState.sections.length - 1) {
      quizState.currentSectionIndex++;
      quizState.currentQuestionIndex = 0;
      renderCurrent();
    } else {
      // End of last section -> show summary
      showScorecard();
    }
  }

  function onSubmitAnswer() {
    const sIdx = quizState.currentSectionIndex;
    const qIdx = quizState.currentQuestionIndex;
    const section = quizState.sections[sIdx];
    if (!section) return;
    const question = section[qIdx];
    const answerKey = getAnswerKey(sIdx, qIdx);
    const stored = quizState.answers[answerKey];
    if (!stored || !stored.selected) {
      alert('Please select an option before submitting.');
      return;
    }
    // Evaluate
    const correctAnswer = (question.answer || question.correctAnswer || question.correct || '').toString().trim();
    const selected = stored.selected;
    const isCorrect = !!correctAnswer && (selected.toString().trim().toUpperCase() === correctAnswer.toString().trim().toUpperCase());

    // Save evaluation and score
    quizState.answers[answerKey] = { ...stored, evaluated: true, correctAnswer, selected, correct: isCorrect };
    if (isCorrect) quizState.score++;

    // UI feedback
    const main = document.getElementById('quiz-main');
    const optionsList = main.querySelector('.options-list');
    evaluateUIForAnswer(optionsList, question, quizState.answers[answerKey]);

    // Auto move to next after brief pause? Not auto — keep on user's control.
  }

  function evaluateUIForAnswer(optionsList, question, stored) {
    // Mark correct / wrong visually and disable further selection
    const correct = (stored.correctAnswer || stored.correct || question.answer || question.correctAnswer || '').toString().trim().toUpperCase();
    Array.from(optionsList.children).forEach(li => {
      const key = li.getAttribute('data-key');
      li.classList.add('disabled');
      li.setAttribute('aria-disabled', 'true');
      if (key.toString().trim().toUpperCase() === correct) {
        li.classList.add('correct');
      }
      if (stored.selected && key === stored.selected && !stored.correct) {
        li.classList.add('wrong');
      }
    });
    // Also show post-action message
    const post = optionsList.parentElement.querySelector('.post-actions');
    if (stored.correct) {
      post.innerHTML = `<div class="toast success">Correct! +1</div>`;
    } else {
      post.innerHTML = `<div class="toast error">Wrong. Correct answer: <strong>${escapeHtml(correct)}</strong></div>`;
    }
  }

  function showScorecard() {
    const root = document.getElementById('quiz-root');
    if (!root) return;
    const totalQuestions = quizState.sections.reduce((acc, s) => acc + (s ? s.length : 0), 0);
    const score = quizState.score;
    root.innerHTML = `
      <div class="scorecard">
        <h2>Scorecard</h2>
        <p><strong>${escapeHtml(quizState.participantName)}</strong>, your score is <strong>${score}</strong> out of <strong>${totalQuestions}</strong>.</p>
        <div class="score-actions">
          <button id="review-answers" class="btn-secondary">Review answers</button>
          <button id="restart-quiz" class="btn-primary">Restart</button>
        </div>
      </div>
    `;
    document.getElementById('restart-quiz').addEventListener('click', restartQuiz);
    document.getElementById('review-answers').addEventListener('click', reviewAnswers);
  }

  function reviewAnswers() {
    // Simple review: show first section/question where we can re-render and show evaluated states
    quizState.currentSectionIndex = 0;
    quizState.currentQuestionIndex = 0;
    createQuizShell();
    // Ensure UI root rebuilt with participant name
    document.getElementById('participant-name-display').textContent = quizState.participantName;
    // Render first QA
    renderCurrent();
  }

  function restartQuiz() {
    // Reset state but keep name
    const name = quizState.participantName;
    Object.assign(quizState, {
      participantName: name,
      sections: quizState.sections,
      currentSectionIndex: 0,
      currentQuestionIndex: 0,
      answers: {},
      score: 0,
      started: false
    });
    createQuizShell();
    renderCurrent();
  }

  /* ---------- Boot sequence ---------- */
  async function bootQuiz() {
    if (quizState.started) return;
    createQuizShell();
    // show loading placeholder
    const main = document.getElementById('quiz-main');
    if (main) main.innerHTML = `<p>Loading questions...</p>`;
    // Try to load requested JSONs
    quizState.sections = await loadAllSections();
    quizState.started = true;
    // reset navigation
    quizState.currentSectionIndex = 0;
    quizState.currentQuestionIndex = 0;
    quizState.score = 0;
    quizState.answers = {};
    renderCurrent();
  }

  /* ---------- Utils ---------- */
  function getAnswerKey(sectionIndex, questionIndex) {
    return `s${sectionIndex}q${questionIndex}`;
  }

  // Very small HTML escaper
  function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  // Fisher-Yates shuffle
  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Fallback: generate dummy section with QUESTIONS_PER_SECTION items
  function generateDummySection(index) {
    const sec = [];
    for (let i = 0; i < QUESTIONS_PER_SECTION; i++) {
      const qn = {
        prompt: `Section ${index} - Sample question ${i + 1}: What is ${i + 1} + ${index}?`,
        options: {
          A: String(i + 1 + index),
          B: String(i + 1 + index + 1),
          C: String(i + 1 + index + 2),
          D: String(i + 1 + index + 3)
        },
        answer: 'A'
      };
      sec.push(qn);
    }
    return sec;
  }

  /* ---------- Initialization ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    setupPretestModal();
    // Also wire mini test button (if present) to optionally start a shorter flow
    const miniBtn = document.querySelector('.learn-more');
    if (miniBtn) {
      miniBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // quick mini flow: open modal but we could alter config to fewer sections
        openModal();
      });
    }
    // Hide #quiz-root initially to avoid flash if CSS not applied
    const qr = document.getElementById('quiz-root');
    if (qr) qr.style.display = 'none';
  });

})();
