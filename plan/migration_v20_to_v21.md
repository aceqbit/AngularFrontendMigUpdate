# Migration Plan: Angular v20 → v21 (Atomic)

## Purpose
This per-version plan focuses on a single atomic jump from Angular 20 to Angular 21. Follow the phases below and validate at each gate.

## Phases

1. Pre-flight (Inventory & Backup)
   - Run assessment to populate project inventory and export `report/assessment_report.md`.
   - Create a migration branch and a working checkpoint tag (pre-migration snapshot).

2. Core Angular Alignment
   - Align all `@angular/*` packages to the target v21 versions.
   - Upgrade `@angular/cli` and `@angular-devkit/build-angular` as required.
   - Upgrade TypeScript to the required v21-compatible release.
   - Run `npm install` (clean workspace: remove `node_modules` and lockfiles if necessary).

3. Third-Party Library Updates
   - Update and verify critical third-party libraries.
   - Address peer dependency conflicts (document any `--force` or `--legacy-peer-deps` usage).

4. Zone & Change Detection Fixes (P0)
   - For each component flagged by assessment, fix polling/timer/async mutation patterns:
     - Option A: `ChangeDetectorRef.markForCheck()` after mutation, or
     - Option B: wrap in `NgZone.run()` to run updates inside Angular's zone.
   - Verify each fix with a targeted `ng build` and small visual check.

5. CSS Modernization
   - Apply CSS agent recommendations: tokenization, gradient consolidation, responsive/sizing rules, and asset path fixes.
   - Run a visual smoke validation for major UI surfaces.

6. Testing & Validation
   - Run `ng build` (production) and `ng test -- --watch=false`.
   - Run targeted spec suites for modified components.
   - Generate `report/test_report.md` with pass/fail and coverage deltas.

7. Final Checkpoint & Push
   - Commit and push migration changes.
   - Create and push tag `v21-stable`.
   - Generate final `report/migration_report.md` and `docs/documentation.md` entries.

## Validation Gates
- Gate 1: `ng build` (no blocking errors)
- Gate 2: `ng test` (critical specs passing)
- Gate 3: Visual smoke checks for high-risk components

## Outputs
- `plan/migration_v20_to_v21.md` (this file)
- `report/assessment_report.md`, `report/implementation_log.md`, `report/css_report.md`, `report/test_report.md`, `report/migration_report.md`
- Git tag: `v21-stable` on success

## Success Criteria
- Build success, targeted tests pass for modified components, no unaddressed zone/change-detection defects, and visual parity for core flows.

## Rollback
- If unrecoverable failure occurs, revert to `v20-stable` tag and re-evaluate the failing step.

---
