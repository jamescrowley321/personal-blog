# Epic Technical Specification: Jekyll Foundation & Local Dev

Date: 2025-01-08
Author: James Crowley
Epic ID: 1
Status: Draft

---

## Overview

This epic establishes the foundational local development environment for the personal technical blog platform. It implements Jekyll 3.9.3 as the static site generator with Docker Compose for consistent cross-platform development, enabling markdown-first content authoring with live preview and draft management capabilities.

## Objectives and Scope

**Objectives:**
- Create reproducible local development environment using Docker Compose
- Configure Jekyll 3.9.3 with Minima theme for MVP
- Establish article authoring workflow (markdown + YAML front matter)
- Implement draft-to-published content workflow
- Enable local preview with live reload for rapid iteration

**In Scope:**
- Jekyll 3.9.3 initialization with GitHub Pages-compatible configuration
- Docker Compose setup (jekyll/jekyll:3.9 image)
- Minima default theme configuration (no customization)
- Article front matter template (title, date, tags, description, canonical_url)
- Draft management (`_drafts/` → `_posts/` workflow)
- Local preview server with live reload (`--livereload` flag)
- Basic project structure (directories, config files, .gitignore)

**Out of Scope:**
- Custom theme design (deferred to post-MVP)
- Multi-platform publishing (Epic 3)
- GitHub Actions CI/CD (Epic 2)
- Production deployment (Epic 2)
- Analytics, comments, or other advanced features

## System Architecture Alignment

This epic implements ADR-001 (Jekyll 3.9.3 selection) and ADR-004 (Docker Compose for local dev). It establishes the project structure defined in architecture.md:57-99, including `_posts/`, `_drafts/`, `_site/`, `assets/`, and configuration files. The Docker Compose configuration aligns with the architecture specification at lines 132-147, using the jekyll/jekyll:3.9 image with livereload enabled.

**Key Architecture Components Referenced:**
- Static Site Generator: Jekyll 3.9.3 (architecture.md:57)
- Local Development: Docker Compose with jekyll/jekyll:3.9 image (architecture.md:59)
- Theme: Minima default theme bundled with Jekyll (architecture.md:58)
- Configuration: `_config.yml` with GitHub Pages compatibility (architecture.md:132-147)

**Constraints:**
- Must use Jekyll 3.9.3 for GitHub Pages native compatibility
- Must use default Minima theme (no customization for MVP)
- Docker Compose environment must match production GitHub Pages build
- All content must be pure markdown with YAML front matter

## Detailed Design

### Services and Modules

| Module | Responsibility | Inputs | Outputs | Owner |
|--------|---------------|--------|---------|-------|
| **Jekyll Build Engine** | Static site generation from markdown | Markdown files, `_config.yml`, theme files | HTML/CSS/JS in `_site/` | Jekyll 3.9.3 |
| **Docker Compose Service** | Local development environment | `docker-compose.yml`, source files | Running Jekyll server on port 4000 | Docker |
| **LiveReload Server** | Hot reload on file changes | File system changes | Browser refresh signals | Jekyll livereload plugin |
| **Minima Theme** | Default UI styling and layout | Jekyll configuration, markdown content | Rendered HTML pages | Jekyll bundled theme |
| **Front Matter Parser** | Extract metadata from markdown | YAML front matter blocks | Post metadata objects | Jekyll |

### Data Models and Contracts

**Article Front Matter Schema:**

```yaml
---
title: string (required, max 100 chars)
date: YYYY-MM-DD (required, ISO 8601 format)
tags: array<string> (required, max 4 tags for platform compatibility)
description: string (required, max 160 chars for SEO)
canonical_url: string (required, full URL to GitHub Pages version)
published: boolean (optional, default true for _posts/, false for _drafts/)
---
```

**Jekyll Configuration (_config.yml):**

```yaml
title: Personal Technical Blog
email: [author email]
description: Technical articles on cloud architecture, identity, GIS, and multi-language development
baseurl: "" # GitHub Pages will set this
url: "" # GitHub Pages will set this

# Build settings
markdown: kramdown
theme: minima
plugins:
  - jekyll-feed
  - jekyll-sitemap

# Exclude from processing
exclude:
  - Gemfile
  - Gemfile.lock
  - node_modules
  - vendor
  - .git
  - .gitignore
  - README.md

# Collections
collections:
  drafts:
    output: false
```

**Docker Compose Configuration (docker-compose.yml):**

```yaml
version: '3'
services:
  jekyll:
    image: jekyll/jekyll:3.9
    command: jekyll serve --drafts --livereload --host 0.0.0.0
    ports:
      - "4000:4000"
      - "35729:35729"  # LiveReload
    volumes:
      - .:/srv/jekyll
    environment:
      - JEKYLL_ENV=development
```

**Project Structure:**

```
personal-blog/
├── _posts/                    # Published articles (trigger syndication in Epic 2)
│   └── YYYY-MM-DD-title.md
├── _drafts/                   # Unpublished drafts (no syndication)
│   └── work-in-progress.md
├── _site/                     # Jekyll build output (gitignored)
├── assets/
│   └── images/               # Article images
├── .gitignore
├── _config.yml               # Jekyll configuration
├── docker-compose.yml        # Local development environment
├── Gemfile                   # Ruby dependencies
├── Gemfile.lock
└── README.md                 # Setup instructions
```

### APIs and Interfaces

**Jekyll CLI Interface:**

```bash
# Build site (production)
jekyll build

# Serve locally with drafts and livereload (development)
jekyll serve --drafts --livereload --host 0.0.0.0

# Clean build artifacts
jekyll clean
```

**Docker Compose Interface:**

```bash
# Start local development environment
docker-compose up

# Stop environment
docker-compose down

# Rebuild environment (after Gemfile changes)
docker-compose up --build
```

**File System Interface:**

- **Input**: Markdown files in `_posts/` (published) or `_drafts/` (unpublished)
- **Output**: Static HTML/CSS/JS in `_site/` directory
- **Hot Reload**: File changes trigger automatic rebuild and browser refresh

### Workflows and Sequencing

**Article Creation Workflow:**

1. **Developer** creates new markdown file in `_drafts/`
2. **Developer** writes content with YAML front matter
3. **Jekyll** (via Docker) hot reloads and renders draft locally
4. **Developer** previews at `http://localhost:4000`
5. **Developer** iterates on content with live reload
6. **Developer** moves file from `_drafts/` to `_posts/` when ready
7. **File naming**: Rename to `YYYY-MM-DD-title.md` format
8. **Jekyll** rebuilds site with published article
9. **Developer** commits to Git (triggers Epic 2 workflows in future)

**Local Development Startup Sequence:**

```
1. Developer runs: docker-compose up
2. Docker pulls jekyll/jekyll:3.9 image (if not cached)
3. Docker mounts current directory to /srv/jekyll
4. Jekyll installs gems from Gemfile
5. Jekyll builds site (_posts/ and _drafts/)
6. Jekyll starts server on port 4000
7. LiveReload server starts on port 35729
8. Developer opens browser to http://localhost:4000
9. Developer edits markdown files
10. Jekyll detects changes → rebuilds → LiveReload refreshes browser
```

**Draft to Published Transition:**

```
_drafts/article-idea.md  (unpublished, no date prefix)
         ↓ (content complete)
_posts/2025-01-08-article-idea.md  (published, dated)
         ↓ (git commit - future Epic 2)
GitHub Actions triggered → multi-platform publish
```

## Non-Functional Requirements

### Performance

**Build Performance Targets (NFR-1 from PRD):**
- Docker Compose startup: **<30 seconds** from `docker-compose up` to server ready
- Jekyll initial build: **<2 minutes** for up to 50 articles
- Hot reload cycle: **<5 seconds** from file save to browser refresh
- Local preview responsiveness: Immediate page navigation (<1 second)

**Rationale:** Fast iteration cycles are critical for sustainable weekly article production pace. NFR-1 (PRD:407-410) specifies these targets to ensure developer productivity.

**Measurement:**
- Time `docker-compose up` from start to "Server running" message
- Monitor Jekyll build logs for compilation time
- Test file change → browser refresh latency

### Security

**Local Development Security (NFR-3 from PRD):**
- No secrets in `_config.yml` or committed files
- `.gitignore` includes `_site/`, `Gemfile.lock`, and sensitive files
- Docker container runs with non-root user permissions
- No external network access required for local development
- HTTPS not required for localhost (HTTP on port 4000 is acceptable)

**Content Security:**
- Markdown sanitization handled by Jekyll/Kramdown (prevents XSS)
- No user input processed (content from trusted local filesystem only)
- No JavaScript execution in markdown (static HTML output)

**Rationale:** NFR-3 (PRD:435-445) focuses on API key security for multi-platform publishing, but Epic 1 has no secrets. The only security concern is preventing accidental commit of build artifacts or sensitive local configuration.

### Reliability/Availability

**Local Environment Reliability (NFR-2 from PRD):**
- Docker Compose must start successfully on macOS, Linux, and Windows
- Jekyll build must succeed for valid markdown + front matter
- Graceful error reporting for invalid front matter or markdown syntax
- LiveReload should reconnect automatically after container restart
- File watching should handle rapid successive edits without crashing

**Error Handling:**
- Invalid YAML front matter → Clear error message with line number
- Missing required fields (title, date, tags, description, canonical_url) → Build fails with specific field identified
- Markdown syntax errors → Jekyll reports file and error location
- Docker image pull failure → Retry mechanism or clear offline instruction

**Availability:** 100% uptime expected for local development (single-user, no network dependencies)

**Rationale:** NFR-2 (PRD:423-433) emphasizes reliability for production automation. For Epic 1, reliability means consistent local build success and helpful error messages.

### Observability

**Local Development Observability (NFR-4 from PRD):**
- Jekyll build logs visible in terminal (stdout)
- File change detection logged ("Regenerating: 1 file(s) changed...")
- Build errors displayed with file paths and line numbers
- LiveReload connection status visible in browser console
- Docker container logs accessible via `docker-compose logs`

**Debug Information:**
- Jekyll version logged on startup
- Gem installation progress visible
- Build time reported after each regeneration
- Port binding confirmation (4000, 35729)

**No Metrics Required:** Epic 1 is local-only; no telemetry, APM, or monitoring infrastructure needed until production deployment (Epic 2).

**Rationale:** NFR-4 (PRD:447-463) covers maintainability and debugging. For local development, this means clear console output and accessible logs.

## Dependencies and Integrations

### Dependencies

**Ruby Dependencies (Gemfile):**

```ruby
source "https://rubygems.org"

gem "jekyll", "~> 3.9.3"
gem "minima", "~> 2.5"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-sitemap", "~> 1.4"
end

# Windows and JRuby does not include zoneinfo files
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
```

**Version Constraints:**
- **Jekyll 3.9.3**: Required for GitHub Pages compatibility (architecture.md:57)
- **Minima 2.5+**: Default theme bundled with Jekyll (architecture.md:58)
- **jekyll-feed**: RSS feed generation (PRD:325)
- **jekyll-sitemap**: SEO sitemap generation (PRD:326)

**Docker Dependencies:**
- **Base Image**: `jekyll/jekyll:3.9` (official Jekyll Docker image)
- **Docker**: Version 20.10+ recommended
- **Docker Compose**: Version 1.29+ or 2.x

**System Dependencies** (handled by Docker image):
- Ruby 2.7+
- Bundler 2.x
- Node.js (for asset compilation if needed)

### Integration Points

**No External Integrations in Epic 1:**

Epic 1 is purely local development setup. All integrations deferred to later epics:

- **GitHub Pages** → Epic 2 (Deployment Pipeline)
- **Dev.to API** → Epic 3 (Multi-Platform Syndication)
- **Medium API** → Epic 3 (Multi-Platform Syndication)
- **Hashnode GraphQL API** → Epic 3 (Multi-Platform Syndication)
- **GitHub Actions** → Epic 2 (CI/CD Pipeline)

**Internal Integrations:**
- **Docker ↔ Jekyll**: Volume mount (`.:/srv/jekyll`) shares local filesystem with container
- **Jekyll ↔ LiveReload**: WebSocket connection on port 35729 for browser refresh
- **Browser ↔ Jekyll Server**: HTTP on port 4000 for preview

**File System Integration:**
- **Input**: Markdown files in `_posts/` and `_drafts/`
- **Output**: Static HTML/CSS/JS in `_site/`
- **Configuration**: `_config.yml`, `docker-compose.yml`, `Gemfile`

### Dependency Version Pinning Strategy

**Rationale (NFR-4 from PRD:460):**
- Pin major.minor for Jekyll (3.9.x) to maintain GitHub Pages compatibility
- Pin major.minor for plugins to ensure stability
- Lock with `Gemfile.lock` after initial `bundle install`
- Docker image pinned to specific tag (3.9) not `latest`

**Upgrade Path:**
- Test Jekyll upgrades in separate branch before merging
- Verify GitHub Pages compatibility before updating Jekyll version
- Review Jekyll changelogs for breaking changes

## Acceptance Criteria (Authoritative)

**AC-1.1: Project Initialization (Story 1.1)**
- ✅ `docker-compose.yml` file created with jekyll/jekyll:3.9 image
- ✅ `docker-compose up` successfully starts Jekyll server on port 4000
- ✅ LiveReload server accessible on port 35729
- ✅ Project directory structure created (`_posts/`, `_drafts/`, `assets/images/`)
- ✅ `.gitignore` includes `_site/`, `Gemfile.lock`, `.jekyll-cache/`
- ✅ `Gemfile` created with Jekyll 3.9.3 and required plugins
- ✅ `README.md` contains setup instructions for Docker Compose workflow
- ✅ Local environment starts in <30 seconds

**AC-1.2: Jekyll Configuration (Story 1.2)**
- ✅ `_config.yml` created with Minima theme configuration
- ✅ Site builds successfully with default Minima theme
- ✅ Homepage displays "Personal Technical Blog" title
- ✅ jekyll-feed plugin generates RSS feed at `/feed.xml`
- ✅ jekyll-sitemap plugin generates sitemap at `/sitemap.xml`
- ✅ Markdown engine configured as Kramdown
- ✅ Code syntax highlighting works for fenced code blocks
- ✅ Minima theme renders correctly on mobile and desktop

**AC-1.3: Article Structure and Front Matter (Story 1.3)**
- ✅ Front matter template documented with all required fields (title, date, tags, description, canonical_url)
- ✅ Sample article created demonstrating front matter usage
- ✅ Jekyll validates required front matter fields on build
- ✅ Articles with invalid/missing front matter fail build with clear error message
- ✅ Tags are parsed and displayed on article pages
- ✅ Canonical URL appears in HTML `<link rel="canonical">` tag
- ✅ Article description used in meta description tag for SEO

**AC-1.4: Draft Management Workflow (Story 1.4)**
- ✅ `_drafts/` directory created and configured
- ✅ Files in `_drafts/` do not appear in production build (without `--drafts` flag)
- ✅ `docker-compose up` serves drafts when `--drafts` flag is present in command
- ✅ Drafts visible at `/drafts/` URL in local preview
- ✅ Moving file from `_drafts/` to `_posts/` with date prefix publishes article
- ✅ Draft files do not require date prefix in filename
- ✅ Published files in `_posts/` follow naming convention `YYYY-MM-DD-title.md`

**AC-1.5: Local Preview with Live Reload (Story 1.5)**
- ✅ Jekyll server accessible at `http://localhost:4000`
- ✅ LiveReload WebSocket connects on page load
- ✅ File changes trigger automatic rebuild
- ✅ Browser refreshes automatically within 5 seconds of file save
- ✅ Markdown edits reflected immediately in preview
- ✅ YAML front matter changes trigger rebuild and refresh
- ✅ Build errors displayed in terminal with file path and line number
- ✅ Multiple file edits in quick succession handled gracefully (no crash)

## Traceability Mapping

| AC ID | PRD Requirement | Spec Section | Component | Test Strategy |
|-------|----------------|--------------|-----------|---------------|
| **AC-1.1** | FR-1.3 (Local preview via Docker Compose) | Docker Compose Configuration | docker-compose.yml, Gemfile | Manual: Run `docker-compose up`, verify server starts <30s |
| **AC-1.2** | FR-2.1 (Static site build), FR-2.2 (Site structure) | Jekyll Configuration | _config.yml, Minima theme | Manual: Build site, verify RSS/sitemap, check syntax highlighting |
| **AC-1.3** | FR-1.1 (Markdown with YAML front matter) | Article Front Matter Schema | Front matter parser, sample article | Manual: Create article with/without required fields, verify validation |
| **AC-1.4** | FR-1.2 (Draft management) | Draft to Published Transition | _drafts/, _posts/ directories | Manual: Create draft, move to _posts/, verify publishing workflow |
| **AC-1.5** | FR-1.3 (Local preview with live reload), NFR-1 (Performance) | Local Development Startup Sequence, LiveReload Server | Jekyll serve, LiveReload | Manual: Edit file, time reload cycle (<5s), test multiple rapid edits |

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
- ✅ ADR-001 (Jekyll 3.9.3) → AC-1.1, AC-1.2
- ✅ ADR-004 (Docker Compose) → AC-1.1, AC-1.5
- ✅ Project Structure (architecture.md:73-99) → AC-1.1
- ✅ Docker Compose Config (architecture.md:132-147) → AC-1.1

## Risks, Assumptions, Open Questions

**Risks:**

**R1: Docker Installation Complexity (Severity: LOW)**
- **Description**: User may not have Docker/Docker Compose installed, creating setup friction
- **Impact**: Delays initial development environment setup
- **Mitigation**: Provide clear README instructions with Docker installation links for macOS/Linux/Windows
- **Fallback**: Document native Jekyll installation as alternative (though not recommended for consistency)

**R2: Port Conflicts (Severity: LOW)**
- **Description**: Ports 4000 or 35729 may be in use by other services
- **Impact**: docker-compose up fails with port binding error
- **Mitigation**: Document how to change ports in docker-compose.yml
- **Detection**: Clear error message from Docker

**R3: File Permission Issues on Windows (Severity: LOW)**
- **Description**: Docker volume mounts may have permission issues on Windows
- **Impact**: Jekyll may not be able to write to `_site/` or `.jekyll-cache/`
- **Mitigation**: Document Windows-specific Docker Desktop settings (file sharing)
- **Reference**: Known Docker Desktop on Windows issue

**R4: Jekyll Version Drift (Severity: MEDIUM)**
- **Description**: GitHub Pages may update Jekyll version, creating mismatch with local 3.9.3
- **Impact**: Local builds succeed but GitHub Pages deployment fails (in Epic 2)
- **Mitigation**: Pin Jekyll version in Gemfile, monitor GitHub Pages supported versions
- **Prevention**: Regular testing against GitHub Pages compatibility list

**Assumptions:**

**A1: Docker Availability**
- User has Docker and Docker Compose installed (or can install them)
- User has basic familiarity with command-line tools
- Docker Desktop has sufficient resources (minimum 2GB RAM allocated)

**A2: Network Access**
- User can pull Docker images from Docker Hub (`jekyll/jekyll:3.9`)
- User can install Ruby gems from rubygems.org
- No corporate firewall blocks Docker Hub or gem downloads

**A3: Browser Compatibility**
- Modern browser supports LiveReload WebSocket connections
- Browser JavaScript enabled for LiveReload functionality
- Browser can access localhost URLs

**A4: File System**
- Case-sensitive file systems work correctly (primarily impacts macOS case-insensitive default)
- File watching works on user's OS (may require Docker Desktop file sharing on Windows)
- Sufficient disk space for `_site/` build output and Docker images (~500MB)

**A5: Jekyll/Minima Stability**
- Jekyll 3.9.3 is stable and maintained
- Minima theme 2.5+ is compatible with Jekyll 3.9.3
- jekyll-feed and jekyll-sitemap plugins are stable

**Open Questions:**

**Q1: Sample Article Content**
- Should we include a sample "Hello World" article in `_posts/` after initialization?
- **Decision**: Yes, include minimal sample to demonstrate front matter and markdown rendering

**Q2: Git Repository Initialization**
- Should Story 1.1 initialize a Git repository (`git init`)?
- **Decision**: Yes, include `git init` and initial `.gitignore` as part of project setup

**Q3: Author Email Configuration**
- How should we handle `email` field in `_config.yml`? Placeholder or ask user?
- **Decision**: Use placeholder `[author email]` in template, document in README to update

**Q4: LiveReload Port Configuration**
- Should we make LiveReload port (35729) configurable in docker-compose.yml?
- **Decision**: Not for MVP - default port is standard, changing adds complexity

## Test Strategy Summary

**Test Approach:**

Epic 1 is foundational infrastructure with **manual validation** for all acceptance criteria. No automated testing for local development setup.

**Test Levels:**

1. **Environment Setup Testing**
   - **Scope**: AC-1.1 (Project initialization)
   - **Method**: Manual execution of `docker-compose up`, verify server starts
   - **Success Criteria**: Server running on port 4000 within 30 seconds
   - **Platforms**: Test on macOS, Linux, Windows (if available)

2. **Configuration Testing**
   - **Scope**: AC-1.2 (Jekyll configuration)
   - **Method**: Build site, inspect generated files (`_site/`, `/feed.xml`, `/sitemap.xml`)
   - **Success Criteria**: All plugins active, theme renders correctly
   - **Validation**: Visual inspection in browser, check HTML source for canonical tags

3. **Content Authoring Testing**
   - **Scope**: AC-1.3 (Article structure and front matter)
   - **Method**: Create test articles with valid/invalid front matter
   - **Success Criteria**: Valid articles build successfully, invalid articles fail with clear errors
   - **Edge Cases**: Missing required fields, malformed YAML, invalid date formats

4. **Workflow Testing**
   - **Scope**: AC-1.4 (Draft management)
   - **Method**: Create draft, verify not in production build, move to `_posts/`, verify published
   - **Success Criteria**: Drafts only visible with `--drafts` flag, published articles always visible

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
