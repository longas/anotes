# anotes

Apple Notes CLI for AI agents.

## Releasing

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning and npm publishing.

### How it works

1. semantic-release analyzes commit messages on `main` to determine the next version bump
2. A GitHub Actions workflow (`.github/workflows/release.yml`) runs on every push to `main`
3. If there are releasable commits, it automatically bumps the version, creates a GitHub Release with release notes, and publishes to npm

### Commit message format

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

- `fix: description` — triggers a **patch** release (0.0.x)
- `feat: description` — triggers a **minor** release (0.x.0)
- `feat!: description` or a commit with `BREAKING CHANGE:` in the footer — triggers a **major** release (x.0.0)
- `chore:`, `docs:`, `style:`, `refactor:`, `test:`, `ci:` — **no release**

Examples:
```
fix: handle empty note body in search results
feat: add folder listing command
feat!: rename --format flag to --output
```

### Setup required

Before the first release:

1. **First publish**: OIDC trusted publishing can't publish the initial version. Run `npm login && npm publish --access public` manually once.
2. **Trusted Publishing**: On [npmjs.com](https://www.npmjs.com/) → package settings → Trusted Publishers, add: owner `longas`, repo `anotes`, workflow `release.yml`.
3. **GITHUB_TOKEN**: Provided automatically by GitHub Actions, no setup needed.

### Releasing locally (dry run)

To preview what semantic-release would do without actually publishing:

```sh
GITHUB_TOKEN=<token> npx semantic-release --dry-run
```

### Default plugins

semantic-release ships with these plugins enabled by default (no extra config needed):

- `@semantic-release/commit-analyzer` — determines version bump from commits
- `@semantic-release/release-notes-generator` — generates release notes
- `@semantic-release/npm` — publishes to npm
- `@semantic-release/github` — creates GitHub Releases
