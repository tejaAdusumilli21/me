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
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
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
    const targetPage = this.innerHTML.toLowerCase();
    pages.forEach((page) => {
      if (page.dataset.page === targetPage) {
        page.classList.add("active");
        link.classList.add("active");
        window.scrollTo(0, 0);
      } else {
        page.classList.remove("active");
        navigationLinks.forEach((navLink) => {
          if (navLink !== link) navLink.classList.remove("active");
        });
      }
    });
  });
});

// ======================
// Feedback API Configuration
// ======================
const FEEDBACK_API_URL = "https://teja-adusumilli-dev-ed.my.salesforce-sites.com/services/apexrest/FeedbackAPI/";

// create feedback form request
document.addEventListener("DOMContentLoaded", function () {
  const feedbackForm = document.getElementById("feedbackForm");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      try {
        console.log('[Feedback] Submitting to Salesforce:', data);
        const response = await fetch(FEEDBACK_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('[Feedback] Success:', result);
          showToast('Feedback submitted successfully!');
          e.target.reset();
        } else {
          const errorText = await response.text();
          console.error('[Feedback] Error:', response.status, errorText);
          showToast('Failed to submit feedback. Please try again.');
        }
      } catch (error) {
        console.error('[Feedback] Error submitting feedback:', error);
        showToast('An error occurred. Please try again later.');
      }
    });
  }
});

// toast message
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) {
    console.warn('Toast element not found');
    return;
  }
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
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });

  return object;
}

deepFreeze(SALESFORCE_PAYLOAD_MOCKS);

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
    if (trimmed) return trimmed;
  }

  return "Completed";
}

async function postQuizAttemptToSalesforce(result = {}) {
  try {
    const payload = {
      name: result.name || "Anonymous - Unknown",
      testType: result.testType || "Main",
      status: normalizeStatus(result.status),
      totalQuestions: normalizeNumber(result.totalQuestions) ?? 0,
      totalCorrect: normalizeNumber(result.totalCorrect) ?? 0,
      totalScore: normalizeNumber(result.totalScore ?? result.totalCorrect) ?? 0,
    };

    if (Array.isArray(result.sections) && result.sections.length > 0) {
      payload.sections = result.sections.map((s) => ({
        number: normalizeNumber(s.number) ?? 0,
        title: s.title || "Unknown Section",
        correct: normalizeNumber(s.correct) ?? 0,
      }));
    }

    console.log("[postQuizAttemptToSalesforce] Payload:", payload);

    const response = await fetch(QUIZ_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[postQuizAttemptToSalesforce] HTTP ${response.status}: ${errorText}`
      );
      throw new Error(`Salesforce API returned ${response.status}`);
    }

    const responseData = await response.json();
    console.log("[postQuizAttemptToSalesforce] Success:", responseData);
    return responseData;
  } catch (err) {
    console.error("[postQuizAttemptToSalesforce] Error:", err);
    throw err;
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

// Quiz section visibility toggle
function toggleQuizSections(mode) {
  const quizButtons = document.querySelector('.quiz-buttons');
  const quizBlock = document.querySelector('.quiz-block');
  const quizRoot = document.getElementById('quiz-root');
  const miniQuizRoot = document.getElementById('mini-quiz-root');

  if (mode === 'full') {
    // Show main quiz, hide buttons
    if (quizButtons) quizButtons.style.display = 'none';
    if (quizBlock) quizBlock.style.display = 'block';
    if (quizRoot) quizRoot.style.display = 'block';
    if (miniQuizRoot) miniQuizRoot.style.display = 'none';
  } else if (mode === 'mini') {
    // Show mini quiz, hide buttons
    if (quizButtons) quizButtons.style.display = 'none';
    if (quizBlock) quizBlock.style.display = 'block';
    if (quizRoot) quizRoot.style.display = 'none';
    if (miniQuizRoot) miniQuizRoot.style.display = 'block';
  } else if (mode === 'exit') {
    // Show buttons, hide both quizzes
    if (quizButtons) quizButtons.style.display = 'flex';
    if (quizBlock) quizBlock.style.display = 'none';
    if (quizRoot) quizRoot.style.display = 'none';
    if (miniQuizRoot) miniQuizRoot.style.display = 'none';
  }
}

// Expose globally
window.toggleQuizSections = toggleQuizSections;
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

  if (!container || !prevBtn || !nextBtn) return;

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
  const card = container.querySelector(".certificate-item");
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

  if (!container || !prevBtn || !nextBtn) return;

  prevBtn.style.visibility = container.scrollLeft <= 0 ? "hidden" : "visible";

  nextBtn.style.visibility =
    container.scrollLeft + container.clientWidth >= container.scrollWidth - 1
      ? "hidden"
      : "visible";
}

/* === Attach event listeners on DOM ready === */
document.addEventListener("DOMContentLoaded", () => {
  // Testimonials
  const testimonialsContainer = document.querySelector(
    ".testimonials-wrapper .testimonials-list"
  );
  if (testimonialsContainer) {
    updateArrowVisibilityTestimonials();
    testimonialsContainer.addEventListener(
      "scroll",
      updateArrowVisibilityTestimonials
    );
  }
  
  const testimonialLeftBtn = document.querySelector(".testimonial-nav-btn.left");
  const testimonialRightBtn = document.querySelector(".testimonial-nav-btn.right");
  if (testimonialLeftBtn) {
    testimonialLeftBtn.addEventListener("click", () => scrollTestimonials(-1));
  }
  if (testimonialRightBtn) {
    testimonialRightBtn.addEventListener("click", () => scrollTestimonials(1));
  }

  // Certifications
  const certificateContainer = document.querySelector(
    ".certificate-wrapper .certificate-list"
  );
  if (certificateContainer) {
    updateArrowVisibilityCertificates();
    certificateContainer.addEventListener(
      "scroll",
      updateArrowVisibilityCertificates
    );
  }
  
  const certLeftBtn = document.querySelector(".certificate-nav-btn.left");
  const certRightBtn = document.querySelector(".certificate-nav-btn.right");
  if (certLeftBtn) {
    certLeftBtn.addEventListener("click", () => scrollCertifications(-1));
  }
  if (certRightBtn) {
    certRightBtn.addEventListener("click", () => scrollCertifications(1));
  }
});

// feedback fetch and modal logic
(function() {
  // Your feedback modal implementation here
  console.log('Feedback module initialized');
})();