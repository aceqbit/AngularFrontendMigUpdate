# Migration v17 → v18 (Atomic Plan)

## Purpose
Atomic, standalone plan for migrating the codebase from Angular v17 to v18. This file contains per-version validation gates, rollback triggers, and success criteria.

## Phases
1. Pre-flight: run assessment checks, ensure `package.json` is consistent, run `npm ci` in a clean workspace.
2. Core updates: `ng update @angular/core @angular/cli` to v18-compatible versions and align peer deps.
3. Refactors: apply necessary code transforms (bootstrapping, lifecycle changes, signal adoption patterns) only as required by the assessment.
4. CSS adjustments: apply tokenized theming and layout rules (coordinate with CSS Agent).
5. Validation: run `ng build`, `ng test` (targeted), and visual smoke checks.
6. Checkpoint: commit, tag `v18-stable`, and push.

## Validation Gates
- `ng build` succeeds without migration-related errors.
- Targeted unit tests for changed components pass.
- No remaining timer/callback components lacking change-detection fixes.

## Rollback
- Use `git revert` to undo the per-jump commit, or `git reset --hard v17-stable` in emergency cases.

## Success Criteria
- Application builds and serves successfully on v18 dependencies.
- All critical integration points (routing, HTTP, forms) function without runtime errors.

### must include OUTPUT
- **Report:** `report/migration_v17_to_v18.md` (initial and final verification logs).
- **Total components present:** Numeric count for migration planning.
- **Total components migrated:** Count of components updated during this jump.
- **Completion percentage:** v17→v18 completion metric.

