---
name: conventional-commits
description: Conventional Commits 1.0.0 guidance. Use when choosing a commit type or scope, assessing a breaking change, writing or reviewing a commit message, or creating a commit.
license: MIT
---

# Conventional Commits

The normative authority for compliance is the version-pinned
[Conventional Commits 1.0.0 specification](https://www.conventionalcommits.org/en/v1.0.0/#specification).
The rules needed to apply it are reproduced below; using this skill does not
require a live fetch.

Use this blocking pipeline in order. Do not present, approve, or use a commit
message until every gate passes.

## Keep The Policy Layers Separate

Evaluate each message against three distinct layers:

1. **Conventional Commits 1.0.0 compliance** determines whether the message
   satisfies all 16 normative rules. It requires `feat` for features and `fix`
   for bug fixes, but permits additional types and multiple breaking-change
   forms.
2. **Repository policy** may narrow types, scopes, release behavior, or style.
   Read documented local conventions before choosing a message and satisfy
   them when they are compatible with the specification. Attribute every extra
   restriction to the repository. If local policy conflicts with a mandatory
   upstream rule, ask how to proceed rather than claiming both are satisfied.
3. **Generation preferences** make new output consistent: use lowercase types
   and scopes, and use both breaking indicators. These preferences are stricter
   than upstream compliance; do not reject an existing compliant message solely
   for omitting a preferred form.

Imperative mood, line-length limits, and terminal-punctuation rules are style
preferences only unless repository policy requires them. Conventional Commits
itself correlates `fix` with PATCH, `feat` with MINOR, and any breaking change
with MAJOR. Other types have no implicit SemVer effect unless repository tooling
defines one.

## 1. Establish Evidence And Atomic Intent

Inspect the complete available evidence: the user's request, the whole proposed
or staged change, the affected before-and-after contracts, and documented
repository conventions. State the single intent and consumer-visible effect.
Classify the effect, not filenames or directories; comments in a production
file can still be `docs`, while a dependency change can still be `feat`, `fix`,
or breaking because of its effect.

Treat supporting tests, documentation, and implementation for one behavior as
one intent. Treat unrelated effects as separate intents. If independent feature
and defect-correction intents coexist, stop and recommend separate `feat` and
`fix` commits before constructing messages. Split other independent intents
when one message would hide what changed.

If the evidence does not reveal whether behavior is new, defective, unchanged,
or part of a supported contract, ask for the missing intent or contract context.
Do not infer from paths, select `chore` as a placeholder, or produce a final
message while classification is unresolved.

**Gate 1 passes when:** every changed concern is accounted for, the candidate
commit has one atomic intent, and its consumer-visible effect is known.

## 2. Select The Base Type

Apply this precedence after Gate 1:

1. Use `feat` whenever the atomic change adds a capability to an application or
   library. This mandatory upstream meaning takes precedence over filenames and
   fallback types.
2. Use `fix` whenever the atomic change corrects application or library behavior
   that was defective relative to its intended contract. This remains `fix`
   even when the correction is breaking.
3. Only after excluding `feat` and `fix`, use a compatible type required by
   documented repository policy.
4. If the repository has no matching type, use the narrowest fallback below.

| Type       | Use only when the atomic intent is                                                |
| ---------- | --------------------------------------------------------------------------------- |
| `docs`     | documentation or comments only, with no application or library behavior change    |
| `test`     | tests, fixtures, or test support only, with no production behavior change         |
| `refactor` | restructuring implementation while preserving supported observable behavior       |
| `perf`     | improving performance while preserving the intended contract, not fixing a defect |
| `build`    | changing the build system, packaging, or build dependencies                       |
| `ci`       | changing continuous-integration configuration or automation                       |
| `style`    | changing formatting or other non-semantic source presentation                     |
| `chore`    | maintenance that fits no more precise type; never a fallback for uncertainty      |
| `revert`   | intentionally reversing one or more earlier changes                               |

Effects outrank mechanisms: for example, use `fix` rather than `test` when a
test accompanies a defect correction, and use `feat` rather than `build` when a
build-system change delivers a new application or library capability.

**Gate 2 passes when:** one base type describes the established intent, mandatory
`feat`/`fix` semantics are preserved, and any local vocabulary has been applied
without being misrepresented as upstream policy.

## 3. Assess Compatibility Independently

After selecting the base type, compare the before-and-after public contract for
every supported consumer. Include:

- programmatic APIs, exported types, and calling conventions;
- CLI commands, arguments, flags, outputs, and exit behavior;
- configuration schemas, keys, defaults, and environment variables;
- protocols, wire interfaces, and emitted or consumed events;
- persisted and exchanged data formats;
- documented behavior and defaults; and
- supported runtimes, operating systems, platforms, and required environments.

The change is breaking when an existing supported consumer must change code,
data, configuration, automation, or operating environment to remain compatible.
Removal or incompatible replacement is breaking even when the package is pre-1.0
or the implementation diff is small. A breaking defect correction keeps `fix`;
a breaking build change keeps `build`; breaking status never chooses the base
type.

A compatible optional addition that preserves existing inputs, outputs, and
defaults is not breaking. An internal-only refactor that preserves all supported
contracts is not breaking. If support commitments or consumer migration needs
are unknown, ask who relies on the contract and what migration is required
before deciding.

**Gate 3 passes when:** every contract category is considered and breaking status
plus any required consumer migration are known.

## 4. Construct The Message

Use this grammar:

```text
<type>[optional scope][optional !]: <description>

[optional body]

[optional footer(s)]
```

- Render the selected type as a noun. Generate it in lowercase.
- Add a scope only when it adds useful context. It must be a noun naming a
  codebase section, enclosed in parentheses; generate it consistently in
  lowercase.
- For a breaking message, place `!` after the type or scope and immediately
  before the colon.
- Follow the prefix with exactly a colon and space, then a non-empty short
  description. When `!` is present, the description must communicate the
  breaking change.
- Put an optional free-form body one blank line after the description. It may
  contain any number of newline-separated paragraphs.
- Start optional footers one blank line after the body, or one blank line after
  the description when there is no body. Each footer has a word token followed
  by either `: ` or ` #`, then a value. Replace whitespace in a multiword token
  with `-`, except for the reserved `BREAKING CHANGE` token. Footer values may
  span lines and end when the next valid token/separator pair begins.

For every newly generated breaking message, require both visible and actionable
notation:

```text
<type>[optional scope]!: <description of the break>

BREAKING CHANGE: <incompatible contract and action consumers must take>
```

`BREAKING CHANGE` must use that exact uppercase spelling, followed by a colon
and space. Its value must identify what became incompatible and give a concrete
migration action, not merely say that the change is breaking.

**Gate 4 passes when:** the message represents the selected type and compatibility
status, every present section follows the grammar, and a newly generated
breaking message contains both `!` and the migration-focused footer.

## 5. Run The Blocking 16-Rule Audit

Audit every candidate, including an existing message under review, against every
numbered rule. Mark an optional rule not applicable only when its element is
absent. If any applicable check fails, identify the failed rule, correct or
reject the candidate, and rerun the complete audit. No failing candidate may be
presented as final, approved, or used to create a commit.

1. **Prefix:** It starts with a noun type, optional parenthesized scope, optional
   `!`, and the required terminal colon and space, in that order.
2. **Feature semantics:** It uses `feat` when the atomic change adds an
   application or library feature.
3. **Fix semantics:** It uses `fix` when the atomic change is an application or
   library bug fix.
4. **Scope:** If present, the scope is a noun describing a codebase section and
   is surrounded by parentheses immediately after the type.
5. **Description:** A short description begins immediately after the prefix's
   colon and space.
6. **Body boundary:** If a longer body is present, it begins exactly one blank
   line after the description.
7. **Body form:** The body is free-form and may contain any number of
   newline-separated paragraphs.
8. **Footer boundary and grammar:** If footers are present, they begin one blank
   line after the body, or after the description when no body is present. Every
   footer consists of a word token, either a `: ` or ` #` separator, and a
   string value.
9. **Footer tokens:** Footer tokens use `-` instead of whitespace; the exact
   token `BREAKING CHANGE` is the sole space-containing exception.
10. **Footer values:** Values may contain spaces and newlines. A multiline value
    ends only when the next valid footer token/separator pair begins.
11. **Breaking indication:** A breaking change is indicated by `!` in the prefix,
    a breaking footer, or both.
12. **Canonical breaking footer:** When the spaced form is used, it is exactly
    `BREAKING CHANGE: ` followed by a description.
13. **Breaking prefix:** When used, `!` is immediately before the colon. A
    footer may be omitted for upstream compliance when the description explains
    the break.
14. **Additional types:** A noun type other than `feat` or `fix` is allowed by
    upstream grammar. Confirm separately that it does not conceal mandatory
    `feat` or `fix` semantics and that repository policy permits it.
15. **Case handling:** Treat information units as case-insensitive for upstream
    validation except that the reserved `BREAKING CHANGE` form must be uppercase.
    Lowercase output is a generation preference, not an upstream requirement.
16. **Equivalent token:** Accept exact `BREAKING-CHANGE` as synonymous with
    `BREAKING CHANGE` when it is a footer token.

The upstream audit therefore accepts an otherwise valid `!`-only message whose
description explains the break, a footer-only breaking message, and the exact
`BREAKING-CHANGE` footer form. New breaking messages still use both `!` and the
canonical spaced footer under the separate generation policy.

After the normative audit passes, apply repository policy, then generation
preferences when generating. Report failures in the layer that owns the rule;
never present optional style as a Conventional Commits requirement. If the user
asked to create a commit, use the exact audited message only after all applicable
layers pass.
