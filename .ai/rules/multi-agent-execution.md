# Multi-Agent Execution Rule

Status: Active

Use this rule for any request that is non-trivial, can be split into subtasks, or benefits from specialist review before implementation.

## Purpose

Route each subtask to the best-fit specialist, let agents challenge weak ideas before execution, and keep a visible planning trail in `.aiplan/` while the work is active.

## Default Behavior

1. Decompose the request into subtasks.
2. Choose the best-fit agent for each subtask.
3. Run multiple agents when the subtasks are independent or can be reviewed in parallel.
4. Do not force multi-agent delegation for a tiny one-step request.

If the active tool supports custom agent profiles, prefer the matching repository profile for the chosen role. In this repo, GitHub Copilot custom agent profiles live in `.github/agents/*.agent.md`.

## Role Routing Cues

When a subtask is specific, start with the agent whose trigger words best match the request:

- `business-analyst`: `requirements`, `scope`, `clarify`, `acceptance criteria`, `user flow`
- `product-owner`: `priority`, `MVP`, `tradeoff`, `roadmap`, `ship now`
- `architect`: `architecture`, `structure`, `boundary`, `pattern`, `long-term`
- `senior-developer`: `implement`, `build`, `refactor`, `fix`, `integrate`
- `tester`: `test`, `verify`, `regression`, `QA`, `edge case`
- `ui-ux-specialist`: `layout`, `UX`, `hierarchy`, `conversion`, `accessibility`
- `seo-aeo-geo-specialist`: `SEO`, `metadata`, `schema`, `AEO`, `GEO`, `discoverability`

## Planning Workspace

Use `.aiplan/` as the live execution workspace while the task is in progress.

### Required Files During Active Work

- `.aiplan/plan.md`: the working plan, owners, dependencies, and status
- `.aiplan/argue/<role>.md`: short position notes from agents when there is disagreement or a meaningful tradeoff
- `.aiplan/consensus.md`: the agreed direction after argument is resolved

### Planning Flow

1. Write or refresh `.aiplan/plan.md` before substantial multi-step work starts.
2. If agents disagree on the plan, task split, or solution, capture each position in `.aiplan/argue/`.
3. Summarize the chosen direction in `.aiplan/consensus.md`.
4. Execute against the consensus plan.
5. Update the plan as execution progresses.

## Argument Phase

Use `.aiplan/argue/` when:

- scope is unclear
- there are competing technical approaches
- product value and engineering cost conflict
- design, SEO, or QA concerns could change the solution

Keep argument notes short, concrete, and decision-oriented.

## Cleanup

When the task is fully executed:

1. remove temporary plan artifacts from `.aiplan/`
2. remove resolved argument notes from `.aiplan/argue/`
3. remove the completed `.aiplan/consensus.md`
4. keep only the scaffold docs such as `.aiplan/README.md` and `.aiplan/argue/README.md`

Do not leave stale execution artifacts behind after delivery.

## Avoid

- using the wrong specialist when a better-fit agent exists
- skipping the argument phase when the solution is contested
- letting argument continue without producing consensus
- leaving `.aiplan/` cluttered after delivery
