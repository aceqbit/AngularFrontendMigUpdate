# Migration Plan: Angular 17 → 18 (Atomic)

Scope
- This plan is atomic for the single version jump from Angular 17 to Angular 18. Execute and validate fully before any subsequent version changes.

Preconditions
- Working tree clean and committed; create branch `migration/v17-to-v18`.
- Confirm CI is green on main and note Node/npm versions used by CI.

Step-by-step (short)
1. Create checkpoint branch:
   - `git checkout -b migration/v17-to-v18`
   - `git add -A && git commit -m "chore(migration): prepare v17→v18 checkpoint"`
2. Update CLI & core packages:
   - `ng update @angular/cli @angular/core` (follow prompts)
   - `npm install`
3. Run static checks:
   - `npm run build` and `npm run test`
   - `npm run lint` / `tsc`
4. Fix known migration-risk patterns:
   - Flag timers/polling (`setInterval`, `setTimeout`) and ensure explicit change detection (`ChangeDetectorRef.markForCheck()` or `NgZone.run()`) where needed.
   - Update third-party libraries to compatible releases and address peer-deps.
5. Re-run validation:
   - `ng build --configuration production` and `npm test`
6. Manual runtime verification:
   - Exercise high-risk pages (data-grid, workflow-designer, dashboard widgets).
7. Git checkpoint and finalize:
   - If validations pass: `git add -A && git commit -m "chore(migration): complete Angular v17→v18"`
   - Push branch and create tag: `git push origin migration/v17-to-v18 && git tag v18-stable && git push origin v18-stable`

Validation gates (required)
- Gate 1: `ng build` (no compile errors)
- Gate 2: `ng test` (unit tests for affected modules pass)
- Gate 3: Local runtime smoke test (no console runtime errors for high-risk modules)

Acceptance criteria
- Build and unit tests pass on CI and locally.
- No unhandled runtime errors in high-risk areas during manual smoke tests.
- Git tag `v18-stable` created and pushed.

Estimated effort
- 1–4 hours for small-to-medium apps; may increase if automated tests fail and manual fixes are required.

Notes
- Follow the atomic per-version approach: complete v17→v18 fully, commit/push, then proceed to the next version plan.
- Prioritize quick validation gates to avoid long-running speculative refactors.
