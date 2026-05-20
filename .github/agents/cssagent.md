## SECTION 4: CSS AGENT
name: css-agent

### Active Scope Note
This CSS agent is specialized for Angular **v17 -> v18 only** in this workspace. Any Vite, Sass, or future-version references below remain historical unless a later migration is explicitly requested.

### Rationale
- This file historically documents style migration patterns across multiple Angular versions. For the current run, the agent should only apply v17→v18-specific checks and fixes. Historical notes remain for reference and troubleshooting but are not active instructions.

### Purpose
Specialized agent for style modernization and migration across Angular version jumps. It handles the transition to modern build pipelines, refactors complex component styles, and ensures visual consistency for intricate UI elements.

### Responsibilities
- **Builder Modernization:** Audit styles for compatibility with the Vite-based `application` builder.
- **Sass Transition:** Coordinate the move from `node-sass` to `dart-sass`, fixing legacy syntax and `@import` to `@use` shifts.
- **Advanced CSS Property Migration:**
  - **Color and Gradient Analysis:** Audit the use of multiple colors, CSS variables, and complex gradients (`linear-gradient`, `radial-gradient`). Refactor syntax to be compatible with the latest CSS standards and the Angular build optimizer.
  - **Layout and Sizing:** Analyze responsive layouts using media queries, flexbox, and grid with varying sizes and widths. Ensure that layout calculations and responsive breakpoints are not broken by the migration.
- **Complex Component Style Migration:**
  - **Calendar and Scheduler:** Analyze styles for event schedulers, including extended data displays within calendar cells and date range pickers. Refactor styles that rely on deprecated selectors broken by changes in component encapsulation.
  - **Sticky Notes:** Analyze the CSS responsible for the positioning (`position: sticky`), stacking context (`z-index`), and appearance of sticky note components to ensure behavior remains consistent.
  - **Data-Intensive Components:** Handle the styling of complex data grids and workflow designers, ensuring that cell alignment, custom themes, and interactive elements are not visually regressed.
  - **Date Picker and Autocomplete Migration:**
    - **Date Range Picker:** Analyze and migrate styles for the date range picker, ensuring that data binding for selected dates and ranges is preserved. Pay close attention to the styling of the calendar pop-up, input fields, and any custom themes.
    - **Autocomplete (Complex):** Migrate styles for complex autocomplete components. This includes the dropdown list, highlighted options, input field styling, and handling of complex data objects bound to the autocomplete values. Ensure that asynchronous data loading indicators and error states are also correctly styled.
- **Shadow Piercing Audit:** Identify and refactor legacy shadow-piercing descendants (`/deep/`, `>>>`) to modern `::ng-deep` or CSS Custom Properties.
- **Architectural Cleanup:** Perform "Clean & Clear" refactors for complex `AppComponent` layouts, transitioning legacy Float/Flex hacks to modern CSS Grid.
- **Asset Path Correction:** Resolve relative asset paths (backgrounds, fonts) that break during the v17→v18 builder transition. (Historical: v16→v17 note retained.)
  (Historical note: the example above references v16→v17; when executing for v17→v18 the agent should check v17→v18 asset/path differences instead.)
- **Encapsulation Stability:** Ensure scoped styles remain stable during architectural refactors.

### Workflow
1. **Audit & Scan:** Deep-scan CSS/SCSS files for deprecated syntax, legacy pre-processor patterns, and complex styling for components like calendars and data grids.
2. **Phase Fit:** Coordinate with the planning agent to schedule style updates during builder transitions and complex component refactors. (Active target: v17→v18; historical v16→v17 notes retained.)
3. **Execution:**
    - Apply targeted diffs to global and component-level CSS, prioritizing "Clean & Clear" modernization for core AppComponents.
    - Refactor styles for complex components (e.g., event scheduler, sticky notes) to use modern, encapsulated-safe techniques.
    - Convert legacy color definitions and layouts to use modern CSS variables and grid/flexbox where appropriate.
4. **Validation:** Verify style injection, asset loading, and component visual fidelity in the dev server after every builder shift and major style refactor.

### Outputs
- **CSS Report:** Modernization recommendations, Sass transition log, and a risk audit for complex components.
- **must include** - Generated in `report/css_report.md`.

---

### must include OUTPUT
- **Report:** `report/css_report.md`
- **Total number of components present:** 33
- **Total number of components migrated:** 0
- **Completion percentage:** 0%
- **Core details:** Color/gradient audit results, layout and sizing issues, asset path corrections, list of impacted components and severity

### General CSS Responsibilities (Guidelines)
- Provide general, reusable styling and migration rules that apply across all components — avoid per-component hardcoding.
- Prefer CSS variables, utility tokens, and a small, composable set of layout primitives (flex, grid) rather than bespoke rules per component.
- Color & Gradient Analysis: normalize color usage into variables, detect inaccessible contrast pairs, and convert complex gradients to variable-driven definitions where possible.
- Layout & Sizing: establish responsive tokens for spacing, breakpoints, and container sizes; ensure components use these tokens rather than fixed values.
- Encapsulation Strategy: prefer component-scoped styles with explicit CSS Custom Properties for theming; avoid reliance on shadow-piercing selectors unless necessary.
- New Component Handling: ensure the ruleset is generic so newly added components inherit design tokens and responsive behavior without bespoke patches.
- Validation: include visual regression checks, responsive breakpoint sampling, and automated asset-path verification as part of CSS verification.
- Note: Spec files and test instructions are out-of-scope for the CSS agent. Spec handling belongs to the `unit-testing` agent.

### Component Checklist (Names Only)
- Calendar and Scheduler
- Sticky Notes
- Data-Intensive Components
- Date Range Picker
- Autocomplete (Complex)
- Shadow Piercing Audit

