# Migration v16 → v17 (Atomic Plan)

This file contains the atomic migration plan for upgrading the codebase from Angular 16 to Angular 17.

Phases:

1. Assessment
   - Count components and spec files.
   - Detect timer/interval usage that may require explicit change detection.

2. Implementation
   - Bump `@angular/*` packages to `^17.0.0` in `package.json` files.
   - Update TypeScript and build settings if required by Angular 17.
   - Apply code changes to trigger change detection where timers/async callbacks mutate data (use `ChangeDetectorRef.markForCheck()` or `NgZone.run()`).

3. Validation
   - Run `npm install` then `npm run build`.
   - Run `npm test` and triage failing specs by running targeted specs first.

4. Checkpoint
   - Update `report/migration_report.md` with counts, status, and timestamp.
   - Commit changes and push tag `v17-stable`.

Rollback plan:
- If build/tests fail irrecoverably, revert the working tree to the pre-migration commit and record blockers in the report.

Success criteria:
- All builds and tests pass; timer-based components explicitly call `markForCheck()` after mutations; git checkpoint pushed.
