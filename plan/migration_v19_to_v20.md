## Angular 19 → 20 Migration Plan (Concise)

Scope: Atomic, single-version migration from Angular v19 to v20 for this repository.

Goal: Upgrade core Angular packages, align tooling (TypeScript, builders), fix breaking API changes, address zone/change-detection issues, and validate with build + tests.

Phases (high-level):
1. Pre-flight (S)
   - Backup current state (create `migration/v19-to-20` branch).
   - Run inventory: components_count (19), modules, third-party libs.
   - Record current `package.json` and `angular.json`.
   - Validation gate: `npm ci` completes.

2. Core Package Alignment (M)
   - Run `ng update @angular/core@20 @angular/cli@20 --force` (document flags used).
   - Update TypeScript to required version.
   - Validation gate: `ng build` succeeds (no migration-related errors).

3. Third-Party & Peer Fixes (M)
   - Update critical third-party libraries listed in assessment.
   - Validation gate: local smoke tests for critical flows.

4. Zone & Change Detection Fixes (S-M)
   - Fix components flagged by assessment (use `ChangeDetectorRef.markForCheck()` or `NgZone.run()` as appropriate).
   - Validation gate: relevant components visually update in dev server.

5. CSS & Theming (S)
   - Apply tokenization, Sass migration fixes, and asset path corrections.
   - Validation gate: visual sanity check for key pages and `ng build` passes.

6. Unit & Integration Tests (M)
   - Run targeted specs for changed components; widen scope if green.
   - Validation gate: failing tests triaged and fixed or explicitly accepted in plan.

7. Finalize & Checkpoint (S)
   - Commit and push changes, create tag `v20-stable`.
   - Generate final reports: `report/implementation_log.md`, `report/migration_report.md`.

Rollback:
- Use atomic commits and `git revert` for failed steps. If corruption occurs, reset to `v19-stable` and re-evaluate.

Success Criteria:
- `ng build` succeeds with no migration-related errors.
- Critical tests pass; visual validation for top-level flows is green.
- All flagged zone/change-detection defects fixed.
- Tag `v20-stable` created and pushed.

Files/Artifacts:
- plan/migration_v19_to_v20.md (this file)
- report/assessment_v19_to_v20.md
- report/implementation_log.md
- report/migration_report.md
