"use strict";

// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
};

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector(
      "[data-testimonials-title]"
    ).innerHTML;
    modalText.innerHTML = this.querySelector(
      "[data-testimonials-text]"
    ).innerHTML;

    testimonialsModalFunc();
  });
}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () {
  elementToggleFunc(this);
});

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
navigationLinks.forEach((link) => {
  link.addEventListener("click", function () {
    const targetPage = this.innerHTML.trim().toLowerCase();

    pages.forEach((page) => {
      if (page.dataset.page === targetPage) {
        page.classList.add("active");
      } else {
        page.classList.remove("active");
      }
    });

    navigationLinks.forEach((navItem) => {
      if (navItem === this) {
        navItem.classList.add("active");
      } else {
        navItem.classList.remove("active");
      }
    });

    window.scrollTo(0, 0);
  });
});
// create feedback form request
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("feedbackForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      const payload = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        comments: formData.get("comments"),
      };

      try {
        const res = await fetch(
          "https://teja-adusumilli-dev-ed.my.salesforce-sites.com/services/apexrest/FeedbackAPI/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const result = await res.text();
        form.reset(); // clear form
        showToast("Feedback submitted!");
      } catch (err) {
        console.error("Feedback Error:", err);
        showToast("Error submitting feedback.");
      }
    });
});
// toast message
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, 3000);
}

// ======================
// Quiz Attempt -> Salesforce (POST)
// ======================

// Your QuizAttemptAPI endpoint
const QUIZ_API_URL =
  "https://teja-adusumilli-dev-ed.my.salesforce-sites.com/services/apexrest/QuizAttemptAPI/";

const MAIN_QUIZ_SECTIONS = [
  { number: 1, title: "Apex Fundamentals & OOP Concepts" },
  { number: 2, title: "Salesforce Triggers" },
  { number: 3, title: "Asynchronous Apex" },
  { number: 4, title: "Lightning Web Components" },
  { number: 5, title: "Aura Components & Migration to LWC" },
  { number: 6, title: "Visualforce" },
  { number: 7, title: "SOQL & SOSL" },
  { number: 8, title: "Integration" },
  { number: 9, title: "OmniStudio" },
  { number: 10, title: "Sales Cloud" },
  { number: 11, title: "Service Cloud" },
  { number: 12, title: "Experience Cloud" },
  { number: 13, title: "Security & Sharing" },
  { number: 14, title: "Deployment & DevOps" },
  { number: 15, title: "Governor Limits & Performance Tuning" },
  { number: 16, title: "Testing" },
  { number: 17, title: "Design Patterns & Frameworks" },
  { number: 18, title: "Advanced Topics" },
];

const MAIN_SECTION_TITLE_MAP = new Map(
  MAIN_QUIZ_SECTIONS.map((section) => [section.number, section.title])
);

const MAIN_SECTION_SAMPLE_CORRECT = [
  9, 8, 9, 8, 7, 8, 9, 8, 9, 8, 8, 8, 8, 8, 8, 9, 9, 9,
];

const SALESFORCE_PAYLOAD_MOCKS = {
  main: {
    name: "Participant - 2024-01-01 - Main",
    testType: "Main",
    status: "Completed",
    totalQuestions: 180,
    totalCorrect: 150,
    totalScore: 150,
    sections: MAIN_QUIZ_SECTIONS.map(({ number, title }, index) => ({
      number,
      title,
      correct: MAIN_SECTION_SAMPLE_CORRECT[index] ?? 0,
    })),
  },
  mini: {
    name: "Participant - 2024-01-01 - Mini",
    testType: "Mini",
    status: "Completed",
    totalQuestions: 10,
    totalCorrect: 8,
    totalScore: 8,
  },
};

function deepFreeze(object) {
  Object.freeze(object);

  Object.getOwnPropertyNames(object).forEach((prop) => {
    const value = object[prop];
    if (
      value &&
      (typeof value === "object" || typeof value === "function") &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value);
    }
  });

  return object;
}

deepFreeze(SALESFORCE_PAYLOAD_MOCKS);

/**
 * result object shape:
 * {
 *   name: "Teja - 2025-11-10 - Main",
 *   testType: "Main" or "Mini",
 *   status: "Completed",
 *   totalQuestions: 180,
 *   totalCorrect: 152,
 *   totalScore: 152,            // optional; if missing we use totalCorrect
 *   sections: [                 // for Main; omit for Mini
 *     { number: 1, title: "Apex Basics", correct: 9 },
 *     { number: 2, title: "Triggers",    correct: 8 },
 *     ...
 *   ]
 * }
 */
function normalizeNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeStatus(status) {
  if (typeof status === "string") {
    const trimmed = status.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  return "Completed";
}

async function postQuizAttemptToSalesforce(result = {}) {
  try {
    const name = typeof result.name === "string" ? result.name.trim() : result.name;
    const testTypeRaw = typeof result.testType === "string" ? result.testType.trim() : "";
    const totalQuestions = normalizeNumber(result.totalQuestions);
    const totalCorrect = normalizeNumber(result.totalCorrect);
    let totalScore = normalizeNumber(result.totalScore);

    if (!name || !testTypeRaw || totalQuestions === undefined || totalCorrect === undefined) {
      console.error("Quiz post error: missing required fields", {
        name,
        testType: result.testType,
        totalQuestions: result.totalQuestions,
        totalCorrect: result.totalCorrect,
      });
      showToast("Error sending score to Salesforce.");
      return;
    }

    if (totalScore === undefined) {
      totalScore = totalCorrect;
    }

    const payload = {
      name,
      testType: testTypeRaw,
      status: normalizeStatus(result.status),
      totalQuestions,
      totalCorrect,
      totalScore,
    };

    const isMainQuiz = testTypeRaw.toLowerCase() === "main";

    // Only send sections when it is a Main test
    if (isMainQuiz) {
      const normalizedSections = Array.isArray(result.sections)
        ? result.sections.map((sec, idx) => {
            const sectionNumber = normalizeNumber(sec.number);
            const resolvedNumber =
              sectionNumber === undefined ? idx + 1 : sectionNumber;
            const sectionCorrect = normalizeNumber(sec.correct);
            const trimmedTitle =
              typeof sec.title === "string" ? sec.title.trim() : "";

            return {
              number: resolvedNumber,
              title:
                trimmedTitle ||
                MAIN_SECTION_TITLE_MAP.get(resolvedNumber) ||
                `Section ${resolvedNumber}`,
              correct: sectionCorrect === undefined ? 0 : sectionCorrect,
            };
          })
        : [];

      const sectionsByNumber = new Map();
      normalizedSections.forEach((section) => {
        const key = section.number;
        if (!Number.isFinite(key)) {
          return;
        }

        const existing = sectionsByNumber.get(key);
        if (existing) {
          sectionsByNumber.set(key, {
            number: key,
            title: section.title || existing.title,
            correct: (existing.correct || 0) + (section.correct || 0),
          });
        } else {
          sectionsByNumber.set(key, section);
        }
      });

      const paddedSections = MAIN_QUIZ_SECTIONS.map(({ number, title }) => {
        const provided = sectionsByNumber.get(number);
        return {
          number,
          title:
            (provided && provided.title) !== undefined && provided.title !== ""
              ? provided.title
              : title,
          correct: provided ? provided.correct : 0,
        };
      });

      const extraSections = [];
      sectionsByNumber.forEach((section, number) => {
        if (!MAIN_SECTION_TITLE_MAP.has(number)) {
          extraSections.push(section);
        }
      });
      extraSections.sort((a, b) => a.number - b.number);

      payload.sections = paddedSections.concat(extraSections);
    }

    const res = await fetch(QUIZ_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Your Apex returns JSON like: { success, message, recordId }
    const data = await res.json().catch(() => null);

    if (!res.ok || !data || !data.success) {
      console.error("Quiz post error:", res.status, data);
      showToast("Error sending score to Salesforce.");
      return;
    }

    console.log("Quiz attempt posted:", data);
    showToast("Score saved to Salesforce!");
    return data;
  } catch (err) {
    console.error("Quiz post exception:", err);
    showToast("Error sending score to Salesforce.");
  }
}

function cloneMockPayload(payload) {
  return JSON.parse(JSON.stringify(payload));
}

function getSalesforceQuizMockPayload(testType = "Main") {
  const normalizedType =
    typeof testType === "string" ? testType.trim().toLowerCase() : "";

  const source =
    normalizedType === "mini"
      ? SALESFORCE_PAYLOAD_MOCKS.mini
      : SALESFORCE_PAYLOAD_MOCKS.main;

  return cloneMockPayload(source);
}

// expose helper for quiz scripts to call after computing a result object
// e.g. window.postQuizAttemptToSalesforce({
//   name: "Participant - 2024-01-01 - Main",
//   testType: "Main",
//   totalQuestions: 180,
//   totalCorrect: 150,
//   sections: [...]
// });
window.postQuizAttemptToSalesforce = postQuizAttemptToSalesforce;
window.getSalesforceQuizMockPayload = getSalesforceQuizMockPayload;
window.salesforceQuizPayloadMocks = {
  main: cloneMockPayload(SALESFORCE_PAYLOAD_MOCKS.main),
  mini: cloneMockPayload(SALESFORCE_PAYLOAD_MOCKS.mini),
};

// slider function for cards
/* === Testimonials slider logic === */
function scrollTestimonials(direction) {
  const container = document.querySelector(
    ".testimonials-wrapper .testimonials-list"
  );
  const card = container.querySelector(".testimonials-item");
  if (!container || !card) return;

  const gap = parseFloat(getComputedStyle(container).gap || 0);
  const cardWidth = card.getBoundingClientRect().width;
  const scrollAmount = cardWidth + gap;

  container.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth",
  });
}

function updateArrowVisibilityTestimonials() {
  const container = document.querySelector(
    ".testimonials-wrapper .testimonials-list"
  );
  const prevBtn = document.querySelector(".testimonial-nav-btn.left");
  const nextBtn = document.querySelector(".testimonial-nav-btn.right");

  prevBtn.style.visibility = container.scrollLeft <= 0 ? "hidden" : "visible";

  nextBtn.style.visibility =
    container.scrollLeft + container.clientWidth >= container.scrollWidth - 1
      ? "hidden"
      : "visible";
}

/* === Certifications slider logic === */
function scrollCertifications(direction) {
  const container = document.querySelector(
    ".certificate-wrapper .certificate-list"
  );
  const card = container.querySelector(".certificate-item"); // finds any card
  if (!container || !card) return;

  const gap = parseFloat(getComputedStyle(container).gap || 0);
  const cardWidth = card.getBoundingClientRect().width;
  const scrollAmount = cardWidth + gap;

  container.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth",
  });
}

function updateArrowVisibilityCertificates() {
  const container = document.querySelector(
    ".certificate-wrapper .certificate-list"
  );
  const prevBtn = document.querySelector(".certificate-nav-btn.left");
  const nextBtn = document.querySelector(".certificate-nav-btn.right");

  prevBtn.style.visibility = container.scrollLeft <= 0 ? "hidden" : "visible";

  nextBtn.style.visibility =
    container.scrollLeft + container.clientWidth >= container.scrollWidth - 1
      ? "hidden"
      : "visible";
}

/* === Attach event listeners on DOM ready === */
document.addEventListener("DOMContentLoaded", () => {
  // Testimonials
  updateArrowVisibilityTestimonials();
  const testimonialsContainer = document.querySelector(
    ".testimonials-wrapper .testimonials-list"
  );
  testimonialsContainer.addEventListener(
    "scroll",
    updateArrowVisibilityTestimonials
  );
  document
    .querySelector(".testimonial-nav-btn.left")
    .addEventListener("click", () => scrollTestimonials(-1));
  document
    .querySelector(".testimonial-nav-btn.right")
    .addEventListener("click", () => scrollTestimonials(1));

  // Certifications
  updateArrowVisibilityCertificates();
  const certificateContainer = document.querySelector(
    ".certificate-wrapper .certificate-list"
  );
  certificateContainer.addEventListener(
    "scroll",
    updateArrowVisibilityCertificates
  );
  document
    .querySelector(".certificate-nav-btn.left")
    .addEventListener("click", () => scrollCertifications(-1));
  document
    .querySelector(".certificate-nav-btn.right")
    .addEventListener("click", () => scrollCertifications(1));
});

// feedback fetch and modal logic
(function(){
  const API_URL = 'https://teja-adusumilli-dev-ed.my.salesforce-sites.com/services/apexrest/FeedbackAPI/'; // update if needed
  const container = document.getElementById('feedbackContainer');
  const modal = document.getElementById('feedbackModal');
  const modalPanel = modal.querySelector('.modal-panel');
  const avatarEl = document.getElementById('modal-avatar');
  const nameEl = document.getElementById('modal-name');
  const emailEl = document.getElementById('modal-email');
  const commentEl = document.getElementById('modal-comment');
  const closeBtn = modal.querySelector('.modal-close-btn');
  const SHOW_CLASS = 'show';
  const FALLBACK_AVATAR = './assets/images/avatar-1.png';

  // minimal escaping
  function esc(s){ return String(s==null?'':s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

  // choose avatar field fallback chain
  function chooseAvatar(entry){
    return entry.AvatarUrl || entry.PhotoURL__c || entry.Picture__c || entry.avatar || FALLBACK_AVATAR;
  }

  // Render cards
  function renderCards(list){
    if(!Array.isArray(list) || list.length===0){
      container.innerHTML = '<div class="no-feedback">No feedback found.</div>';
      return;
    }
    const html = list.map(e=>{
      const name = e.Name || e.name || 'Anonymous';
      const comment = e.Comments__c || e.Comment__c || e.Comment || e.comment || 'No comment provided.';
      const email = e.Email__c || e.Email || e.email || '';
      const avatar = chooseAvatar(e);
      // use data-* attributes (escaped)
      return `
        <div class="feedback-card" role="button" tabindex="0"
             data-avatar="${esc(avatar)}"
             data-name="${esc(name)}"
             data-email="${esc(email)}"
             data-comment="${esc(comment)}">
          <img loading="lazy" src="${esc(avatar)}" alt="${esc(name)} avatar" width="48" height="48">
          <div class="feedback-content">
            <div class="feedback-name">${esc(name)}</div>
            <div class="feedback-email">${esc(email)}</div>
            <div class="feedback-comment">${esc(comment)}</div>
          </div>
        </div>
      `;
    }).join('');
    container.innerHTML = html;
  }

  // fetch data
  async function loadFeedback(){
    try{
      container.innerHTML = '<div class="loading">Loading feedback…</div>';
      const res = await fetch(API_URL, { cache: 'no-store' });
      if(!res.ok) throw new Error('Network not ok: ' + res.status);
      const data = await res.json();
      renderCards(data);
    }catch(err){
      console.error('Feedback load failed', err);
      container.innerHTML = '<div class="error">Error loading feedback.</div>';
    }
  }

  // read data from card
  function readCardData(card){
    return {
      avatar: card.dataset.avatar || card.querySelector('img')?.src || FALLBACK_AVATAR,
      name: card.dataset.name || card.querySelector('.feedback-name')?.textContent || 'Anonymous',
      email: card.dataset.email || card.querySelector('.feedback-email')?.textContent || '',
      comment: card.dataset.comment || card.querySelector('.feedback-comment')?.textContent || ''
    };
  }

  // open modal
  function openModalWithData(data){
    avatarEl.src = data.avatar || FALLBACK_AVATAR;
    avatarEl.alt = data.name || 'Avatar';
    nameEl.textContent = data.name || '';
    emailEl.textContent = data.email || '';
    commentEl.textContent = data.comment || '';

    modal.classList.add(SHOW_CLASS);
    modal.setAttribute('aria-hidden','false');

    // prevent body scroll
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // focus the panel for screen reader / keyboard
    modalPanel.focus();
  }

  function closeModal(){
    modal.classList.remove(SHOW_CLASS);
    modal.setAttribute('aria-hidden','true');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  // delegation handlers
  function attachDelegation(){
    container.addEventListener('click', (e)=>{
      const card = e.target.closest('.feedback-card');
      if(!card) return;
      const data = readCardData(card);
      openModalWithData(data);
    });
    container.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        const card = e.target.closest('.feedback-card');
        if(!card) return;
        e.preventDefault();
        const data = readCardData(card);
        openModalWithData(data);
      }
    });
  }

  // modal handlers
  function attachModalHandlers(){
    // close button
    closeBtn.addEventListener('click', closeModal);

    // backdrop: only close when clicking outside panel (i.e. on .modal-backdrop)
    modal.addEventListener('click', (e)=>{
      // if clicked directly on backdrop (not inside panel), close
      if(e.target.classList.contains('modal-backdrop')) closeModal();
    });

    // ESC to close
    window.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && modal.classList.contains(SHOW_CLASS)) closeModal();
    });

    // trap focus a little: shift+tab/ tab cycle - simple approach
    modalPanel.addEventListener('keydown', (e)=>{
      if(e.key === 'Tab'){
        // if only one focusable element (closeBtn), let it handle naturally
        // For brevity we won't implement a full focus trap here; but focusing panel helps.
      }
    });
  }

  // init
  document.addEventListener('DOMContentLoaded', ()=>{
    loadFeedback();
    attachDelegation();
    attachModalHandlers();
  });

  // export for debugging if needed
  window._feedback = { loadFeedback, openModalWithData, closeModal };
})();

