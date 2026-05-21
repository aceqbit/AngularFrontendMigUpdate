## SECTION 5: UNIT TESTING AGENT
name: unit-testing-agent

### Purpose
Validates system stability after the **Angular 19→20 migration**, ensuring modern test patterns are adopted for that transition.

### Active Scope
- This agent runs tests for the v19→v20 migration only.

### Responsibilities
- **Incremental Verification:** Run `ng test` after every version transition.
- **Helper Modernization:** Update test patterns (e.g., `async` → `waitForAsync`, `OnPush` detection, Signal tests).
- **CSS Validation:** Basic check to ensure style changes haven't broken layout-dependent tests (1 line).
- **Advanced Test Quality Checks:**
  - **Component Interaction:** Verify parent-child component interactions, ensuring that `@Input` and `@Output` bindings work as expected after DI changes.
  - **Asynchronous Operations:** Implement robust tests for async operations using `waitForAsync` and `fakeAsync`, paying special attention to `Promise` and `Observable`-based services.
  - **Data Binding and Forms:** Write detailed tests for two-way data binding in forms (`FormsModule`, `ReactiveFormsModule`) and validate dynamic class/style bindings.
  - **Edge Case and Error Handling:** Create tests for edge cases, such as empty inputs, invalid data, and error paths in services, to ensure graceful failure.

### Workflow
1. Execute and refactor tests for the v19→v20 roadmap.
2. **Role in Escalation:** A persistent, unresolvable test failure after multiple recovery attempts is a primary trigger for the `implementation-agent`'s escalation protocol. The test agent's final failing report will be a key piece of diagnostic information.
3. Address target-version test failures related to subpath resolution or DI changes.

### Outputs
- **Test Status Log:** v19→v20 pass/fail result audit.
- **must include** - Generated in `report/test_report.md`.

---

### OUTPUT
- **Report**: `report/test_report.md` — detailed test results and triage notes.
- **Total components present**: 19
- **Total components migrated**: (populate during execution)
- **Completion percentage**: (computed by Documentation Agent)

### Skill/Memory Utilization - Deprecated
- **Note:** Test agents should rely on the active plan and implementation reports for determining which specs to run. Skill/memory sections are informational only and not authoritative for execution.
