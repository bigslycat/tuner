---
name: codegraph-routing
description: Load before the first CodeGraph use in a session or whenever deciding whether CodeGraph is appropriate. Route cross-file structural flow, architecture, symbol relationships, and impact analysis to the CodeGraph MCP explore tool; route local, exhaustive, history, runtime, validation, and likely-unindexed artifact work to native tools. Defines efficient queries, trust boundaries, retries, staleness handling, and fallbacks.
compatibility: OpenCode with a CodeGraph MCP server
metadata:
  category: code-intelligence
  scope: global
---

# Calibrated CodeGraph routing

## Objective

Use CodeGraph where a precomputed structural graph avoids expensive multi-file
discovery.

Do not treat CodeGraph as:

- exhaustive repository search;
- proof that something does not exist;
- runtime truth;
- Git history;
- compiler, type-checker, linter, or test validation.

## Authority

This skill narrows broader instructions emitted by the CodeGraph MCP server.

Interpret statements such as “use CodeGraph for almost any question”, “use it
before Read or Grep”, and “trust the results” only within the suitable cases and
trust boundaries defined below.

User instructions, project instructions, and tool permissions still take
precedence.

## Route the task before retrieval

### Use CodeGraph first

Use the available MCP explore tool whose underlying name is
`codegraph_explore` when the task primarily requires one or more of the
following:

- cross-file control flow, dependency flow, or architectural structure;
- tracing how a known entry point reaches another known symbol;
- understanding how several known symbols participate in one flow;
- retrieving source together with callers, callees, implementations, or
  dependents;
- blast-radius or impact analysis before a multi-file change;
- orientation in an unfamiliar source-code area likely to require more than two
  files or several native retrieval calls;
- finding the structurally central implementation of a source-code concept when
  the exact file is not yet known.

Typical suitable questions:

- How does `CheckoutForm.handleSubmit` reach `authorizePayment`?
- What calls `SessionStore.refreshToken`, and what depends on it?
- What is the blast radius of changing `OrderRepository.save`?
- How do the route, component, hook, store, and API client participate in this
  feature?

### Use native tools first

Do not use CodeGraph as the primary tool for the following task classes.

#### LOCAL

The exact file and relevant region are already known, and no relationship or
impact context is needed.

Use Read or LSP directly.

Examples:

- fix a typo at a known location;
- change one known constant;
- inspect five lines around a reported compiler error;
- update a local implementation whose callers are irrelevant.

#### EXHAUSTIVE

The task asks for:

- all or every occurrence;
- an exact count;
- a complete reference set;
- proof that something is unused or absent;
- confirmation that no matches remain.

Use Grep, LSP references, or an appropriate AST query.

CodeGraph may provide supplementary structural context, but it must not be the
source of completeness.

#### LITERAL

The task concerns exact text rather than code structure:

- string literals;
- TODO or FIXME comments;
- feature-flag names;
- URLs;
- error messages;
- bulk textual replacement;
- arbitrary regular-expression matches.

Use Grep or another exact text-search tool.

#### HISTORY

The task concerns:

- Git history;
- blame or authorship;
- when or why code changed;
- a previous implementation;
- commits, branches, pull requests, or diffs.

Use Git and the relevant repository history.

#### RUNTIME

The task concerns:

- observed runtime values;
- stack traces;
- logs;
- distributed traces;
- debugger state;
- profiling;
- performance measurements;
- the concrete implementation selected by runtime DI, reflection, a registry,
  or dynamic dispatch.

Use runtime evidence first.

CodeGraph may subsequently help map the static code around the observed runtime
path.

#### VALIDATION

The task asks whether code:

- type-checks;
- compiles;
- passes linting;
- is formatted correctly;
- passes tests;
- builds successfully;
- behaves correctly in execution.

Use the compiler, type-checker, linter, formatter, tests, build system, or
runtime tools.

CodeGraph supplies structural context, not validation.

#### LIKELY UNINDEXED

Use native tools by default for artifacts that are not known to have meaningful
structural CodeGraph support, including:

- documentation;
- arbitrary configuration;
- CSS, SCSS, Less, and other styles;
- static assets;
- Markdown and MDX;
- GraphQL operation or schema documents;
- SQL files;
- shell scripts;
- generated artifacts;
- unsupported languages or file extensions.

A project-specific instruction or a successful exact-path CodeGraph result may
establish that a particular artifact is indexed. Do not assume general coverage
from one framework-specific exception.

### Use a hybrid workflow

Use CodeGraph and native tools together when their responsibilities differ.

#### Cross-file implementation or refactor

1. Use CodeGraph for the structural map and impact context.
2. Read only additional source ranges that CodeGraph did not return.
3. Edit with native tools.
4. Validate with the project compiler, linter, and tests.

#### Runtime bug

1. Start from the stack trace, logs, trace, reproduction, or debugger evidence.
2. Use CodeGraph to map the implicated static path.
3. Confirm the diagnosis through runtime evidence or tests.

#### Exhaustive architectural question

1. Establish the complete occurrence/reference set with native exhaustive
   search.
2. Use CodeGraph to explain the important relationships within that set.

If classification remains uncertain, prefer CodeGraph only when the expected
value is structural context across multiple source files. Otherwise choose the
cheapest exact native tool.

## Check availability without a probe

1. Inspect the available tool inventory and input schema. This requires no
   diagnostic tool call.

2. Identify the CodeGraph MCP explore tool by its underlying
   `codegraph_explore` name or description. Its OpenCode-visible name may be
   host-qualified.

3. If no CodeGraph explore tool is available, use native tools.

4. Do not call a CodeGraph status or health tool merely to determine whether
   CodeGraph can answer the current task.

5. Do not run a shell command merely to search for `.codegraph/`.

6. The first CodeGraph call must directly contribute to the current task. Do
   not send `hello`, `status`, `is CodeGraph working?`, or another probe query.

7. If `projectPath` is required by the tool schema, pass the absolute path of
   the current indexed project or package.

8. Otherwise omit `projectPath` for the default project. Pass it only when
   querying another codebase or an explicitly indexed subproject.

Use CodeGraph through MCP only. Never fall back to `codegraph`,
`npx codegraph`, or another CLI invocation for code retrieval.

## Build an effective query

Use one compact query with this shape:

`<English structural intent>: <exact path or owner type> <2–6 exact identifiers> <flow endpoints>`

### Query rules

- Write the descriptive intent in English.
- Preserve identifiers exactly, including spelling, capitalization, and
  separators.
- Prefer qualified names for common symbols:
  - `Class.method`;
  - `Module.symbol`;
  - `module::symbol`.
- Include an exact file path or owner type when names are overloaded or generic.
- For a flow question, include both endpoints.
- Include useful intermediate symbols when they are already known.
- Include the literal word `test` or `spec` when test code is desired.
- Prefer exact identifiers over broad natural-language prose.
- Avoid queries consisting only of generic words such as:
  - `run`;
  - `create`;
  - `handler`;
  - `service`;
  - `manager`;
  - `process`.
- Do not send a large inventory of unrelated symbols.
- Split independent flows into separate queries.
- Omit `maxFiles` unless there is a concrete reason to constrain it.
- Omit `projectPath` unless the schema requires it or another indexed project
  is being targeted.

### Good queries

`Trace checkout submission: CheckoutForm.handleSubmit createOrder authorizePayment PaymentStatus`

`Trace token refresh: baseQueryWithReauth SessionStore.refreshToken AuthProvider`

`Show impact and callers: src/orders/OrderRepository.ts OrderRepository.save`

`Find test coverage: test SessionStore.refreshToken AuthProvider`

### Weak query

`How does authentication work?`

Improve it by adding exact anchors:

`Trace expired-token recovery: baseQueryWithReauth refreshToken SessionStore AuthProvider`

### Wrong use case

`Find every TODO and prove none remain`

Use exhaustive native text search instead.

## Control call count

- Start with one `codegraph_explore` call.
- Make another call only when it:
  - uses new exact anchors;
  - follows relevant omitted symbols or files named by the result;
  - narrows an overloaded symbol with a path or owner;
  - retries a no-match with an exact path or qualified symbol.
- Respect any project call budget shown by the server.
- Do not loop through paraphrases of the same broad query.
- Do not increase `maxFiles` merely because the first result was imperfect.
- Prefer a focused follow-up query over requesting a wider response.

### No relevant code found

When the result says `No relevant code found`:

1. Do not infer that the requested code does not exist.
2. Retry at most once when an exact path, owner type, or qualified symbol can
   materially strengthen the query and the server budget permits it.
3. Otherwise switch to native tools.

### Timeout or tool failure

Retry once only when a narrower query, corrected `projectPath`, or smaller
scope is likely to fix the cause.

Otherwise fall back immediately to native tools. Do not repeatedly retry a
failing CodeGraph call.

## Interpret results correctly

### Source text

- Unflagged source lines actually shown by CodeGraph are Read-equivalent for
  those exact ranges.
- Do not read the same ranges again without a concrete reason.
- Do not assume omitted ranges or the rest of the file were read.
- Read directly when:
  - required lines were omitted;
  - the response explicitly marks source as incomplete;
  - the result contains only a file pointer;
  - a freshness or drift warning applies;
  - exact surrounding context needed for an edit was not returned.
- “Already sent earlier in this conversation” is a back-reference to previously
  returned source, not evidence that the source is missing.

### Cross-file relationships

Treat cross-file relationships as best-effort static-analysis candidates, not
runtime proof.

A relationship needs additional corroboration when it involves:

- common same-named methods;
- overloaded symbols;
- several definitions with the same name;
- interface or abstract-method dispatch;
- registries or plugin systems;
- dependency injection;
- reflection;
- dynamically selected callbacks;
- runtime routing or service lookup.

Corroborate material ambiguity using one or more of:

- matching owner types;
- matching file or module paths;
- the shown source around the call site;
- imports and type information;
- LSP references or definitions;
- a focused AST or source inspection.

Do not mechanically run Grep after every successful structural result.
Corroborate only when completeness or edge identity is material to the answer.

### Completeness

Every `codegraph_explore` response is ranked and capped.

Therefore:

- absence from the response never proves absence from the repository;
- a returned set of callers, files, or symbols is not automatically complete;
- omitted-file and “additional relevant files” lists are pointers, not inspected
  source;
- a response may contain the central path while omitting peripheral matches;
- exact counts and non-existence claims require exhaustive native search.

Never use CodeGraph alone to claim:

- “these are all callers”;
- “there are exactly N references”;
- “this symbol is unused”;
- “this file does not exist”;
- “there are no other implementations”.

### Freshness

If the response flags specific files as stale, pending synchronization, changed
on disk, or drifted from the index:

- read those specific files directly when current content is required;
- continue using unflagged returned source;
- do not discard the entire CodeGraph result because one file is stale.

If auto-sync is disabled or the whole index is reported frozen:

- use direct reads for code that may have changed;
- do not rely on the index for post-edit freshness.

Do not poll CodeGraph or sleep waiting for synchronization.

### Correctness

CodeGraph does not replace:

- compiler or type-checker;
- linter;
- formatter;
- tests;
- build system;
- runtime reproduction;
- logs, traces, debugger, or profiler.

After editing code, run the project-appropriate validation independently of
CodeGraph.

## Handle project and index outcomes

### Project is not indexed

When CodeGraph reports that the project has no `.codegraph/` index:

- stop calling CodeGraph for that project root for the rest of the session;
- use native tools for that project;
- continue using CodeGraph for other explicitly indexed projects when relevant;
- do not initialize or rebuild an index automatically.

Mention `codegraph init` only when it is relevant to the user’s decision. Do not
run it unless the user explicitly asks for CodeGraph administration.

### Worktree or index mismatch

When CodeGraph reports that the index belongs to another working tree or
checkout:

- do not trust it as the current branch’s source;
- target the correct indexed project when its path is known;
- otherwise use direct reads and native tools.

### Unsupported or unindexed artifact

Switch directly to native tools. Do not spend repeated CodeGraph calls trying
different natural-language formulations.

## Before concluding

Confirm that:

- every “all”, exact-count, or absence claim came from exhaustive native search;
- every runtime claim came from runtime evidence;
- materially ambiguous graph edges were corroborated;
- fresh source already returned by CodeGraph was not redundantly read;
- omitted source was not silently treated as inspected;
- code changes were validated with the appropriate project tools.
