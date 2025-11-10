# Story 2.1: Create GitHub Actions Workflow for Docusaurus Build

Status: drafted

## Story

As a developer,
I want automated builds on GitHub Actions,
so that my blog is automatically built and ready for deployment on every push to main.

## Acceptance Criteria

1. **GitHub Actions Workflow Created** - Workflow file configured:
   - Located at `.github/workflows/deploy.yml`
   - Triggers on push to `main` branch
   - Uses Node.js 20 (matching local environment)
   - Installs dependencies with `npm ci`
   - Builds site with `npm run build`
   - Uploads build artifact for deployment

2. **Build Configuration** - Build process configured correctly:
   - Environment variables set (if needed)
   - Build completes successfully
   - Output directory `build/` generated
   - No build errors or warnings (except expected tag warnings)

3. **GitHub Pages Setup** - Repository configured for Pages:
   - GitHub Pages enabled in repository settings
   - Source set to GitHub Actions
   - Permissions configured for workflow to deploy

4. **First Successful Build** - Initial workflow run succeeds:
   - Workflow triggers on push
   - Build completes without errors
   - Site deployed to GitHub Pages
   - Site accessible at https://jamescrowley321.github.io/personal-blog/

## Tasks / Subtasks

- [ ] Task 1: Create GitHub Actions Workflow File (AC: #1)
  - [ ] Create `.github/workflows/` directory structure
  - [ ] Create `deploy.yml` workflow file
  - [ ] Configure trigger on push to main branch
  - [ ] Set up Node.js 20 environment
  - [ ] Add npm ci and build steps
  - [ ] Configure artifact upload for Pages deployment

- [ ] Task 2: Configure GitHub Pages Settings (AC: #3)
  - [ ] Enable GitHub Pages in repository settings
  - [ ] Set source to GitHub Actions
  - [ ] Configure workflow permissions for Pages deployment
  - [ ] Verify repository visibility settings

- [ ] Task 3: Test Initial Deployment (AC: #2, #4)
  - [ ] Commit and push workflow file
  - [ ] Monitor GitHub Actions run
  - [ ] Verify build completes successfully
  - [ ] Check for build errors or warnings
  - [ ] Confirm site deployed to GitHub Pages URL
  - [ ] Access site and verify it loads correctly

## Dev Notes

### Learnings from Previous Story

**From Story 1-5-validate-local-development-environment-end-to-end (Status: done)**

- **Docker Performance**: Startup 0.438s, shutdown 0.603s - exceptional performance
- **Build Validation**: No errors in build logs, all features functional
- **Configuration Validated**: `docusaurus.config.ts` contains all settings
- **Documentation Complete**: README.md comprehensive
- **Epic 1 Complete**: All components validated and working together

**Key Configuration:**
- Node.js version: 20 (from Docker Compose)
- Base URL: `/personal-blog/` (configured in docusaurus.config.ts)
- Organization: `jamescrowley321`
- Repository: `personal-blog`

[Source: stories/1-5-validate-local-development-environment-end-to-end.md]

### Architecture Notes

**GitHub Actions for Docusaurus:**

Docusaurus provides official GitHub Actions deployment:
- Use `actions/deploy-pages@v4` for Pages deployment
- Use `actions/upload-pages-artifact@v3` to upload build
- Requires `pages: write` and `id-token: write` permissions

**Workflow Structure:**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: build
      - uses: actions/deploy-pages@v4
        id: deployment
```

### Project Structure Notes

**New Files to Create:**
```
personal-blog/
└── .github/
    └── workflows/
        └── deploy.yml    # GitHub Actions workflow
```

**Existing Configuration (Already Correct):**
- `docusaurus.config.ts` - Base URL and org already configured
- `package.json` - Build scripts already defined

### References

- [Docusaurus Deployment - GitHub Pages](https://docusaurus.io/docs/deployment#deploying-to-github-pages)
- [GitHub Actions - Deploy Pages](https://github.com/actions/deploy-pages)
- [GitHub Actions - Upload Pages Artifact](https://github.com/actions/upload-pages-artifact)
- PRD: Epic 2 - GitHub Pages Deployment Pipeline
- Architecture: Deployment configuration

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
