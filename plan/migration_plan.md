# Migration Plan: Angular v16 → v17

Scope: this plan is the active migration path for Angular 16 → 17 only.

## Phase 1: Preparation
- Ensure the workspace is clean and that any long-running dev servers are stopped.
- Verify `package.json` aligns all `@angular/*` packages to 17.x.
- Confirm `angular.json` uses the current Angular 17-compatible build setup.

## Phase 2: Validation
- Run `ng build` to confirm the app compiles successfully.
- Run `ng test --watch=false` to confirm the unit test suite passes.
- Run a browser smoke check against the app shell.

## Phase 3: Checkpoint
- Record the final state in the migration report.
- Create the git checkpoint with a concise commit message and push it automatically.

## Success Criteria
- The workspace remains on Angular 17.
- Build, test, and runtime smoke checks pass.
- No user intervention is required during the migration workflow.

## Notes
- Historical v17→v21 guidance is intentionally excluded from the active plan.

- See per-version atomic plan: [migration_v16_to_v17.md](plan/migration_v16_to_v17.md)
