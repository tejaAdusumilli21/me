/* ── Shared popup engine for all character pages ── */

const TOPIC_DATA = {

  /* ══════════════════════════════════════════
     ASTRO — Trailhead / Learning / Explorer
  ══════════════════════════════════════════ */
  "sf-data-model": {
    tag: "🗂️ Platform Fundamentals",
    title: "Salesforce Data Model",
    body: "The <strong>Salesforce Data Model</strong> is the backbone of every org — it defines the objects (tables), fields (columns), and relationships that store your business data. Standard objects like Account, Contact, Opportunity, and Case come out of the box. Custom objects let you model anything unique to your business. Understanding the data model is the first thing any Trailblazer learns.",
    tips: ["Objects are like database tables — records are rows, fields are columns","Standard objects (Account, Contact, Lead) are pre-built by Salesforce","Custom objects let you model any business data not covered by standard objects","Relationships (Lookup, Master-Detail) connect objects to each other"],
    link: "https://trailhead.salesforce.com/content/learn/modules/data_modeling"
  },
  "object-relationships": {
    tag: "🔗 Data Modeling",
    title: "Object Relationships",
    body: "<strong>Lookup</strong> relationships are loose links between objects — like a Contact linked to an Account. <strong>Master-Detail</strong> is a tight parent-child bond — the child record can't exist without the parent, and you can create rollup summary fields on the parent. <strong>Many-to-Many</strong> relationships are modelled with a junction object that has two Master-Detail relationships.",
    tips: ["Master-Detail: child is deleted when parent is deleted — use carefully","Lookup: child survives parent deletion — safer for optional relationships","Rollup Summary fields (COUNT, SUM, MIN, MAX) only work on Master-Detail","You can have up to 2 Master-Detail relationships per object"],
    link: "https://trailhead.salesforce.com/content/learn/modules/data_modeling/object_relationships"
  },
  "sf-setup-nav": {
    tag: "🧭 Admin Basics",
    title: "Salesforce Setup Navigation",
    body: "Setup is the <strong>admin and developer control panel</strong> of every Salesforce org. Access it via the gear icon (⚙️) in the top right. The Quick Find box is your best friend — type any feature name to jump straight to it. Setup is divided into sections: Administration (users, data), Platform Tools (apps, objects, flows), and Company Settings.",
    tips: ["Use Quick Find to jump to any Setup page instantly — don't browse menus","App Manager controls which Lightning apps exist in the org","Object Manager is where you create and edit custom objects and fields","Setup audit trail logs every configuration change — useful for debugging"],
    link: "https://trailhead.salesforce.com/content/learn/modules/lex_customization"
  },
  "trailhead-superbadges": {
    tag: "🏆 Learning",
    title: "Trailhead Superbadges",
    body: "<strong>Superbadges</strong> are advanced, hands-on Trailhead challenges that require you to build real solutions in a real Salesforce org — no multiple choice, no guided steps. They validate that you can apply knowledge independently, not just recall it. Many employers look for specific superbadges as proof of practical skill. Popular ones include Apex Specialist, Process Automation Specialist, and Business Administration Specialist.",
    tips: ["Superbadges are unguided — you must figure out the implementation yourself","They use real orgs (Trailhead Playgrounds) — not simulations","Great interview talking points — employers recognise them","Complete the prerequisite modules and badges before attempting a superbadge"],
    link: "https://trailhead.salesforce.com/superbadges"
  },
  "release-notes": {
    tag: "📋 Platform Currency",
    title: "Release Note Reading",
    body: "Salesforce releases updates <strong>three times a year</strong> — Spring, Summer, and Winter — each adding 200+ features. The Release Notes document every change: new features, behaviour changes, and deprecations. Staying current with release notes is what separates a reactive admin/developer from a proactive one. Features often go through Pilot → Beta → Generally Available across multiple releases.",
    tips: ["Filter release notes by cloud (Sales, Service, Platform) to avoid overwhelm","Look for 'Critical Updates' — these can break existing behaviour if not tested","Test new features in Sandbox before they auto-enable in Production","Subscribe to the Salesforce Release Readiness blog for curated summaries"],
    link: "https://trailhead.salesforce.com/content/learn/modules/sf_releases"
  },
  "sandbox-vs-prod": {
    tag: "🧪 Environments",
    title: "Sandbox vs Production Strategy",
    body: "<strong>Never build directly in Production.</strong> Sandboxes are isolated copies of your org used for development, testing, and training. Changes in a sandbox never affect live data. The golden rule: Dev Sandbox → UAT Sandbox → Production. Each type (Developer, Developer Pro, Partial Copy, Full Copy) has different data volumes and refresh cycles suited to different stages of work.",
    tips: ["Developer Sandbox: free, no data, refreshes in minutes — use for daily dev work","Full Copy: exact clone of Production including data — use for final UAT","Refresh a sandbox to reset it — but this overwrites all customisations in it","Establish a deployment pipeline before going live — don't wing it"],
    link: "https://trailhead.salesforce.com/content/learn/modules/application-lifecycle-and-development-models"
  },
  "appexchange": {
    tag: "🛒 Platform",
    title: "AppExchange Evaluation",
    body: "<strong>AppExchange</strong> is Salesforce's marketplace of pre-built apps, components, and solutions — over 7,000 listings. Instead of building from scratch, you can often install a managed package that solves a common problem in minutes. Apps range from free utilities to enterprise CPQ solutions. Evaluating and managing AppExchange packages is a core admin skill.",
    tips: ["Always test managed packages in a Sandbox first — they can't always be uninstalled cleanly","Check the 'Security Review' badge — all AppExchange apps pass Salesforce security review","Managed packages get automatic upgrades from the vendor — read upgrade notes","Unmanaged packages give you the code to modify but no vendor support"],
    link: "https://trailhead.salesforce.com/content/learn/modules/appexchange_basics"
  },
  "admin-cert-astro": {
    tag: "🏅 Certification",
    title: "Salesforce Administrator Certification",
    body: "The <strong>Salesforce Certified Administrator</strong> credential is the foundational certification for the platform. It proves you can configure and manage a Salesforce org: security, automation, data, reports. I hold this credential — it was my starting point before Developer certs. 60 questions, 65% to pass, annual renewal via Trailhead maintenance module.",
    tips: ["Focus on Security & Access (20%), Automation (18%), Data Management (11%)","Admin Beginner + Admin Intermediate Trailhead trails are the core prep path","Practise with Focus on Force or Salesforce Ben exam guides","Renew annually or your credential goes inactive — takes ~1hr on Trailhead"],
    link: "https://trailhead.salesforce.com/credentials/administrator"
  },
  "reports-dashboards-astro": {
    tag: "📊 Analytics",
    title: "Reports & Dashboards",
    body: "<strong>Reports</strong> are structured queries over Salesforce data — tabular, summary, matrix, or joined. <strong>Dashboards</strong> visualise report data as charts, gauges, and metrics on a single screen. Every business stakeholder needs them. A good Salesforce professional can build a self-refreshing executive dashboard that eliminates manual data exports entirely.",
    tips: ["Summary or Matrix reports are needed to use data in dashboard components","The Running User on a dashboard determines whose data security applies","Schedule dashboard email delivery to stakeholders — no manual effort","Dynamic Dashboards let each user see their own data (up to 5 per org)"],
    link: "https://trailhead.salesforce.com/content/learn/modules/reports_dashboards"
  },
  "trailblazer-community": {
    tag: "🌍 Community",
    title: "Trailblazer Community",
    body: "The <strong>Trailblazer Community</strong> is Salesforce's official online forum — hundreds of thousands of members sharing solutions, answering questions, and discussing best practices. It's where you post when you're stuck, where you find known issues, and where the Salesforce product teams sometimes answer directly. Stack Overflow for Salesforce, essentially.",
    tips: ["Search before posting — most common issues are already answered","Include your org edition, API version, and error message in questions","Earn community points by helping others — it's noticed by employers","Local User Groups and Dreamforce Community Days are extensions of this"],
    link: "https://trailhead.salesforce.com/trailblazer-community"
  },
  "continuous-learning": {
    tag: "🚀 Mindset",
    title: "Continuous Learning Habit",
    body: "Salesforce releases <strong>three major updates per year</strong>. A skill that was cutting-edge 18 months ago might be deprecated today. The professionals who stay relevant are those who dedicate even 30 minutes a week to Trailhead, release notes, or community content. Astro's entire persona is built around this: curious, always exploring, never static.",
    tips: ["Set a weekly Trailhead goal — even one unit per week compounds over a year","Follow Salesforce Admins and Salesforce Developers on YouTube","Attend virtual Salesforce events — Dreamforce, TrailheaDX, World Tours","Badge streaks on Trailhead are a fun way to build the daily habit"],
    link: "https://trailhead.salesforce.com"
  },

  /* ══════════════════════════════════════════
     CODEY — Development / Apex / LWC
  ══════════════════════════════════════════ */
  "apex-classes": {
    tag: "⚡ Core Dev",
    title: "Apex Classes & Triggers",
    body: "<strong>Apex</strong> is Salesforce's proprietary Java-like programming language that runs on the Force.com platform. <strong>Classes</strong> contain reusable business logic. <strong>Triggers</strong> execute Apex code before or after DML operations (insert, update, delete) on records. The golden rule: one trigger per object, all logic in handler classes — never in the trigger itself.",
    tips: ["One trigger per object — use a handler class for all logic","with sharing enforces record-level security in Apex — always use it","Apex runs in system mode by default — be explicit about sharing model","Triggers have context variables: Trigger.new, Trigger.old, Trigger.isInsert etc."],
    link: "https://trailhead.salesforce.com/content/learn/modules/apex_triggers"
  },
  "lwc": {
    tag: "🖥️ Frontend",
    title: "Lightning Web Components (LWC)",
    body: "<strong>LWC</strong> is Salesforce's modern UI framework built on web standards — HTML, JavaScript, CSS. Components are reusable, testable, and composable. They replace the older Aura framework for new development. LWC uses a reactive data binding model: when `@track` or `@api` properties change, the template re-renders automatically.",
    tips: ["@api exposes properties to parent components or App Builder","@wire connects components to Salesforce data without manual Apex calls","Use the Lightning Data Service (LDS) for simple CRUD — no Apex needed","Always handle errors from wire adapters and imperative Apex calls"],
    link: "https://trailhead.salesforce.com/content/learn/modules/lightning-web-components-basics"
  },
  "aura": {
    tag: "🖥️ Frontend (Legacy)",
    title: "Aura Components",
    body: "<strong>Aura</strong> is Salesforce's older component framework, still used for features not yet available in LWC — like Lightning App Builder dynamic forms and some utility bar items. Aura uses a different event system and syntax to LWC. New development should use LWC, but understanding Aura is essential for maintaining existing orgs and migrating legacy components.",
    tips: ["Aura uses component events and application events instead of DOM events","{!v.propertyName} is Aura's binding syntax — different from LWC's {propertyName}","Aura and LWC components can coexist — LWC components can be embedded in Aura","Salesforce is gradually feature-parity-ing LWC — migrate Aura components over time"],
    link: "https://trailhead.salesforce.com/content/learn/modules/lex_dev_lc_basics"
  },
  "visualforce": {
    tag: "📄 Legacy UI",
    title: "Visualforce Pages",
    body: "<strong>Visualforce</strong> is Salesforce's original page-building framework using a tag-based markup language similar to HTML. While largely superseded by LWC, Visualforce is still used for PDF generation, email templates, and legacy custom UIs in Classic orgs. Understanding it is necessary for maintaining older implementations and migrating to modern Lightning components.",
    tips: ["Visualforce uses <apex:*> tags and controllers written in Apex","Still the best option for generating PDF documents via renderAs='pdf'","Standard and custom controllers connect page to Apex logic","PageReference is used for navigation and redirects in controllers"],
    link: "https://trailhead.salesforce.com/content/learn/modules/visualforce_fundamentals"
  },
  "soql-sosl": {
    tag: "🔍 Data Queries",
    title: "SOQL & SOSL",
    body: "<strong>SOQL</strong> (Salesforce Object Query Language) is like SQL for Salesforce — used to query specific objects and fields. <strong>SOSL</strong> (Salesforce Object Search Language) searches across multiple objects simultaneously — better for search features. The biggest rule: <strong>never put SOQL inside a loop</strong> — this is the #1 governor limit violation and the first thing code reviewers check.",
    tips: ["NEVER write SOQL inside a for loop — always query before the loop","Use selective queries with indexed fields (Id, Name, External ID) for large objects","SOSL searches across multiple objects — use for search features, not data retrieval","Aggregate functions: COUNT(), SUM(), MAX(), MIN(), AVG() — no loop needed"],
    link: "https://trailhead.salesforce.com/content/learn/modules/apex_database"
  },
  "batch-apex": {
    tag: "⚙️ Async Apex",
    title: "Batch Apex",
    body: "<strong>Batch Apex</strong> processes large datasets — millions of records — by splitting them into manageable chunks (default 200 per batch). Implements `Database.Batchable` with three methods: `start()` returns the records to process, `execute()` processes each chunk, `finish()` runs after all chunks complete. Each chunk runs in its own transaction with fresh governor limits.",
    tips: ["Each batch chunk gets fresh governor limits — great for large data volumes","Default batch size is 200 — tune it based on complexity of execute() logic","Use finish() to send notification emails or chain another batch/queueable","Don't call a batch from a trigger unless you can guarantee the trigger won't fire more than 5 times concurrently"],
    link: "https://trailhead.salesforce.com/content/learn/modules/asynchronous_apex/async_apex_batch"
  },
  "queueable-apex": {
    tag: "⚙️ Async Apex",
    title: "Queueable Apex",
    body: "<strong>Queueable Apex</strong> is the recommended async pattern for most use cases — a step up from Future methods with key advantages: accepts non-primitive types (sObjects), returns a job ID for monitoring, and supports job chaining. Implement `Queueable` and enqueue with `System.enqueueJob(new MyJob())`. Use it when you need to offload processing from a trigger without needing Batch's chunking.",
    tips: ["Prefer Queueable over @future for new code — more powerful and monitorable","Chain jobs by calling System.enqueueJob() inside execute() — no hard limit in production","Maximum 1 chained job per transaction in synchronous context","Monitor jobs via AsyncApexJob — check Status, NumberOfErrors, CompletedDate"],
    link: "https://trailhead.salesforce.com/content/learn/modules/asynchronous_apex/async_apex_queueable"
  },
  "schedulable-apex": {
    tag: "⚙️ Async Apex",
    title: "Schedulable Apex",
    body: "<strong>Schedulable Apex</strong> runs Apex classes on a defined schedule — like a cron job. Implement the `Schedulable` interface and schedule via Setup (Apex Scheduler) or programmatically with `System.schedule()`. Commonly used to kick off Batch jobs nightly, send scheduled emails, or run periodic data maintenance. Uses a CRON expression to define timing.",
    tips: ["Use System.schedule() programmatically or Schedule Apex in Setup UI","Cron expression format: Seconds Minutes Hours Day Month Weekday Year","A common pattern: Scheduled Apex → kicks off Batch Apex → finish() sends report","Maximum 100 scheduled jobs per org — monitor and clean up stale schedules"],
    link: "https://trailhead.salesforce.com/content/learn/modules/asynchronous_apex/async_apex_scheduled"
  },
  "future-methods": {
    tag: "⚙️ Async Apex",
    title: "Future Methods",
    body: "<strong>Future methods</strong> (`@future`) run asynchronously in a separate thread — primarily used for making HTTP callouts from triggers (which can't do callouts synchronously) or for mixed DML operations. They're the simplest async pattern but the most limited: only accept primitive parameters, can't be chained, and can't be called from other future methods.",
    tips: ["@future(callout=true) is the only way to make HTTP callouts from a trigger context","Only primitive parameters allowed — pass record IDs, not sObjects","Can't call a @future from another @future — use Queueable for chaining","Prefer Queueable over @future for all new async code — it's strictly better"],
    link: "https://trailhead.salesforce.com/content/learn/modules/asynchronous_apex/async_apex_future_methods"
  },
  "rest-api-callouts": {
    tag: "🔌 Integration",
    title: "REST API Callouts",
    body: "<strong>Callouts</strong> are Apex HTTP requests to external systems — REST APIs, webhooks, third-party services. Use `Http`, `HttpRequest`, and `HttpResponse` classes. Authentication is managed via <strong>Named Credentials</strong> (store secrets securely in Salesforce, not in code). Callouts can't be made from synchronous trigger context — use `@future(callout=true)` or Queueable.",
    tips: ["Never hardcode API keys in Apex — use Named Credentials or Custom Metadata","Always handle HTTP status codes — don't assume 200","Set timeouts: default is 10 seconds, max is 120 seconds per callout","Mock callouts in tests with HttpCalloutMock — callouts are disabled in test context"],
    link: "https://trailhead.salesforce.com/content/learn/modules/apex_integration_services/apex_integration_webservices"
  },
  "soap-integration": {
    tag: "🔌 Integration",
    title: "SOAP Integration",
    body: "<strong>SOAP</strong> (Simple Object Access Protocol) is the older XML-based web service standard, still common in enterprise integrations — banking, ERP systems, legacy middleware. Salesforce supports consuming SOAP services by generating Apex stub classes from a WSDL file. You can also expose Apex classes as SOAP web services for external systems to call.",
    tips: ["Generate Apex stub from WSDL via Setup > Apex Classes > Generate from WSDL","SOAP responses are XML — Salesforce auto-deserialises them into Apex objects","Exposing Apex as SOAP: use global class with webService static methods","REST is preferred for new integrations — use SOAP only when the endpoint requires it"],
    link: "https://trailhead.salesforce.com/content/learn/modules/apex_integration_services/apex_integration_soap_callouts"
  },
  "named-credentials": {
    tag: "🔐 Security",
    title: "Named Credentials",
    body: "<strong>Named Credentials</strong> store endpoint URLs and authentication details (OAuth tokens, API keys, username/password) securely in Salesforce — keeping secrets out of Apex code entirely. Reference them in callouts as `callout:MyCredential/endpoint`. They support OAuth 2.0 flows, Basic Auth, JWT, and custom auth providers, and handle token refresh automatically.",
    tips: ["Never hardcode credentials in Apex — Named Credentials is the right pattern","They handle OAuth token refresh automatically — no manual token management","External Credentials (newer model) separate the endpoint from the auth — more flexible","Use Permission Sets to control which users can use which Named Credentials"],
    link: "https://trailhead.salesforce.com/content/learn/modules/named-credentials"
  },
  "custom-metadata": {
    tag: "⚙️ Configuration",
    title: "Custom Metadata Types",
    body: "<strong>Custom Metadata Types</strong> are like custom objects, but their records are metadata — deployable, packageable, and accessible in Apex without SOQL governor limits. Use them to store configuration values that vary by environment (URLs, thresholds, feature flags) rather than hardcoding in Apex or using Custom Settings. They're the modern replacement for many Custom Setting use cases.",
    tips: ["CMT records are deployable via Change Sets and SFDX — Custom Setting data is not","Access in Apex: MyConfig__mdt.getInstance('RecordName') — no SOQL query counted","Editable in Production without a deployment — great for business-controlled config","Use for feature flags, threshold values, routing rules, and environment-specific URLs"],
    link: "https://trailhead.salesforce.com/content/learn/modules/custom_metadata_types_dec"
  },
  "test-classes": {
    tag: "✅ Quality",
    title: "Test Classes & Mocking",
    body: "Salesforce requires <strong>75% code coverage</strong> to deploy Apex to Production — but real quality comes from tests that validate logic, not just execute lines. Use `@testSetup` for shared test data, `Test.startTest()`/`Test.stopTest()` to reset limits and flush async jobs, `TestDataFactory` for reusable record creation, and `HttpCalloutMock` to simulate external API responses in tests.",
    tips: ["75% coverage is the floor, not the goal — aim for 90%+ with meaningful assertions","System.assert(), System.assertEquals(), System.assertNotEquals() are your tools","Mock callouts with HttpCalloutMock — real callouts are blocked in test context","Test bulk scenarios: always test with 200 records to ensure no governor limit violations"],
    link: "https://trailhead.salesforce.com/content/learn/modules/apex_testing"
  },
  "governor-limits": {
    tag: "📏 Platform Rules",
    title: "Governor Limits",
    body: "<strong>Governor Limits</strong> are Salesforce's hard caps on resource usage per transaction — 100 SOQL queries, 150 DML statements, 10MB heap, 6MB per callout, 10 seconds CPU time. They exist because Salesforce is a multi-tenant platform — one badly written piece of code can't monopolise shared resources. Hitting a limit throws a `LimitException` and rolls back the entire transaction.",
    tips: ["Most violations come from SOQL or DML inside loops — bulkify everything","Use Limits.getQueries() and Limits.getDmlStatements() to monitor usage in code","Design for 200 records minimum — Salesforce processes triggers in batches of 200","System.LimitException can't be caught — design to avoid, not recover"],
    link: "https://trailhead.salesforce.com/content/learn/modules/apex_basics_dotnet/limits_and_collections"
  },
  "trigger-frameworks": {
    tag: "🏗️ Architecture",
    title: "Trigger Frameworks",
    body: "A <strong>Trigger Framework</strong> enforces the one-trigger-per-object pattern and separates trigger context from business logic. Common patterns: TDTMGate, Apex Trigger Action Framework, fflib. The trigger file is just a router — it calls a handler class that contains the actual logic. This prevents recursive firing, makes testing easier, and lets multiple developers work on the same object without conflicts.",
    tips: ["Trigger file should have zero business logic — just call the handler","Use a static Boolean flag or a recursion prevention utility to stop recursive triggers","Handler classes should be called from the trigger, not from other code","Popular frameworks: Kevin O'Hara's trigger framework, fflib, AT4DX"],
    link: "https://trailhead.salesforce.com/content/learn/modules/apex_triggers/apex_triggers_bulk"
  },
  "pd1-cert": {
    tag: "🏅 Certification",
    title: "Platform Developer I & II",
    body: "<strong>Platform Developer I</strong> validates core Apex and LWC development skills — the most important developer certification for Salesforce. <strong>Platform Developer II</strong> is the advanced credential covering complex design patterns, integration architecture, and performance optimisation. I hold both. PD1 is the entry point for any serious Salesforce developer.",
    tips: ["PD1 covers: Apex basics, LWC, SOQL, testing, triggers, governor limits","PD2 requires passing PD1 first — it's significantly harder with scenario-based questions","Trailhead's 'Developer Beginner' and 'Developer Intermediate' trails are the prep path","PD2 tests your architecture knowledge, not just syntax — practise with complex scenarios"],
    link: "https://trailhead.salesforce.com/credentials/platformdeveloperi"
  },
  "js-cert": {
    tag: "🏅 Certification",
    title: "JavaScript Developer I Certification",
    body: "The <strong>Salesforce Certified JavaScript Developer I</strong> validates modern JavaScript knowledge — ES6+, modules, promises, async/await, testing, and web APIs. This credential shows you can build production-quality LWC components. It's particularly valued because it tests language proficiency rather than just platform configuration. I hold this certification.",
    tips: ["Covers ES6+: arrow functions, destructuring, spread, template literals, classes","Promises and async/await are heavily tested — understand the event loop","Module systems (import/export) and scope (let/const/var) are core topics","Jest testing and DOM manipulation are also in scope — practise writing unit tests"],
    link: "https://trailhead.salesforce.com/credentials/javascriptdeveloperi"
  },
  "sfdx-cli": {
    tag: "🛠️ Dev Tools",
    title: "SFDX CLI & VS Code",
    body: "The <strong>Salesforce CLI (SFDX)</strong> is the command-line tool for modern Salesforce development — create orgs, push/pull metadata, run tests, and deploy from the terminal. Paired with the <strong>Salesforce Extension Pack for VS Code</strong>, it provides IntelliSense for Apex and LWC, inline test execution, and org management. This replaces the older Force.com IDE entirely.",
    tips: ["sf org create scratch creates a fresh scratch org in seconds","sf project deploy start pushes local metadata to your org","Scratch orgs expire in 1–30 days — great for isolated feature development","The Salesforce Extension Pack gives Apex syntax highlighting and completion in VS Code"],
    link: "https://trailhead.salesforce.com/content/learn/modules/sfdx_app_dev"
  },

  /* ══════════════════════════════════════════
     EINSTEIN — AI / Analytics
  ══════════════════════════════════════════ */
  "einstein-prediction": {
    tag: "🤖 AI Feature",
    title: "Einstein Prediction Builder",
    body: "<strong>Einstein Prediction Builder</strong> is a no-code AI tool that builds custom predictive models on your Salesforce data — no data science background required. Define what you want to predict (e.g. 'Will this lead convert?'), choose the fields to train on, and Einstein trains a model and scores every record automatically. Results appear as a field on the record.",
    tips: ["Needs enough historical data to train on — minimum ~400 records with known outcomes","The model scores each record and shows a prediction + top factors influencing the score","Retrain the model periodically as your data changes","Prediction scores can be used in reports, flows, and process automation"],
    link: "https://trailhead.salesforce.com/content/learn/modules/einstein-prediction-builder"
  },
  "einstein-copilot": {
    tag: "🤖 Generative AI",
    title: "Einstein Copilot",
    body: "<strong>Einstein Copilot</strong> is Salesforce's conversational AI assistant embedded in the CRM. Users can ask it questions and give it instructions in natural language — 'Summarise this account', 'Draft a follow-up email', 'Show me open cases for this contact'. Copilot uses your org's data and actions to respond, protected by the Einstein Trust Layer.",
    tips: ["Einstein Copilot uses RAG (Retrieval Augmented Generation) grounded in your org data","Actions define what Copilot can do — you control which actions are enabled","The Trust Layer masks PII before it reaches the LLM — data never leaves Salesforce for training","Custom Copilot Actions can be built with Prompt Builder and Apex"],
    link: "https://trailhead.salesforce.com/content/learn/modules/einstein-copilot"
  },
  "prompt-builder": {
    tag: "✍️ Generative AI",
    title: "Prompt Builder",
    body: "<strong>Prompt Builder</strong> lets admins and developers create templated AI prompts that are grounded in real Salesforce data. Instead of asking an LLM a generic question, you craft a prompt template that pulls in live record fields, related data, and user context — then Einstein generates a personalised response. No coding required for basic templates.",
    tips: ["Prompt templates reference Salesforce fields using merge fields — like email templates","Templates are connected to a specific object and record type","Test prompts in Preview mode before deploying to users","Advanced templates can call Apex or Flow for richer data context"],
    link: "https://trailhead.salesforce.com/content/learn/modules/prompt-builder"
  },
  "trust-layer": {
    tag: "🛡️ Responsible AI",
    title: "Einstein Trust Layer",
    body: "The <strong>Einstein Trust Layer</strong> is Salesforce's framework for safe, responsible generative AI. It sits between your org and the LLM provider — masking personally identifiable information (PII) in prompts, preventing data from being used for AI model training, logging all AI interactions for auditing, and applying content toxicity detection. It's built into every Einstein Copilot and Prompt Builder interaction.",
    tips: ["PII masking replaces sensitive data with tokens before the LLM sees it — and restores them after","Zero data retention: prompts and responses aren't stored by the LLM provider","Audit Trail logs every AI interaction — who asked what, when","You control which users and profiles can access Einstein features via permissions"],
    link: "https://trailhead.salesforce.com/content/learn/modules/responsible-ai-salesforce"
  },
  "next-best-action": {
    tag: "🤖 AI Feature",
    title: "Einstein Next Best Action",
    body: "<strong>Einstein Next Best Action</strong> surfaces contextual recommendations to users inside Salesforce records — 'Offer this discount', 'Escalate this case', 'Send a renewal email'. You define recommendation strategies (using Flow or SOQL filters) that determine which recommendation to show and when. It appears as a component on Lightning pages, visible only when conditions are met.",
    tips: ["Recommendation strategies can use Einstein Prediction scores as criteria","A/B test different recommendations and track acceptance rates","Actions can trigger Flows when a user accepts a recommendation","Works with Sales Cloud (Opportunity records) and Service Cloud (Case records)"],
    link: "https://trailhead.salesforce.com/content/learn/modules/einstein-next-best-action"
  },
  "crm-analytics": {
    tag: "📊 Analytics",
    title: "CRM Analytics (Tableau CRM)",
    body: "<strong>CRM Analytics</strong> (formerly Einstein Analytics / Tableau CRM) is Salesforce's advanced analytics platform — going far beyond standard Reports and Dashboards. It supports multi-object datasets, predictive KPIs, AI-powered insights, and embedded analytics directly inside Lightning Record pages. Analysts build 'lenses' and 'dashboards' with a drag-and-drop designer, powered by a proprietary SAQL query language.",
    tips: ["Datasets are pre-aggregated snapshots of Salesforce data — not live queries","SAQL (Salesforce Analytics Query Language) powers complex analytical queries","Embedded analytics: surface CRM Analytics dashboards inside Lightning Record pages","Requires a CRM Analytics licence — separate from standard Salesforce licences"],
    link: "https://trailhead.salesforce.com/content/learn/modules/wave_exploration_analytics_basics"
  },
  "ai-associate-cert": {
    tag: "🏅 Certification",
    title: "AI Associate Certification",
    body: "The <strong>Salesforce Certified AI Associate</strong> is the foundational AI credential — validating understanding of AI concepts, Salesforce's ethical AI principles, and how Einstein features work. It's designed for anyone in the Salesforce ecosystem who works with or alongside AI features, not just developers. I hold this certification — one of the first wave.",
    tips: ["Covers: AI fundamentals, ethical AI, Einstein features overview, Trust Layer","No coding required — suitable for admins, consultants, and business users","60 minutes, 40 questions — focused on concepts and responsible AI","Renew annually on Trailhead — new AI features are added to scope each year"],
    link: "https://trailhead.salesforce.com/credentials/ai-associate"
  },
  "ai-specialist-cert": {
    tag: "🏅 Certification",
    title: "AI Specialist Certification",
    body: "The <strong>Salesforce Certified AI Specialist</strong> is the advanced AI credential — validating hands-on ability to implement Einstein Copilot, Prompt Builder, Einstein Next Best Action, and Model Builder. It goes beyond concepts into actual configuration. I hold this certification. It's one of the most current credentials Salesforce offers, covering the latest generative AI tooling.",
    tips: ["Covers: Copilot setup, Prompt Builder templates, Einstein NBA, Model Builder","Requires understanding of the Einstein Trust Layer in depth","Hands-on practice in a real Salesforce org is essential — not just reading","The exam tests implementation, not just theory — configure features before sitting it"],
    link: "https://trailhead.salesforce.com/credentials/ai-specialist"
  },
  "responsible-ai": {
    tag: "⚖️ Ethics",
    title: "Responsible AI Principles",
    body: "Salesforce's <strong>Trusted AI Principles</strong> define how AI should be built and used responsibly: Accurate, Safe, Honest, Empowering, Sustainable, and Inclusive. In practice this means: detecting and mitigating bias in training data, being transparent about AI-generated content, giving users control over AI decisions, and never using customer data to train models without consent.",
    tips: ["Bias can enter AI at data collection, model training, or output interpretation stage","Salesforce's 'Responsible AI Practice' team reviews all Einstein features before release","Transparency: AI-generated content in Salesforce is labelled as AI-generated","Review the Salesforce Ethical AI blog — it's cited in the AI Associate exam"],
    link: "https://trailhead.salesforce.com/content/learn/modules/responsible-ai-salesforce"
  },
  "data-governance": {
    tag: "🗃️ Data",
    title: "Data Governance for AI",
    body: "<strong>Data Governance</strong> for AI means ensuring the data powering your AI models is complete, accurate, and compliant. Poor data quality produces unreliable AI outputs. Governance covers: defining who owns what data, enforcing data standards, managing consent and privacy (GDPR, CCPA), and maintaining a data dictionary. In Salesforce, this often means cleaning org data before enabling any Einstein feature.",
    tips: ["AI is only as good as the data it trains on — 'garbage in, garbage out'","Audit field completion rates before enabling prediction models","GDPR/CCPA compliance affects what data can be used to train AI models","Salesforce Data Mask helps anonymise sensitive data in sandbox environments"],
    link: "https://trailhead.salesforce.com/content/learn/modules/data-quality"
  },
  "llm-grounding": {
    tag: "🧠 AI Concepts",
    title: "Grounding & RAG Concepts",
    body: "<strong>Grounding</strong> means giving an LLM relevant, specific context alongside a question — so it answers based on real data rather than hallucinating. <strong>RAG (Retrieval Augmented Generation)</strong> is the technical implementation: retrieve relevant documents or records, inject them into the prompt, then generate a response grounded in that retrieved content. Salesforce Einstein uses RAG via Prompt Builder and Data Cloud.",
    tips: ["Without grounding, LLMs answer generically — with it, answers are specific to your data","Prompt Builder implements grounding by injecting Salesforce record fields into prompts","Data Cloud enables semantic search grounding — find relevant content by meaning, not keywords","Hallucination risk drops significantly when prompts are well-grounded in real data"],
    link: "https://trailhead.salesforce.com/content/learn/modules/large-language-models"
  },

  /* ══════════════════════════════════════════
     APPY — Declarative / Flow / App Builder
  ══════════════════════════════════════════ */
  "flow-builder": {
    tag: "⚡ Automation",
    title: "Flow Builder (All Types)",
    body: "<strong>Flow Builder</strong> is Salesforce's primary automation tool — replacing Process Builder and Workflow Rules. There are five flow types: <strong>Record-Triggered</strong> (fires on DML), <strong>Scheduled</strong> (runs on a schedule), <strong>Screen</strong> (guided user wizard), <strong>Autolaunched</strong> (called from Apex or other flows), and <strong>Platform Event-Triggered</strong>. Most automation problems have a Flow solution before needing Apex.",
    tips: ["Flows now replace Process Builder and Workflow Rules — migrate legacy automation","Use Before-Save flows for field updates — much faster than After-Save","Screen flows replace Visualforce wizards for guided user processes","Subflows allow you to call one flow from another — reuse logic across flows"],
    link: "https://trailhead.salesforce.com/content/learn/modules/flow-builder"
  },
  "lightning-app-builder": {
    tag: "📱 UI Builder",
    title: "Lightning App Builder",
    body: "<strong>Lightning App Builder</strong> is the drag-and-drop tool for building Lightning pages — Home, Record, and App pages. Drop standard or custom components onto the canvas, configure them with property panels, assign pages to specific profiles, record types, and form factors (desktop/mobile). No code required for standard layouts; custom components built in LWC appear here automatically.",
    tips: ["Assign different Lightning pages to different profiles — tailor the UX per role","Dynamic Forms allow field visibility rules directly on the page — no page layout needed","Dynamic Actions show/hide buttons based on field values or user criteria","App Builder components must have a design file to be configurable in the builder"],
    link: "https://trailhead.salesforce.com/content/learn/modules/lightning_app_builder"
  },
  "dynamic-forms": {
    tag: "📋 UI",
    title: "Dynamic Forms",
    body: "<strong>Dynamic Forms</strong> move field display logic OUT of page layouts and INTO Lightning App Builder — so you can show/hide fields and sections based on field values, user criteria, or device type directly on the Lightning Record page. This eliminates the need to create multiple page layouts for different scenarios and makes the UI far more contextual.",
    tips: ["Dynamic Forms only work on custom objects and select standard objects (Account, Contact, Opportunity, Case)","Visibility rules use AND/OR logic across multiple field conditions","Fields in Dynamic Forms respect Field-Level Security — hidden fields aren't just invisible","Migrating from page layout to Dynamic Forms: use the 'Upgrade' button in App Builder"],
    link: "https://trailhead.salesforce.com/content/learn/modules/lightning_app_builder/lightning_app_builder_dynamic"
  },
  "dynamic-actions": {
    tag: "🎯 UI",
    title: "Dynamic Actions",
    body: "<strong>Dynamic Actions</strong> control which buttons and quick actions appear on a record page based on conditions — field values, profiles, form factors. Instead of showing every action to every user all the time, you surface only what's relevant: 'Convert' only appears on unqualified leads, 'Escalate' only appears on open cases, 'Close Won' only appears when Stage is 'Proposal/Quote'.",
    tips: ["Dynamic Actions replace static action sections on page layouts","Conditions use AND/OR logic across field values and user attributes","Only available on Lightning Record Pages configured in App Builder","Works with Quick Actions, Global Actions, and standard platform actions"],
    link: "https://trailhead.salesforce.com/content/learn/modules/lightning_app_builder"
  },
  "custom-objects-fields": {
    tag: "🗂️ Data Modeling",
    title: "Custom Objects & Fields",
    body: "<strong>Custom Objects</strong> extend Salesforce's standard data model to capture business-specific data. Create them in Object Manager with a few clicks. <strong>Custom Fields</strong> add columns to any object — Text, Number, Date, Picklist, Checkbox, Formula, Lookup, and more. Good object design upfront saves enormous rework later — get the data model right before building automation on top of it.",
    tips: ["Field API Names can't be changed after creation — choose them carefully","Formula fields calculate values dynamically — no storage, always current","Picklist fields are better than free-text for values that should be controlled","External IDs allow upsert operations in Data Loader and API integrations"],
    link: "https://trailhead.salesforce.com/content/learn/modules/data_modeling"
  },
  "validation-rules": {
    tag: "✅ Data Quality",
    title: "Validation Rules",
    body: "<strong>Validation Rules</strong> enforce data quality by preventing records from being saved when conditions aren't met. They use a formula that returns TRUE when the data is invalid — then display an error message. They fire before triggers, before workflows, and before flows — making them the first line of data quality defence.",
    tips: ["Formula returns TRUE when data is INVALID — the opposite of what you might expect","Use ISNULL() and ISBLANK() carefully — they behave differently for text vs other field types","Bypass validation rules with a custom bypass permission — useful for data migrations","Cross-object formulas work in validation rules — check related record fields"],
    link: "https://trailhead.salesforce.com/content/learn/modules/point_click_business_logic/validation_rules"
  },
  "formula-fields": {
    tag: "🧮 Data",
    title: "Formula Fields",
    body: "<strong>Formula Fields</strong> calculate values dynamically using other fields, constants, and functions — no storage, always up to date. Use them for: displaying full name (FirstName & ' ' & LastName), calculating age from birthdate, showing days since last activity, or flagging records based on field conditions. They support text, number, date, boolean, and currency output types.",
    tips: ["Formula fields are read-only — they can't be edited directly","Cross-object formulas can reference parent record fields (up to 5 levels up)","Rollup Summary fields aggregate child records — different from formula fields","TEXT(), VALUE(), DATEVALUE() convert between data types in formulas"],
    link: "https://trailhead.salesforce.com/content/learn/modules/point_click_business_logic/formula_fields"
  },
  "rollup-summary": {
    tag: "🧮 Data",
    title: "Rollup Summary Fields",
    body: "<strong>Rollup Summary Fields</strong> aggregate values from child records onto a parent record — COUNT, SUM, MIN, MAX. They only work on Master-Detail relationships. Common uses: total Opportunity amount on Account, count of open Cases, earliest Activity date. They update automatically when child records change — no Apex or Flow needed.",
    tips: ["Only available on Master-Detail parent objects — not Lookup relationships","Operations: COUNT (any child), SUM (numeric), MIN, MAX (numeric or date)","Filter criteria lets you rollup only specific child records (e.g. only closed Opportunities)","Cross-object rollups aren't supported natively — use Apex Triggers instead"],
    link: "https://trailhead.salesforce.com/content/learn/modules/point_click_business_logic/rollup_summary_fields"
  },
  "record-types": {
    tag: "🏷️ Configuration",
    title: "Record Types",
    body: "<strong>Record Types</strong> allow different business processes, page layouts, and picklist values for different subsets of records on the same object. Example: a Lead object might have 'Inbound' and 'Outbound' record types — each with different required fields, different page layouts, and different stages. Users are assigned access to record types via their Profile.",
    tips: ["Record Types control: page layouts, picklist values, and business processes","Assign record types to profiles — users see only the types they're assigned","Each record type can have a different page layout per profile","Default record type is used when a record is created without an explicit type selection"],
    link: "https://trailhead.salesforce.com/content/learn/modules/lex_customization/lex_customization_record_types"
  },
  "app-builder-cert": {
    tag: "🏅 Certification",
    title: "Platform App Builder Certification",
    body: "The <strong>Salesforce Certified Platform App Builder</strong> validates skill in building custom applications declaratively — custom objects, fields, relationships, validation rules, flows, and Lightning pages. It proves you can solve real business problems without code. I hold this certification. It's the ideal credential for someone who bridges admin and developer roles.",
    tips: ["Covers: Data Modeling (23%), Business Logic (28%), User Interface (24%), Deployment (10%)","Flow Builder questions are increasingly prominent — know all 5 flow types","Dynamic Forms and Dynamic Actions are tested — practise in a Developer org","Trailhead 'App Builder' trail is the primary prep resource"],
    link: "https://trailhead.salesforce.com/credentials/platformappbuilder"
  },

  /* ══════════════════════════════════════════
     ASTRO EXTRA PILLS
  ══════════════════════════════════════════ */
  "app-manager": {
    tag: "📱 Setup",
    title: "App Manager & Lightning Apps",
    body: "<strong>App Manager</strong> in Setup is where you create, edit, and manage Lightning apps and connected apps. Lightning apps group tabs, utility items, and navigation items for specific user roles. Connected Apps enable OAuth authentication for external systems and mobile apps connecting to your Salesforce org.",
    tips: ["Lightning apps control the tab bar and utility bar for each user group","Each app can have different branding, navigation items, and utility bar actions","Connected Apps are needed for any external system using OAuth to access Salesforce","Restrict connected app access by IP or require MFA for sensitive integrations"],
    link: "https://trailhead.salesforce.com/content/learn/modules/lex_customization/lex_customization_apps"
  },
  "schema-builder": {
    tag: "🗺️ Data Modeling",
    title: "Schema Builder",
    body: "<strong>Schema Builder</strong> is a visual tool in Setup that shows all objects and their relationships as a connected diagram — like an entity-relationship (ER) diagram for your Salesforce org. You can create new objects and fields directly from Schema Builder and see how everything connects at a glance. Essential for understanding or documenting a complex data model.",
    tips: ["Filter displayed objects to reduce clutter — large orgs have hundreds of objects","Click any field to see its API name, data type, and properties","Create new objects and fields without leaving the visual diagram","Use it to explain data models to non-technical stakeholders — the visual is intuitive"],
    link: "https://trailhead.salesforce.com/content/learn/modules/data_modeling/schema_builder"
  },
  "curiosity-mindset": {
    tag: "🚀 Mindset",
    title: "Curiosity-First Problem Solving",
    body: "Astro's defining trait is <strong>curiosity before conclusions</strong> — exploring possibilities before settling on a solution. In Salesforce development, this means: searching Trailhead and the Trailblazer Community before writing code, checking whether a Flow can solve the problem before writing Apex, reading about a feature in a Sandbox before deploying to Production, and asking 'why?' before asking 'how?'",
    tips: ["'Declarative first, code when needed' saves enormous maintenance burden","Reproduce issues in a Sandbox before debugging in Production","Read the error message fully before Googling — it often contains the exact fix","Ask on the Trailblazer Community before spending hours on a problem — it's probably answered"],
    link: "https://trailhead.salesforce.com/trailblazer-community"
  },
  "dreamforce": {
    tag: "🌍 Community",
    title: "Dreamforce Sessions",
    body: "<strong>Dreamforce</strong> is the world's largest software conference, hosted annually by Salesforce in San Francisco. It features hundreds of product deep-dives, hands-on labs, certification prep sessions, and community networking. Even if you can't attend in person, Salesforce+ streams most sessions free online. Attending (virtually or physically) keeps you 6–12 months ahead of what's commonly known in the market.",
    tips: ["Salesforce+ streams Dreamforce content live and on-demand — free to watch","Product announcements at Dreamforce preview features coming in the next 1–2 releases","Lab sessions are hands-on — great for trying new features before they're generally available","Community keynotes and Trailblazer stories are as valuable as the product sessions"],
    link: "https://www.salesforce.com/dreamforce/"
  },

  /* ══════════════════════════════════════════
     RUTH — Admin / Security / Data Management
  ══════════════════════════════════════════ */
  "owd": {
    tag: "🔒 Security Layer 1",
    title: "Org-Wide Defaults (OWD)",
    body: "OWD is the <strong>baseline record-access level</strong> for every object in your org — it answers: 'What's the minimum access a user should have to records they don't own?' Set it to the most restrictive level first, then open access back up using Role Hierarchy, Sharing Rules, and Manual Sharing. Options are <strong>Private, Public Read Only, Public Read/Write</strong>, and Controlled by Parent.",
    tips: ["Always start with Private — open access upward, never restrict downward","OWD can never grant more access than the user's Object Permissions allow","Changing OWD triggers a sharing recalculation — plan for downtime on large orgs","External OWD can be set separately for portal/Experience Cloud users"],
    link: "https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_records"
  },
  "role-hierarchy": {
    tag: "🏗️ Security Layer 2",
    title: "Role Hierarchy",
    body: "The Role Hierarchy mirrors your company's reporting structure. Users at <strong>higher roles see all records owned by roles below them</strong> — automatically, without sharing rules. A sales manager can see all their reps' Opportunities. A VP sees everything under all managers. It only applies when OWD is set to Private or Public Read Only.",
    tips: ["Roles control record visibility — Profiles control what users can do","Higher roles inherit record access downward — not upward","A user must be assigned a role for the hierarchy to affect their record access","Roles are optional but essential for orgs with manager oversight requirements"],
    link: "https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_roles"
  },
  "profiles-permsets": {
    tag: "👤 Access Control",
    title: "Profiles vs Permission Sets",
    body: "Every user gets <strong>exactly one Profile</strong> — it sets the baseline: which objects they can access, which system permissions they have, and login settings. <strong>Permission Sets</strong> extend that access without changing the profile — think of them as add-ons. A 'Sales User' profile + a 'Delete Leads' permission set gives the user both the baseline and the extra power.",
    tips: ["Profile = what a user CAN do at baseline. Permission Set = extra powers on top","Salesforce recommends moving permissions OUT of profiles and INTO Permission Sets","One profile per user — but unlimited permission sets can be stacked","Permission Set Groups let you assign a bundle of sets at once — much cleaner"],
    link: "https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_objects"
  },
  "sharing-rules": {
    tag: "🔓 Security Layer 3",
    title: "Sharing Rules",
    body: "<strong>Sharing Rules automatically extend record access</strong> beyond what OWD and Role Hierarchy provide. You define criteria (based on record owner or field values) and Salesforce automatically shares matching records with a specific group or role. Example: 'Share all Opportunities owned by the West Region role with the East Region role at Read Only access.'",
    tips: ["Sharing Rules can only open access UP — never restrict below OWD","Two types: Owner-based (who owns them) and Criteria-based (field values)","Sharing Rules run automatically — no manual work needed after setup","Use Manual Sharing for one-off exceptions outside of rule-based sharing"],
    link: "https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_sharing_rules"
  },
  "fls": {
    tag: "🔬 Field Security",
    title: "Field-Level Security (FLS)",
    body: "<strong>Field-Level Security controls which fields are visible and editable</strong> for each profile or permission set — independently of record access. A user might be able to see an Account record but not the Annual Revenue field. FLS is set per object per field, for each profile. It's the finest-grained access control in Salesforce and applies everywhere: page layouts, APIs, reports.",
    tips: ["FLS overrides page layouts — if FLS hides a field, adding it to a layout won't show it","Set FLS on both Profile AND Permission Sets — they're additive","The 'View All Fields' permission bypasses FLS for all fields on that object","Always test FLS by logging in as the target user, not just checking settings"],
    link: "https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_fields"
  },
  "user-mgmt": {
    tag: "👥 Administration",
    title: "User Management",
    body: "Every person who logs into Salesforce is a <strong>User record</strong> with a username, email, profile, role, and license. As an admin, you create users, reset passwords, assign licenses, deactivate leavers, and audit who has access to what. The Users page in Setup is your control room — you can also freeze a user instantly if their account is compromised.",
    tips: ["Deactivate don't delete — deleted users break record history and ownership","Each username must be unique across ALL Salesforce orgs globally","Freeze a user immediately to block login while you investigate — faster than deactivating","License types determine which features are available — assign the right one from day one"],
    link: "https://trailhead.salesforce.com/content/learn/modules/lex_implementation_user_setup_mgmt/lex_implementation_user_setup_mgmt_adding_users-hoc"
  },
  "login-restrictions": {
    tag: "🕐 Access Control",
    title: "Login Hours & IP Restrictions",
    body: "<strong>Login Hours</strong> restrict when users can log in — e.g. 9am–6pm Mon–Fri only. <strong>Trusted IP Ranges</strong> restrict which IP addresses can log in without a verification challenge. Both are set on the Profile. They're powerful compliance and security controls, especially for organisations with remote access concerns or regulatory requirements.",
    tips: ["Login Hours only apply to the Salesforce UI — API access isn't restricted by login hours","If a user is logged in and Login Hours expire, they're logged out at the next page load","Trusted IPs bypass the email verification challenge — use carefully on shared networks","System Administrators are exempt from some restrictions — always test with a non-admin user"],
    link: "https://trailhead.salesforce.com/content/learn/modules/identity_login/identity_login_access"
  },
  "sso": {
    tag: "🔑 Identity",
    title: "Single Sign-On (SSO)",
    body: "<strong>SSO lets users log into Salesforce using credentials from an external identity provider</strong> (like Okta, Azure AD, or Google). Salesforce acts as a Service Provider; the identity provider authenticates the user and sends a SAML assertion back. SSO improves security, reduces friction, and makes onboarding/offboarding instant — disable the user in your IdP and Salesforce access is immediately revoked.",
    tips: ["SAML 2.0 is the most common SSO protocol used with Salesforce","Always keep at least one admin with username/password access as a break-glass account","My Domain is required before you can set up SSO in your org","Test SSO in a sandbox before enabling in production — misconfiguration locks everyone out"],
    link: "https://trailhead.salesforce.com/content/learn/modules/identity_login/identity_login_sso"
  },
  "data-loader": {
    tag: "📦 Data Tools",
    title: "Data Loader",
    body: "<strong>Data Loader is a desktop tool for importing, exporting, updating, and deleting large volumes of records</strong> — up to 5 million rows per operation. It uses CSV files and maps columns to Salesforce fields. Unlike the Import Wizard, Data Loader supports all standard and custom objects, bulk API (for speed), and can be automated via command line for scheduled operations.",
    tips: ["Use 'Upsert' with an External ID field to avoid creating duplicates on re-import","Always export a backup BEFORE running any mass update or delete","Data Loader uses Bulk API by default — switch to REST API for small loads needing immediate results","Check the success/error CSV files after every operation — partial failures are silent otherwise"],
    link: "https://trailhead.salesforce.com/content/learn/modules/data_management/data_management_data_loader"
  },
  "import-wizard": {
    tag: "📥 Data Tools",
    title: "Data Import Wizard",
    body: "The <strong>Data Import Wizard is a browser-based point-and-click tool</strong> for importing up to 50,000 records of standard objects like Contacts, Leads, Accounts, and custom objects. It has built-in duplicate detection, field mapping assistance, and is much more beginner-friendly than Data Loader. Great for admins who need occasional imports without installing a desktop tool.",
    tips: ["Limit is 50,000 records per import — use Data Loader for larger volumes","Supports Contacts, Leads, Accounts, Campaign Members, and custom objects","Duplicate matching uses your org's Duplicate Rules automatically","Map your CSV headers to Salesforce fields carefully — wrong mapping silently puts data in wrong places"],
    link: "https://trailhead.salesforce.com/content/learn/modules/data_management/data_management_import_wizard"
  },
  "duplicate-rules": {
    tag: "🔄 Data Quality",
    title: "Duplicate & Matching Rules",
    body: "<strong>Matching Rules</strong> define how Salesforce compares records to find potential duplicates — by comparing fields like Name, Email, or Phone with fuzzy or exact matching. <strong>Duplicate Rules</strong> define what happens when a match is found: Block the save, Allow with a warning, or Report the duplicate. Together they prevent dirty data from entering the org in the first place.",
    tips: ["Matching Rules run before Duplicate Rules — configure matching first","Standard matching rules exist for Leads, Contacts, Accounts — customise or create new ones","Report Action lets data in but logs duplicates — useful for auditing without disrupting users","Data Loader bypasses Duplicate Rules — bulk imports need separate dedup checks"],
    link: "https://trailhead.salesforce.com/content/learn/modules/data_quality/data_quality_duplication_rules"
  },
  "reports": {
    tag: "📊 Analytics",
    title: "Reports (All Types)",
    body: "Salesforce has <strong>four report types</strong>: Tabular (flat list, like a spreadsheet), Summary (grouped rows with subtotals), Matrix (rows AND columns grouped, like a pivot table), and Joined (multiple report blocks side by side). Reports pull from a Report Type that defines which objects and fields are available. Users can only see records they have access to — security is inherited in reports.",
    tips: ["Tabular reports can't be used in dashboards — use Summary or Matrix instead","Report Types determine which objects and fields are available — choose the right one upfront","Cross Filters let you filter by related records ('Accounts WITHOUT Opportunities')","Schedule reports to email to stakeholders automatically — eliminates manual data pulls"],
    link: "https://trailhead.salesforce.com/content/learn/modules/reports_dashboards/reports_dashboards_overview"
  },
  "dashboards": {
    tag: "📈 Analytics",
    title: "Dashboards",
    body: "<strong>Dashboards are visual displays of report data</strong> — bar charts, donut charts, gauges, metrics, tables, and funnels. Each component is sourced from one report. Dashboards have a <strong>Running User</strong> whose data access the dashboard respects. Dynamic Dashboards show each user their own data. Dashboards can be scheduled to refresh and emailed automatically.",
    tips: ["The Running User setting is critical — wrong running user = wrong data for viewers","Dynamic Dashboards show each viewer their own data — up to 5 per org","Dashboard filters let viewers slice data without changing the underlying reports","Maximum 20 components per dashboard — plan layout before building"],
    link: "https://trailhead.salesforce.com/content/learn/modules/reports_dashboards/reports_dashboards_dashboards"
  },
  "change-sets": {
    tag: "🚀 Deployment",
    title: "Change Sets",
    body: "<strong>Change Sets are the declarative way to move metadata between Salesforce orgs</strong> — from Sandbox to Production, or between sandboxes. You build an Outbound Change Set by adding components you want to deploy (Apex classes, Flows, custom fields, page layouts), upload it, then deploy via an Inbound Change Set in the target org. Requires a pre-established Deployment Connection between orgs.",
    tips: ["Always run 'Validate' before deploying — it runs all tests without committing changes","Change Sets are one-way — you can't use them to retrieve from Production","Include ALL dependencies — missing a related field or object breaks the entire deployment","SFDX / Salesforce CLI is the modern alternative for automated deployment pipelines"],
    link: "https://trailhead.salesforce.com/content/learn/modules/declarative-change-set-development"
  },
  "sandbox-mgmt": {
    tag: "🧪 Environments",
    title: "Sandbox Management",
    body: "<strong>Sandboxes are isolated copies of your Salesforce org</strong> used for development, testing, and training — changes here never affect Production. There are four types: <strong>Developer</strong> (smallest, no data), <strong>Developer Pro</strong> (more storage), <strong>Partial Copy</strong> (subset of production data), and <strong>Full Copy</strong> (complete clone including all data). Each has different refresh intervals and storage limits.",
    tips: ["Full Copy sandboxes take hours to provision — plan releases around refresh cycles","Partial Copy is ideal for UAT — real data shape without the full volume","Sandbox refresh overwrites everything — communicate clearly before refreshing a shared sandbox","Use sandbox templates to control which data is copied into Partial/Full sandboxes"],
    link: "https://trailhead.salesforce.com/content/learn/modules/application-lifecycle-and-development-models/set-up-your-workspace-and-development-process"
  },
  "admin-cert": {
    tag: "🏅 Certification",
    title: "Salesforce Certified Administrator",
    body: "The <strong>Salesforce Certified Administrator</strong> is the foundational credential for anyone managing a Salesforce org. It covers the core platform: security model, data management, automation, reports, dashboards, and sales/service processes. I hold this certification — it's the foundation everything else is built on. The exam has 60 questions and requires 65% to pass.",
    tips: ["Focus areas: Security & Access (20%), Automation (18%), Data Management (11%)","Trailhead's 'Admin Beginner' and 'Admin Intermediate' trails are the best prep","Use Focus on Force practice exams to identify weak spots before booking the real exam","Renewing is required every year — complete the maintenance module on Trailhead"],
    link: "https://trailhead.salesforce.com/credentials/administrator"
  },
  "service-cloud-cert": {
    tag: "🏅 Certification",
    title: "Service Cloud Consultant",
    body: "The <strong>Salesforce Certified Service Cloud Consultant</strong> validates expertise in implementing and configuring Service Cloud for customer service teams. It covers Cases, Entitlements, Service Console, Omni-Channel routing, Knowledge, and Contact Center analytics. It's a Consultant-level credential — one step above core Admin. I hold this certification.",
    tips: ["Requires passing the Admin exam first — it's a prerequisite in practice","Focus areas: Service Cloud Solution Design, Case Management, Knowledge Management","Entitlements and Milestones are heavily tested — understand SLA tracking deeply","Practise in a Service Cloud developer org to get hands-on before the exam"],
    link: "https://trailhead.salesforce.com/credentials/servicecloudconsultant"
  },
};

/* ── Modal Engine ── */
function initCharacterPopups() {
  const backdrop = document.getElementById('topicModal');
  if (!backdrop) return;

  const mTag   = document.getElementById('modal-tag');
  const mTitle = document.getElementById('modal-title');
  const mBody  = document.getElementById('modal-body');
  const mTips  = document.getElementById('modal-tips');
  const mLink  = document.getElementById('modal-link');

  function open(key) {
    const d = TOPIC_DATA[key];
    if (!d) { console.warn('No topic data for key:', key); return; }
    mTag.textContent  = d.tag;
    mTitle.textContent = d.title;
    mBody.innerHTML   = d.body;
    mTips.innerHTML   = d.tips.map(t => `<li>${t}</li>`).join('');
    mLink.href        = d.link;
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    backdrop.querySelector('.topic-modal').focus();
  }

  function close() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.learning-pill[data-topic]').forEach(pill => {
    pill.addEventListener('click', () => open(pill.dataset.topic));
    pill.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(pill.dataset.topic); } });
    pill.setAttribute('tabindex', '0');
    pill.setAttribute('role', 'button');
  });

  document.getElementById('modalCloseX')?.addEventListener('click', close);
  document.getElementById('modalCloseBtn')?.addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

document.addEventListener('DOMContentLoaded', initCharacterPopups);
