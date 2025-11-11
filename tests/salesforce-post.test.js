const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const scriptPath = path.join(__dirname, '..', 'assets', 'js', 'script.js');
const source = fs.readFileSync(scriptPath, 'utf8');

const start = source.indexOf('const QUIZ_API_URL');
const endMarker = 'window.salesforceQuizPayloadMocks = {';
const end = source.indexOf(endMarker);
if (start === -1 || end === -1) {
  throw new Error('Unable to locate Salesforce helper in script.js');
}

const endOfMocksAssignment = source.indexOf('};', end);
const snippet = source.slice(start, endOfMocksAssignment + 2);

const context = {
  fetchCalls: [],
  toastMessages: [],
  fetch: async (url, options) => {
    context.fetchCalls.push({ url, options });
    return {
      ok: true,
      json: async () => ({ success: true, message: 'Saved', recordId: '001xx000003NG9PAAW' }),
    };
  },
  showToast: message => {
    context.toastMessages.push(message);
  },
  console,
  window: {},
};

vm.createContext(context);
vm.runInContext(snippet, context);

async function run() {
  const DEFAULT_MAIN_SECTIONS = [
    { number: 1, title: 'Apex Fundamentals & OOP Concepts' },
    { number: 2, title: 'Salesforce Triggers' },
    { number: 3, title: 'Asynchronous Apex' },
    { number: 4, title: 'Lightning Web Components' },
    { number: 5, title: 'Aura Components & Migration to LWC' },
    { number: 6, title: 'Visualforce' },
    { number: 7, title: 'SOQL & SOSL' },
    { number: 8, title: 'Integration' },
    { number: 9, title: 'OmniStudio' },
    { number: 10, title: 'Sales Cloud' },
    { number: 11, title: 'Service Cloud' },
    { number: 12, title: 'Experience Cloud' },
    { number: 13, title: 'Security & Sharing' },
    { number: 14, title: 'Deployment & DevOps' },
    { number: 15, title: 'Governor Limits & Performance Tuning' },
    { number: 16, title: 'Testing' },
    { number: 17, title: 'Design Patterns & Frameworks' },
    { number: 18, title: 'Advanced Topics' },
  ];
  const SAMPLE_MAIN_SECTION_CORRECT = [
    9, 8, 9, 8, 7, 8, 9, 8, 9, 8, 8, 8, 8, 8, 8, 9, 9, 9,
  ];
  const normalizeFromVm = value => JSON.parse(JSON.stringify(value));

  // Mini quiz payload should omit sections and respect provided status.
  context.fetchCalls = [];
  context.toastMessages = [];
  await context.postQuizAttemptToSalesforce({
    name: 'Tester - Mini',
    testType: 'Mini',
    status: 'Completed',
    totalQuestions: 5,
    totalCorrect: 4,
    totalScore: 4,
  });

  assert.strictEqual(context.fetchCalls.length, 1, 'Mini quiz should trigger one fetch call');
  const miniCall = context.fetchCalls[0];
  assert.strictEqual(
    miniCall.url,
    'https://teja-adusumilli-dev-ed.my.salesforce-sites.com/services/apexrest/QuizAttemptAPI/',
    'Mini quiz should post to QuizAttemptAPI endpoint',
  );
  assert.strictEqual(miniCall.options.method, 'POST', 'Mini quiz should POST results');
  const miniPayload = JSON.parse(miniCall.options.body);
  assert.deepStrictEqual(
    miniPayload,
    {
      name: 'Tester - Mini',
      testType: 'Mini',
      status: 'Completed',
      totalQuestions: 5,
      totalCorrect: 4,
      totalScore: 4,
    },
    'Mini quiz payload should match expected shape',
  );
  assert.deepStrictEqual(context.toastMessages, ['Score saved to Salesforce!'], 'Mini quiz should show success toast');

  // Main quiz payload should include derived sections and default status when omitted.
  context.fetchCalls = [];
  context.toastMessages = [];
  await context.postQuizAttemptToSalesforce({
    name: 'Tester - Main',
    testType: 'Main',
    totalQuestions: 10,
    totalCorrect: 7,
    sections: [
      { number: 1, title: 'Apex', correct: 4 },
      { title: 'LWC', correct: 3 },
    ],
  });

  assert.strictEqual(context.fetchCalls.length, 1, 'Main quiz should trigger one fetch call');
  const mainCall = context.fetchCalls[0];
  const mainPayload = JSON.parse(mainCall.options.body);
  const expectedSections = DEFAULT_MAIN_SECTIONS.map(section => ({
    number: section.number,
    title: section.title,
    correct: 0,
  }));
  expectedSections[0] = { number: 1, title: 'Apex', correct: 4 };
  expectedSections[1] = { number: 2, title: 'LWC', correct: 3 };

  assert.deepStrictEqual(
    mainPayload,
    {
      name: 'Tester - Main',
      testType: 'Main',
      status: 'Completed',
      totalQuestions: 10,
      totalCorrect: 7,
      totalScore: 7,
      sections: expectedSections,
    },
    'Main quiz payload should include section breakdown and derived score',
  );
  assert.strictEqual(mainPayload.sections.length, 18, 'Main payload should list all 18 sections');
  assert.deepStrictEqual(context.toastMessages, ['Score saved to Salesforce!'], 'Main quiz should show success toast');

  const expectedMainMockPayload = {
    name: 'Participant - 2024-01-01 - Main',
    testType: 'Main',
    status: 'Completed',
    totalQuestions: 180,
    totalCorrect: 150,
    totalScore: 150,
    sections: DEFAULT_MAIN_SECTIONS.map((section, index) => ({
      number: section.number,
      title: section.title,
      correct: SAMPLE_MAIN_SECTION_CORRECT[index],
    })),
  };
  const expectedMiniMockPayload = {
    name: 'Participant - 2024-01-01 - Mini',
    testType: 'Mini',
    status: 'Completed',
    totalQuestions: 10,
    totalCorrect: 8,
    totalScore: 8,
  };

  assert.deepStrictEqual(
    normalizeFromVm(context.window.salesforceQuizPayloadMocks),
    {
      main: expectedMainMockPayload,
      mini: expectedMiniMockPayload,
    },
    'Static Salesforce mocks should be exposed on the window object',
  );

  const mockMain = normalizeFromVm(context.getSalesforceQuizMockPayload('Main'));
  assert.deepStrictEqual(
    mockMain,
    expectedMainMockPayload,
    'Main mock helper should provide canonical payload',
  );

  mockMain.sections[0].correct = 0;
  const clonedMain = context.getSalesforceQuizMockPayload('main');
  assert.strictEqual(
    clonedMain.sections[0].correct,
    9,
    'Mock helper should return a fresh clone each time',
  );

  const mockMini = normalizeFromVm(context.getSalesforceQuizMockPayload('Mini'));
  assert.deepStrictEqual(
    mockMini,
    expectedMiniMockPayload,
    'Mini mock helper should provide canonical payload',
  );

  const defaultMock = normalizeFromVm(context.getSalesforceQuizMockPayload());
  assert.deepStrictEqual(
    defaultMock,
    expectedMainMockPayload,
    'Mock helper should default to main payload when no type is provided',
  );

  // Ensure helper is exposed on window for browser usage.
  assert.strictEqual(
    context.window.postQuizAttemptToSalesforce,
    context.postQuizAttemptToSalesforce,
    'Helper should be attached to window object',
  );

  console.log('All Salesforce submission tests passed.');
}

run().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
