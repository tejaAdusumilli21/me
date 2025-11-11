const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const scriptPath = path.join(__dirname, '..', 'assets', 'js', 'script.js');
const source = fs.readFileSync(scriptPath, 'utf8');

const start = source.indexOf('const QUIZ_API_URL');
const endMarker = 'window.postQuizAttemptToSalesforce = postQuizAttemptToSalesforce;';
const end = source.indexOf(endMarker);
if (start === -1 || end === -1) {
  throw new Error('Unable to locate Salesforce helper in script.js');
}

const snippet = source.slice(start, end + endMarker.length);

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
  assert.deepStrictEqual(
    mainPayload,
    {
      name: 'Tester - Main',
      testType: 'Main',
      status: 'Completed',
      totalQuestions: 10,
      totalCorrect: 7,
      totalScore: 7,
      sections: [
        { number: 1, title: 'Apex', correct: 4 },
        { number: 2, title: 'LWC', correct: 3 },
      ],
    },
    'Main quiz payload should include section breakdown and derived score',
  );
  assert.deepStrictEqual(context.toastMessages, ['Score saved to Salesforce!'], 'Main quiz should show success toast');

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
