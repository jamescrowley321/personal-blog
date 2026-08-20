# Epic Technical Specification: Docusaurus Foundation & Local Dev

Date: 2025-01-08
Author: James Crowley
Epic ID: 1
Status: Draft

---

## Overview

This epic establishes the foundational local development environment for the personal technical blog platform. It implements Docusaurus 3.9 as the static site generator with Docker Compose for consistent cross-platform development, enabling markdown-first content authoring with live preview and draft management capabilities.

## Objectives and Scope

**Objectives:**
- Create reproducible local development environment using Docker Compose
- Configure Docusaurus 3.9 with the classic preset for MVP
- Establish article authoring workflow (markdown + YAML front matter)
- Implement draft-to-published content workflow
- Enable local preview with hot reload for rapid iteration

**In Scope:**
- Docusaurus 3.9 initialization with GitHub Pages-compatible configuration
- Docker Compose setup (node:20-alpine image)
- @docusaurus/preset-classic default theme configuration (no customization)
- Article front matter template (title, date, tags, description, canonical_url)
- Draft management (`draft: true` front matter → published post workflow)
- Local preview server with hot reload (`npm start`)
- Basic project structure (directories, config files, .gitignore)

**Out of Scope:**
- Custom theme design (deferred to post-MVP)
- Multi-platform publishing (Epic 3)
- GitHub Actions CI/CD (Epic 2)
- Production deployment (Epic 2)
- Analytics, comments, or other advanced features

## System Architecture Alignment

This epic implements ADR-001 (Docusaurus 3.9 selection) and ADR-004 (Docker Compose for local dev). It establishes the project structure defined in architecture.md:57-99, including `blog/`, `docs/`, `build/`, `static/`, and configuration files. The Docker Compose configuration aligns with the architecture specification at lines 132-147, using the node:20-alpine image with hot reload enabled.

**Key Architecture Components Referenced:**
- Static Site Generator: Docusaurus 3.9 (architecture.md:57)
- Local Development: Docker Compose with node:20-alpine image (architecture.md:59)
- Theme: @docusaurus/preset-classic bundled with Docusaurus (architecture.md:58)
- Configuration: `docusaurus.config.ts` with GitHub Pages compatibility (architecture.md:132-147)

**Constraints:**
- Must use Docusaurus 3.9 for GitHub Pages deployment compatibility
- Must use default @docusaurus/preset-classic theme (no customization for MVP)
- Docker Compose environment must match production GitHub Pages build
- All content must be Markdown/MDX with YAML front matter

## Detailed Design

### Services and Modules

| Module | Responsibility | Inputs | Outputs | Owner |
|--------|---------------|--------|---------|-------|
| **Docusaurus Build Engine** | Static site generation from Markdown/MDX | Markdown/MDX files, `docusaurus.config.ts`, theme files | HTML/CSS/JS in `build/` | Docusaurus 3.9 |
| **Docker Compose Service** | Local development environment | `docker-compose.yml`, source files | Running Docusaurus dev server on port 3000 | Docker |
| **Webpack HMR (Hot Reload)** | Hot reload on file changes | File system changes | Browser refresh signals | Docusaurus dev server (webpack) |
| **Classic Theme** | Default UI styling and layout | Docusaurus configuration, Markdown/MDX content | Rendered HTML pages | @docusaurus/preset-classic |
| **Front Matter Parser** | Extract metadata from markdown | YAML front matter blocks | Post metadata objects | Docusaurus |

### Data Models and Contracts

**Article Front Matter Schema:**

```yaml
---
title: string (required, max 100 chars)
date: YYYY-MM-DD (required, ISO 8601 format)
tags: array<string> (required, max 4 tags for platform compatibility)
description: string (required, max 160 chars for SEO)
canonical_url: string (required, full URL to GitHub Pages version)
draft: boolean (optional, default false; set `draft: true` to exclude from production build)
---
```

**Docusaurus Configuration (docusaurus.config.ts):**

```ts
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Personal Technical Blog',
  tagline: 'Technical articles on cloud architecture, identity, GIS, and multi-language development',
  url: 'https://jamescrowley321.github.io',
  baseUrl: '/personal-blog/',
  organizationName: 'jamescrowley321',
  projectName: 'personal-blog',

  presets: [
    [
      'classic',
      {
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: 'all', // RSS + Atom
          },
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
};

export default config;
```

**Docker Compose Configuration (docker-compose.yml):**

```yaml
version: '3'
services:
  docusaurus:
    image: node:20-alpine
    working_dir: /app
    command: sh -c "npm install && npm start -- --host 0.0.0.0"
    ports:
      - "3001:3000"
    volumes:
      - .:/app
    environment:
      - NODE_ENV=development
```

**Project Structure:**

```
personal-blog/
├── blog/                       # Published articles (trigger syndication in Epic 2)
│   ├── YYYY-MM-DD-title.md      #   dated Markdown/MDX posts (drafts use `draft: true`)
│   ├── authors.yml             #   author definitions
│   └── tags.yml                #   tag definitions
├── docs/                       # Documentation pages
├── src/
│   ├── css/
│   │   └── custom.css          # Custom theme styling
│   └── pages/                  # Standalone pages
├── static/
│   └── img/                    # Article images
├── build/                      # Docusaurus build output (gitignored)
├── .gitignore
├── docusaurus.config.ts        # Docusaurus configuration
├── sidebars.ts                 # Sidebar configuration
├── docker-compose.yml          # Local development environment
├── package.json                # Node.js dependencies
├── package-lock.json
└── README.md                   # Setup instructions
```

### APIs and Interfaces

**Docusaurus CLI Interface:**

```bash
# Build site (production)
npm run build

# Serve locally with hot reload (development; drafts shown in dev)
npm start -- --host 0.0.0.0

# Clear build artifacts and cache
npm run clear
```

**Docker Compose Interface:**

```bash
# Start local development environment
docker-compose up

# Stop environment
docker-compose down

# Rebuild environment (after package.json changes)
docker-compose up --build
```

**File System Interface:**

- **Input**: Markdown/MDX files in `blog/` (published, or `draft: true` for unpublished)
- **Output**: Static HTML/CSS/JS in `build/` directory
- **Hot Reload**: File changes trigger automatic rebuild and browser refresh

### Workflows and Sequencing

**Article Creation Workflow:**

1. **Developer** creates new Markdown/MDX file in `blog/` with `draft: true` front matter
2. **Developer** writes content with YAML front matter
3. **Docusaurus** (via Docker) hot reloads and renders draft locally
4. **Developer** previews at `http://localhost:3001`
5. **Developer** iterates on content with hot reload
6. **Developer** removes `draft: true` from front matter when ready to publish
7. **File naming**: post file follows `YYYY-MM-DD-title.md` (or `.mdx`) format
8. **Docusaurus** rebuilds site with published article
9. **Developer** commits to Git (triggers Epic 2 workflows in future)

**Local Development Startup Sequence:**

```
1. Developer runs: docker-compose up
2. Docker pulls node:20-alpine image (if not cached)
3. Docker mounts current directory to /app
4. npm installs dependencies from package.json
5. Docusaurus builds site (blog/ and docs/)
6. Docusaurus dev server starts on port 3000 (mapped to host 3001)
7. Webpack hot module replacement (HMR) initializes
8. Developer opens browser to http://localhost:3001
9. Developer edits Markdown/MDX files
10. Docusaurus detects changes → rebuilds → HMR refreshes browser
```

**Draft to Published Transition:**

```
blog/2025-01-08-article-idea.md  (draft: true in front matter, unpublished)
         ↓ (content complete, remove draft: true)
blog/2025-01-08-article-idea.md  (published, dated)
         ↓ (git commit - future Epic 2)
GitHub Actions triggered → multi-platform publish
```

## Non-Functional Requirements

### Performance

**Build Performance Targets (NFR-1 from PRD):**
- Docker Compose startup: **<30 seconds** from `docker-compose up` to server ready
- Docusaurus initial build: **<2 minutes** for up to 50 articles
- Hot reload cycle: **<5 seconds** from file save to browser refresh
- Local preview responsiveness: Immediate page navigation (<1 second)

**Rationale:** Fast iteration cycles are critical for sustainable weekly article production pace. NFR-1 (PRD:407-410) specifies these targets to ensure developer productivity.

**Measurement:**
- Time `docker-compose up` from start to "Server running" message
- Monitor Docusaurus build logs for compilation time
- Test file change → browser refresh latency

### Security

**Local Development Security (NFR-3 from PRD):**
- No secrets in `docusaurus.config.ts` or committed files
- `.gitignore` includes `build/`, `node_modules/`, and sensitive files
- Docker container runs with non-root user permissions
- No external network access required for local development
- HTTPS not required for localhost (HTTP on port 3001 is acceptable)

**Content Security:**
- Markdown sanitization handled by Docusaurus/MDX (prevents XSS)
- No user input processed (content from trusted local filesystem only)
- No JavaScript execution in markdown (static HTML output)

**Rationale:** NFR-3 (PRD:435-445) focuses on API key security for multi-platform publishing, but Epic 1 has no secrets. The only security concern is preventing accidental commit of build artifacts or sensitive local configuration.

### Reliability/Availability

**Local Environment Reliability (NFR-2 from PRD):**
- Docker Compose must start successfully on macOS, Linux, and Windows
- Docusaurus build must succeed for valid Markdown/MDX + front matter
- Graceful error reporting for invalid front matter or markdown syntax
- Hot reload (HMR) should reconnect automatically after container restart
- File watching should handle rapid successive edits without crashing

**Error Handling:**
- Invalid YAML front matter → Clear error message with line number
- Missing required fields (title, date, tags, description, canonical_url) → Build fails with specific field identified
- Markdown syntax errors → Docusaurus reports file and error location
- Docker image pull failure → Retry mechanism or clear offline instruction

**Availability:** 100% uptime expected for local development (single-user, no network dependencies)

**Rationale:** NFR-2 (PRD:423-433) emphasizes reliability for production automation. For Epic 1, reliability means consistent local build success and helpful error messages.

### Observability

**Local Development Observability (NFR-4 from PRD):**
- Docusaurus build logs visible in terminal (stdout)
- File change detection logged ("client compiled successfully")
- Build errors displayed with file paths and line numbers
- Hot reload (HMR) connection status visible in browser console
- Docker container logs accessible via `docker-compose logs`

**Debug Information:**
- Docusaurus version logged on startup
- npm install progress visible
- Build time reported after each regeneration
- Port binding confirmation (3001)

**No Metrics Required:** Epic 1 is local-only; no telemetry, APM, or monitoring infrastructure needed until production deployment (Epic 2).

**Rationale:** NFR-4 (PRD:447-463) covers maintainability and debugging. For local development, this means clear console output and accessible logs.

## Dependencies and Integrations

### Dependencies

**Node.js Dependencies (package.json):**

```json
{
  "name": "personal-blog",
  "version": "0.0.0",
  "scripts": {
    "start": "docusaurus start",
    "build": "docusaurus build",
    "serve": "docusaurus serve",
    "clear": "docusaurus clear"
  },
  "dependencies": {
    "@docusaurus/core": "3.9.0",
    "@docusaurus/preset-classic": "3.9.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@docusaurus/module-type-aliases": "3.9.0",
    "@docusaurus/tsconfig": "3.9.0",
    "typescript": "~5.5.0"
  },
  "engines": {
    "node": ">=20.0"
  }
}
```

**Version Constraints:**
- **Docusaurus 3.9**: Required for GitHub Pages compatibility (architecture.md:57)
- **@docusaurus/preset-classic**: Default theme bundled with Docusaurus (architecture.md:58)
- **Blog feed (preset-classic)**: RSS + Atom feed generation (PRD:325)
- **Sitemap (preset-classic)**: SEO sitemap generation (PRD:326)

**Docker Dependencies:**
- **Base Image**: `node:20-alpine` (official Node.js Docker image)
- **Docker**: Version 20.10+ recommended
- **Docker Compose**: Version 1.29+ or 2.x

**System Dependencies** (handled by Docker image):
- Node.js 20+
- npm 10+
- TypeScript 5.x (for config and type checking)

### Integration Points

**No External Integrations in Epic 1:**

Epic 1 is purely local development setup. All integrations deferred to later epics:

- **GitHub Pages** → Epic 2 (Deployment Pipeline)
- **Dev.to API** → Epic 3 (Multi-Platform Syndication)
- **Medium API** → Epic 3 (Multi-Platform Syndication)
- **Hashnode GraphQL API** → Epic 3 (Multi-Platform Syndication)
- **GitHub Actions** → Epic 2 (CI/CD Pipeline)

**Internal Integrations:**
- **Docker ↔ Docusaurus**: Volume mount (`.:/app`) shares local filesystem with container
- **Docusaurus ↔ Webpack HMR**: WebSocket connection on the dev server for browser refresh
- **Browser ↔ Docusaurus Server**: HTTP on port 3001 for preview

**File System Integration:**
- **Input**: Markdown/MDX files in `blog/` and `docs/`
- **Output**: Static HTML/CSS/JS in `build/`
- **Configuration**: `docusaurus.config.ts`, `sidebars.ts`, `docker-compose.yml`, `package.json`

### Dependency Version Pinning Strategy

**Rationale (NFR-4 from PRD:460):**
- Pin major.minor for Docusaurus (3.9.x) to maintain build reproducibility
- Pin major.minor for preset and plugins to ensure stability
- Lock with `package-lock.json` after initial `npm install`
- Docker image pinned to specific tag (`node:20-alpine`) not `latest`

**Upgrade Path:**
- Test Docusaurus upgrades in separate branch before merging
- Verify GitHub Pages deployment before updating Docusaurus version
- Review Docusaurus changelogs for breaking changes

## Acceptance Criteria (Authoritative)

**AC-1.1: Project Initialization (Story 1.1)**
- ✅ `docker-compose.yml` file created with node:20-alpine image
- ✅ `docker-compose up` successfully starts Docusaurus dev server on host port 3001
- ✅ Hot reload (webpack HMR) active in the browser
- ✅ Project directory structure created (`blog/`, `docs/`, `src/`, `static/img/`)
- ✅ `.gitignore` includes `build/`, `node_modules/`, `.docusaurus/`
- ✅ `package.json` created with Docusaurus 3.9 and required dependencies
- ✅ `README.md` contains setup instructions for Docker Compose workflow
- ✅ Local environment starts in <30 seconds

**AC-1.2: Docusaurus Configuration (Story 1.2)**
- ✅ `docusaurus.config.ts` created with @docusaurus/preset-classic theme configuration
- ✅ Site builds successfully with default classic theme
- ✅ Homepage displays "Personal Technical Blog" title
- ✅ Blog feed generates RSS + Atom feeds at `/blog/rss.xml` and `/blog/atom.xml`
- ✅ preset-classic generates sitemap at `/sitemap.xml`
- ✅ Content rendered via Markdown/MDX
- ✅ Code syntax highlighting works for fenced code blocks (Prism)
- ✅ Classic theme renders correctly on mobile and desktop

**AC-1.3: Article Structure and Front Matter (Story 1.3)**
- ✅ Front matter template documented with all required fields (title, date, tags, description, canonical_url)
- ✅ Sample article created demonstrating front matter usage
- ✅ Docusaurus validates required front matter fields on build
- ✅ Articles with invalid/missing front matter fail build with clear error message
- ✅ Tags are parsed and displayed on article pages
- ✅ Canonical URL appears in HTML `<link rel="canonical">` tag
- ✅ Article description used in meta description tag for SEO

**AC-1.4: Draft Management Workflow (Story 1.4)**
- ✅ Draft workflow configured using `draft: true` front matter
- ✅ Posts with `draft: true` do not appear in production build (`npm run build`)
- ✅ `docker-compose up` (dev server) renders draft posts automatically
- ✅ Draft posts visible at their normal blog URL in local preview
- ✅ Removing `draft: true` from front matter publishes the article
- ✅ Draft posts can omit the filename date prefix by supplying a `date:` front matter field
- ✅ Published posts in `blog/` follow naming convention `YYYY-MM-DD-title.md` (or `.mdx`)

**AC-1.5: Local Preview with Live Reload (Story 1.5)**
- ✅ Docusaurus dev server accessible at `http://localhost:3001`
- ✅ Webpack HMR WebSocket connects on page load
- ✅ File changes trigger automatic rebuild
- ✅ Browser refreshes automatically within 5 seconds of file save
- ✅ Markdown edits reflected immediately in preview
- ✅ YAML front matter changes trigger rebuild and refresh
- ✅ Build errors displayed in terminal with file path and line number
- ✅ Multiple file edits in quick succession handled gracefully (no crash)

## Traceability Mapping

| AC ID | PRD Requirement | Spec Section | Component | Test Strategy |
|-------|----------------|--------------|-----------|---------------|
| **AC-1.1** | FR-1.3 (Local preview via Docker Compose) | Docker Compose Configuration | docker-compose.yml, package.json | Manual: Run `docker-compose up`, verify server starts <30s |
| **AC-1.2** | FR-2.1 (Static site build), FR-2.2 (Site structure) | Docusaurus Configuration | docusaurus.config.ts, classic theme | Manual: Build site, verify RSS/sitemap, check syntax highlighting |
| **AC-1.3** | FR-1.1 (Markdown with YAML front matter) | Article Front Matter Schema | Front matter parser, sample article | Manual: Create article with/without required fields, verify validation |
| **AC-1.4** | FR-1.2 (Draft management) | Draft to Published Transition | blog/ posts with draft: true | Manual: Create draft post, remove draft: true, verify publishing workflow |
| **AC-1.5** | FR-1.3 (Local preview with live reload), NFR-1 (Performance) | Local Development Startup Sequence, Webpack HMR | npm start, webpack HMR | Manual: Edit file, time reload cycle (<5s), test multiple rapid edits |

**PRD Requirements Coverage:**
- ✅ FR-1.1: Content Authoring (Markdown/YAML) → AC-1.3
- ✅ FR-1.2: Draft Management → AC-1.4
- ✅ FR-1.3: Local Preview → AC-1.1, AC-1.5
- ✅ FR-2.1: Static Site Build → AC-1.2
- ✅ FR-2.2: Site Structure (RSS, sitemap) → AC-1.2
- ✅ NFR-1: Performance (<30s startup, <5s reload) → AC-1.1, AC-1.5
- ✅ NFR-4: Maintainability (clear errors, logging) → AC-1.5
- ✅ NFR-5: Portability (Docker cross-platform) → AC-1.1

**Architecture Alignment:**
- ✅ ADR-001 (Docusaurus 3.9) → AC-1.1, AC-1.2
- ✅ ADR-004 (Docker Compose) → AC-1.1, AC-1.5
- ✅ Project Structure (architecture.md:73-99) → AC-1.1
- ✅ Docker Compose Config (architecture.md:132-147) → AC-1.1

## Risks, Assumptions, Open Questions

**Risks:**

**R1: Docker Installation Complexity (Severity: LOW)**
- **Description**: User may not have Docker/Docker Compose installed, creating setup friction
- **Impact**: Delays initial development environment setup
- **Mitigation**: Provide clear README instructions with Docker installation links for macOS/Linux/Windows
- **Fallback**: Document native Node.js/npm installation as alternative (though not recommended for consistency)

**R2: Port Conflicts (Severity: LOW)**
- **Description**: Port 3001 may be in use by other services
- **Impact**: docker-compose up fails with port binding error
- **Mitigation**: Document how to change ports in docker-compose.yml
- **Detection**: Clear error message from Docker

**R3: File Permission Issues on Windows (Severity: LOW)**
- **Description**: Docker volume mounts may have permission issues on Windows
- **Impact**: Docusaurus may not be able to write to `build/` or `.docusaurus/`
- **Mitigation**: Document Windows-specific Docker Desktop settings (file sharing)
- **Reference**: Known Docker Desktop on Windows issue

**R4: Docusaurus Version Drift (Severity: MEDIUM)**
- **Description**: The GitHub Actions build environment (Node.js or Docusaurus version) may drift from the local 3.9 setup
- **Impact**: Local builds succeed but GitHub Pages deployment fails (in Epic 2)
- **Mitigation**: Pin Docusaurus and Node.js versions in package.json, pin the Node version in the Actions workflow
- **Prevention**: Regular testing against the pinned Actions build environment

**Assumptions:**

**A1: Docker Availability**
- User has Docker and Docker Compose installed (or can install them)
- User has basic familiarity with command-line tools
- Docker Desktop has sufficient resources (minimum 2GB RAM allocated)

**A2: Network Access**
- User can pull Docker images from Docker Hub (`node:20-alpine`)
- User can install npm packages from the npm registry
- No corporate firewall blocks Docker Hub or npm downloads

**A3: Browser Compatibility**
- Modern browser supports webpack HMR WebSocket connections
- Browser JavaScript enabled for hot reload functionality
- Browser can access localhost URLs

**A4: File System**
- Case-sensitive file systems work correctly (primarily impacts macOS case-insensitive default)
- File watching works on user's OS (may require Docker Desktop file sharing on Windows)
- Sufficient disk space for `build/` output, `node_modules/`, and Docker images (~500MB)

**A5: Docusaurus Stability**
- Docusaurus 3.9 is stable and maintained
- @docusaurus/preset-classic is compatible with Docusaurus 3.9
- The classic preset's blog feed and sitemap plugins are stable

**Open Questions:**

**Q1: Sample Article Content**
- Should we include a sample "Hello World" article in `blog/` after initialization?
- **Decision**: Yes, include minimal sample to demonstrate front matter and markdown rendering

**Q2: Git Repository Initialization**
- Should Story 1.1 initialize a Git repository (`git init`)?
- **Decision**: Yes, include `git init` and initial `.gitignore` as part of project setup

**Q3: Author Email Configuration**
- How should we handle author details (e.g., email) in `blog/authors.yml`? Placeholder or ask user?
- **Decision**: Use placeholder `[author email]` in `authors.yml`, document in README to update

**Q4: Dev Server Port Configuration**
- Should we make the host port (3001) configurable in docker-compose.yml?
- **Decision**: Not for MVP - default port is standard, changing adds complexity

## Test Strategy Summary

**Test Approach:**

Epic 1 is foundational infrastructure with **manual validation** for all acceptance criteria. No automated testing for local development setup.

**Test Levels:**

1. **Environment Setup Testing**
   - **Scope**: AC-1.1 (Project initialization)
   - **Method**: Manual execution of `docker-compose up`, verify server starts
   - **Success Criteria**: Server running on port 3001 within 30 seconds
   - **Platforms**: Test on macOS, Linux, Windows (if available)

2. **Configuration Testing**
   - **Scope**: AC-1.2 (Docusaurus configuration)
   - **Method**: Build site, inspect generated files (`build/`, `/blog/rss.xml`, `/sitemap.xml`)
   - **Success Criteria**: All plugins active, theme renders correctly
   - **Validation**: Visual inspection in browser, check HTML source for canonical tags

3. **Content Authoring Testing**
   - **Scope**: AC-1.3 (Article structure and front matter)
   - **Method**: Create test articles with valid/invalid front matter
   - **Success Criteria**: Valid articles build successfully, invalid articles fail with clear errors
   - **Edge Cases**: Missing required fields, malformed YAML, invalid date formats

4. **Workflow Testing**
   - **Scope**: AC-1.4 (Draft management)
   - **Method**: Create draft post (`draft: true`), verify not in production build, remove `draft: true`, verify published
   - **Success Criteria**: Drafts visible only in the dev server, published articles always visible

5. **Performance Testing**
   - **Scope**: AC-1.5 (Live reload), NFR-1 (Performance)
   - **Method**: Time startup, time reload cycles, test rapid edits
   - **Success Criteria**: <30s startup, <5s reload, no crashes on rapid edits
   - **Tools**: Stopwatch/timer, browser DevTools Network tab

**Test Coverage:**

- ✅ **Happy path**: Standard article creation, draft-to-publish workflow
- ✅ **Error cases**: Invalid front matter, missing fields, malformed YAML
- ✅ **Edge cases**: Rapid file edits, port conflicts, missing dependencies
- ✅ **Performance**: Startup time, reload time (NFR-1 targets)
- ⚠️ **Cross-platform**: Test on multiple OSes if available (best effort)

**No Automated Tests:**

- **Rationale**: Epic 1 is local development setup, not application code
- **Manual validation sufficient**: One-time setup, low change frequency
- **Future consideration**: Could add smoke tests for subsequent epics

**Test Documentation:**

- Test results recorded in Story acceptance criteria checkboxes
- Issues documented in GitHub Issues or sprint retrospective
- Performance measurements logged for baseline comparison
