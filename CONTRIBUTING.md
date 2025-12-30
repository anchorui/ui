# Contributing to Anchor UI

Anchor UI is an open-source headless React component library. We welcome contributions from the community!

## Getting Started

1. **Fork the repository** and clone your fork locally
2. **Install dependencies**: `pnpm install`
3. **Start the development server**: `pnpm start` (runs the docs site on port 3005)
4. **Run tests**: `pnpm test:jsdom` or `pnpm test:chromium`

## Development Guidelines

- **Package Manager**: Anchor UI uses `pnpm` exclusively. Other package managers are not supported.
- **Code Style**: Follow the existing code style and use Prettier for formatting
- **Testing**: All components must have comprehensive tests. Run `pnpm test` before submitting PRs
- **TypeScript**: All code must be properly typed. Run `pnpm typescript` to verify types

## Anchor UI Architecture

Anchor UI is built using proven architectural patterns, but is an independent library with its own codebase, APIs, and development practices. While we leverage architectural inspiration from Base UI, Anchor UI maintains its own:

- Component APIs and prop interfaces
- Type definitions and TypeScript types
- Build system and tooling
- Documentation and examples
- Roadmap and feature development

## Submitting Changes

1. Create a feature branch from `master`
2. Make your changes with tests
3. Ensure all tests pass: `pnpm test`
4. Run linting: `pnpm eslint`
5. Submit a pull request with a clear description

## Questions?

- Open an issue on GitHub
- Check existing discussions in GitHub Discussions
- Follow [@anchor_ui](https://x.com/anchor_ui) for updates

## License

By contributing to Anchor UI, you agree to follow the terms of the [MIT license](/LICENSE).
