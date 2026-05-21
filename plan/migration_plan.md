# Migration Plan: Angular 16 → 17 (Focused)

This repository uses per-version, atomic migration plans. The active, focused plan for the immediate work is the Angular 16 → 17 plan linked below.

- Master index: this file (entry point for version plans)
- Version-specific plan: [plan/migration_v16_to_v17.md](plan/migration_v16_to_v17.md)
- Next planned version-specific plan: [plan/migration_v17_to_v18.md](plan/migration_v17_to_v18.md)

Guiding principles:

- Run one version migration at a time (atomic, checkpointed).
- Create a git checkpoint before making changes and push after validation.
- Use `ng update` where available and prefer small, verifiable steps.
- Flag polling/timer code and async callbacks for explicit change-detection fixes.

See [plan/migration_v16_to_v17.md](plan/migration_v16_to_v17.md) for the full step-by-step, validation gates, rollback instructions, and a short list of files to inspect first.
