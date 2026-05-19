# Codex Harness: Responsive Webapp Portfolio

Use this project-local harness when the user asks to build, redesign, update, refactor, or QA the responsive portfolio webapp.

## Trigger

Use `.codex/skills/portfolio-orchestrator/SKILL.md` for:

- portfolio site creation or redesign
- project/card/content updates
- responsive layout fixes
- UX/UI polish
- frontend implementation
- accessibility and QA review
- follow-up improvement based on previous work

Simple questions can be answered directly.

## Codex Runtime Rules

- Work locally by default. Read the codebase, implement, verify, and summarize.
- Do not spawn subagents unless the user explicitly asks for parallel agents, delegated agents, or subagents.
- If the user explicitly asks for agent delegation, use the agent briefs in `.codex/agents/` as role prompts and keep write ownership disjoint.
- Preserve user changes. Never reset or revert unrelated work.
- Keep `_workspace/` artifacts as reusable planning and QA memory.

## Harness Agents

- `.codex/agents/portfolio-strategist.md`
- `.codex/agents/experience-designer.md`
- `.codex/agents/frontend-engineer.md`
- `.codex/agents/qa-reviewer.md`

## Harness Skills

- `.codex/skills/portfolio-orchestrator/SKILL.md`
- `.codex/skills/portfolio-strategy/SKILL.md`
- `.codex/skills/responsive-ux-design/SKILL.md`
- `.codex/skills/frontend-build/SKILL.md`
- `.codex/skills/portfolio-qa/SKILL.md`

## Change History

| Date | Change | Target | Reason |
| --- | --- | --- | --- |
| 2026-05-07 | Initial Codex harness configuration | `.codex/agents`, `.codex/skills`, `AGENTS.md` | Responsive webapp portfolio workflow |
