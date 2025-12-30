# Changelog

All notable changes to Anchor UI will be documented in this file.

## [Unreleased]

### Changed
- **Complete codebase rebranding to Anchor UI**: All internal types, hooks, utilities, and build scripts have been updated to use Anchor UI naming conventions, establishing Anchor UI as an independent library.
  - Renamed core types: `BaseUIComponentProps` → `AnchorUIComponentProps`, `BaseUIEvent` → `AnchorUIEvent`, `WithBaseUIEvent` → `WithAnchorUIEvent`
  - Updated event handler method: `preventBaseUIHandler` → `preventAnchorUIHandler`
  - Migrated all hooks: `useBaseUiId` → `useAnchorId` (68 files updated)
  - Renamed global test variable: `BASE_UI_ANIMATIONS_DISABLED` → `ANCHOR_UI_ANIMATIONS_DISABLED`
  - Updated test infrastructure: `BaseUiConformanceTestsOptions` → `AnchorUIConformanceTestsOptions`, `BaseUITestRenderer` → `AnchorUITestRenderer`
  - Refactored build scripts: `getBaseUiComponentInfo` → `getAnchorUIComponentInfo`
  - Removed deprecated exports and cleaned up all legacy references

### Technical Notes
- This rebranding establishes Anchor UI as an independent library with its own codebase, types, and APIs.
- Anchor UI leverages proven architectural patterns while maintaining complete ownership of all code and implementation.
- All 80+ test suites pass successfully after rebranding.

## [1.0.0-alpha.2]
**February 25, 2025**
### Added
- Initial release of Anchor UI.
- Fully customizable and headless React components.
- Accessible components such as Accordion, Alert Dialog, Checkbox, Dialog, and more.
