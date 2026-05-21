## SECTION 1: ASSESSMENT AGENT
name: assessment-agent

### Purpose
Evaluates the current project for its readiness to undergo the **Angular 19→20 migration only**, strictly enforcing that single version jump.

### Active Scope
- This agent is specialized for the v19→v20 migration path and should not plan or validate any other version jump.

### Responsibilities

### Roles

### What's and What Nots

#### What it Does (What's)


- **No Skipping Version Jumps:** The agent must strictly follow the incremental migration path and not skip any intermediate versions.

### Workflow
1. **Pre-flight Checks & Analysis:**
   - **Bootstrapping Validation:** Scan `src/main.ts` to identify the bootstrapping method (`bootstrapModule` vs. `bootstrapApplication`). Flag any legacy or incorrect patterns based on the target Angular version.
   - **`node_modules` Corruption Risk:** On Windows, flag the high probability of `node_modules` corruption. The assessment report must recommend a `clean-workspace` step as a standard part of the migration plan.
   - **Incremental Sequence Analysis:**
     - Scan for legacy templates and APIs for versions 16 through 20.
     - Detect standalone readiness and Signal adoption early in the sequence.
     - Cross-reference findings with official migration notes for each intermediate jump.
     - **Error Pattern Recognition:** Identify common errors from past migrations, such as `NG6008` for standalone components in `declarations`, and `NG8002`/`NG8004` for missing `CommonModule`/`FormsModule`.
2. **Readiness Audit: Angular 19 → 20**
   - TRIGGER ONLY for the active 19 to 20 transition.
   - **MANDATORY CHECKS (Detection Focus):**
     - Package Alignment: Audit all `@angular/*` packages for exact version parity on the target 20 release.
     - TS Version: Detect whether TypeScript matches the version required by the 19→20 update.
     - Resolver: Ensure `moduleResolution` is ready for the target Angular 20 configuration.
   - **Why Errors Occur (Contextual Detection):**
     - Identify "Ghost" dependencies causing `primitives/di` subpath errors.
    - Detect mixed package versions that will break the target build.
     - Flag if submodules like `@angular/common/http` are incorrectly installed as separate packages.
     - **Windows Specific:** Note the high probability of `node_modules` corruption and recommend a cleaning step.
3. Output the findings and checklists into the Assessment Report.

- **Migration Assessment Report (Markdown):** 
  - v19→v20 roadmap and per-phase risks.
  - **Specific, actionable warnings for bootstrapping and `node_modules` health.**
  - Minimal summary of CSS architectural risks.
- **must include** - Generated in `report/assessment_report.md`.

### Comprehensive Project Inventory
The assessment agent is responsible for creating a complete inventory of the project's structure and dependencies. This inventory is a critical input for the planning agent.
- **Module and Component Discovery:**
  - Recursively scan the `src/app` directory to identify all Angular modules (`*.module.ts`) and components (`*.component.ts`).
  - For each module, list its `declarations`, `imports`, `providers`, and `exports`.
- **Version and Tooling Analysis:**
  - **`package.json` Deep Dive:** Extract the exact versions of all dependencies, devDependencies, and peerDependencies. Pay special attention to `@angular/*` packages, `typescript`, `rxjs`, and any UI component libraries (e.g., Angular Material, ng-bootstrap).
- **Zone & Change Detection Audit:** Scan all component files (`*.component.ts`) for patterns that may break after the migration:
  - Search for `setInterval()`, `setTimeout()`, direct browser event handlers, or other async callbacks that mutate component data.
  - For each found pattern, flag whether it explicitly calls `ChangeDetectorRef.markForCheck()`, uses `NgZone.run()`, or relies on proper RxJS subscriptions.
  - If mutations occur outside Angular's zone with NO explicit change detection, flag as a **runtime risk** and add to the migration checklist.
  - Document these findings in the assessment report under a new "Zone/Change Detection Risks" section with specific file and line references.
  - This is a runtime defect that won't be caught by the build system; it MUST be identified during assessment and fixed during implementation.

- **Completion percentage**: (computed by Documentation Agent from components migrated / total components)
- **Core details**: { "components_count": 19, "migration_target": "v19→v20", "plan_file": "plan/migration_v19_to_v20.md", "git_checkpoint_tag": "v20-stable" }
### Active Automation Directive
- When the user issues `implement the migration plan`, the assessment agent MUST run the assessment for the v19→v20 migration end-to-end without requiring any user interaction. The assessment must produce `report/assessment_report.md` including a component inventory and explicit zone/change-detection findings (with file and line references). The agent must not pause for confirmations and must not remove or alter existing agent or memory lines; append-only updates are required.

### Skill/Memory Utilization - Deprecated
- **Note:** Skill and memory utilisation details are informational only and should not be relied upon for automated decision-making. Treat any skill/memory sections as deprecated for execution logic; the agents should consult the active plan and reports instead.
