# Architecture

## Executive Summary

Git-native automated publishing platform using Docusaurus static site generation with multi-platform API syndication. Architecture optimizes for modern developer experience and maintainability - React-based static generation with GitHub Pages deployment, Node.js ecosystem for consistency, and modular platform adapters enable graceful degradation.

**Key Architectural Principles:**
1. **Modern technology for maintainability** - Docusaurus 3.x (React/Node.js), active development, excellent DX
2. **Git as single source of truth** - No databases, no state outside Git
3. **Fail gracefully** - Platform API failures don't block other platforms
4. **Local = Production** - Docker Compose with Node.js mirrors deployment environment

## Project Initialization

**Docusaurus starter template:**

```bash
# Local development setup
npx create-docusaurus@latest personal-blog classic --typescript
cd personal-blog
```

**package.json dependencies:**
```json
{
  "dependencies": {
    "@docusaurus/core": "^3.6.0",
    "@docusaurus/preset-classic": "^3.6.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

**Docker Compose for local development:**
```yaml
# docker-compose.yml
services:
  docusaurus:
    image: node:20-alpine
    working_dir: /app
    command: npm start -- --host 0.0.0.0 --port 3000
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

This establishes the foundation with these decisions already made:
- Docusaurus 3.x (latest stable version)
- Classic preset with blog support
- TypeScript for type safety
- Docker-based local development with Node.js
- Hot reload for instant feedback

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |
| Static Site Generator | Docusaurus | 3.6+ | All content epics | Modern React-based platform, excellent DX, active development, MDX support |
| Theme | Classic Preset | Bundled with Docusaurus | Content authoring | Modern responsive design, blog-ready, customizable with React |
| Local Development | Docker Compose | node:20-alpine | Development workflow | Environment consistency, cross-platform support, Node.js ecosystem |
| Deployment | GitHub Pages | N/A | Publishing pipeline | Free hosting, automatic deployment via GitHub Actions |
| CI/CD | GitHub Actions | N/A | Publishing pipeline | Native GitHub integration, free for public repos, build and deploy Docusaurus |
| Dev.to Integration | REST API | Current | Syndication | Well-documented API, POST /api/articles endpoint, API key auth |
| Medium Integration | REST API (deprecated) | Current | Syndication | **RISK**: Deprecated API, publish-once only, graceful degradation if breaks |
| Hashnode Integration | GraphQL API | Current | Syndication | Modern GraphQL API, publishPost mutation, active maintenance |
| Markdown Processing | Node.js/TypeScript | Node 20+ | Platform adapters | Platform-specific markdown conversion, unified ecosystem with Docusaurus |
| Secret Management | GitHub Secrets | N/A | All platform APIs | API keys stored as secrets, never in code |
| Scripting Language | Node.js/TypeScript | Node 20+ | Automation scripts | HTTP/GraphQL calls, unified tooling with Docusaurus, type safety |
| Article Detection | Git diff | N/A | Change detection | Detect modified files in blog directory, incremental publishing |
| Error Handling | Continue on failure | N/A | All platform publishing | If one platform fails, others continue (graceful degradation) |

## Project Structure

```
personal-blog/
├── .github/
│   └── workflows/
│       └── publish.yml                  # GitHub Actions: build + deploy + syndicate
├── blog/                                # Published articles (trigger syndication)
│   └── 2025-01-15-example-article.md
├── docs/                                # Documentation pages (optional)
├── src/
│   ├── components/                      # React components
│   ├── css/                             # Custom styles
│   └── pages/                           # Custom pages
├── static/
│   └── img/                             # Static assets and images
├── build/                               # Docusaurus build output (gitignored)
├── node_modules/                        # Node dependencies (gitignored)
├── scripts/
│   ├── publish-devto.ts                 # Dev.to API adapter
│   ├── publish-medium.ts                # Medium API adapter
│   ├── publish-hashnode.ts              # Hashnode API adapter
│   ├── detect-changes.ts                # Git diff analyzer
│   └── markdown-converter.ts            # Platform-specific markdown conversion
├── .gitignore
├── docusaurus.config.ts                 # Docusaurus configuration
├── docker-compose.yml                   # Local development environment
├── package.json                         # Node dependencies
├── tsconfig.json                        # TypeScript configuration
└── README.md
```

## Epic to Architecture Mapping

*Will be populated after epics are defined*

**Anticipated Epic Structure:**
- **Epic 1: Docusaurus Setup & Local Dev** → Docker Compose, Docusaurus config, Classic theme, TypeScript
- **Epic 2: GitHub Pages Deployment** → GitHub Actions, static site build with Docusaurus
- **Epic 3: Multi-Platform Syndication** → Node.js/TypeScript scripts, Dev.to/Medium/Hashnode APIs, change detection
- **Epic 4: Content Creation** → Write 10 technical articles with working code examples

## Technology Stack Details

### Core Technologies

**Static Site Generation:**
- **Docusaurus 3.6+** - Modern React-based static site generator
- **Classic Preset** - Blog-ready theme with responsive design
- **MDX Support** - Write JSX in markdown, embed React components
- **TypeScript** - Type safety for configuration and customization

**Local Development:**
- **Docker** - node:20-alpine image
- **Docker Compose** - Development environment orchestration
- **Hot Reload** - Instant feedback on file changes via Webpack

**Deployment:**
- **GitHub Pages** - Free static hosting
- **GitHub Actions** - Build Docusaurus, deploy to gh-pages branch

**Scripting & Automation:**
- **Node.js 20+** - Platform adapter scripts
- **TypeScript** - Type-safe automation scripts
- **axios** library - HTTP API calls (Dev.to, Medium)
- **graphql-request** library - GraphQL API calls (Hashnode)
- **gray-matter** library - Front matter parsing
- **remark** libraries - Markdown processing/conversion

### Integration Points

**1. GitHub Actions → Docusaurus Build**
- Trigger: Push/merge to `main` branch
- Action: `npm run build` - Build Docusaurus static site
- Output: Deploy to GitHub Pages from `/build` directory

**2. GitHub Actions → Change Detection**
- Script: `scripts/detect-changes.ts`
- Input: Git diff between HEAD and HEAD~1
- Output: List of changed/new files in `blog/` directory

**3. GitHub Actions → Platform Adapters**
- **Dev.to**: `scripts/publish-devto.ts` → POST https://dev.to/api/articles
- **Medium**: `scripts/publish-medium.ts` → POST https://api.medium.com/v1/users/{userId}/posts
- **Hashnode**: `scripts/publish-hashnode.ts` → POST https://gql.hashnode.com (GraphQL)

**4. Article Front Matter → Platform APIs**
```yaml
---
title: "Article Title"
date: 2025-01-15
tags: [python, jekyll, automation]
description: "Short description"
canonical_url: "https://username.github.io/personal-blog/article-title"
---
```

Maps to:
- Dev.to: `{ article: { title, body_markdown, tags, canonical_url } }`
- Medium: `{ title, contentFormat: "markdown", content, tags, canonicalUrl }`
- Hashnode: `publishPost(input: { title, contentMarkdown, tags, canonicalUrl })`

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

### File Naming Patterns

**Article Files:**
- Format: `YYYY-MM-DD-title-slug.md`
- Example: `2025-01-15-fastapi-oauth2-integration.md`
- Location: `_posts/` (published) or `_drafts/` (unpublished)

**Python Scripts:**
- Format: `snake_case.py`
- Example: `publish_devto.py`, `detect_changes.py`

**Configuration Files:**
- Jekyll: `_config.yml`
- Docker: `docker-compose.yml`
- Git: `.gitignore`

### API Integration Pattern

**All platform adapters follow this structure:**
```python
def publish_article(article_path, api_key):
    """
    Publish article to platform.

    Args:
        article_path: Path to markdown file
        api_key: Platform API key from GitHub Secrets

    Returns:
        dict: {'success': bool, 'url': str, 'error': str}
    """
    try:
        # 1. Parse front matter and content
        metadata, content = parse_article(article_path)

        # 2. Convert markdown (platform-specific)
        converted = convert_markdown(content, platform='devto')

        # 3. Call platform API
        response = requests.post(API_URL,
                                json=build_payload(metadata, converted),
                                headers={'api-key': api_key})

        # 4. Return result
        if response.status_code == 201:
            return {'success': True, 'url': response.json()['url'], 'error': None}
        else:
            return {'success': False, 'url': None, 'error': response.text}

    except Exception as e:
        return {'success': False, 'url': None, 'error': str(e)}
```

**Key principles:**
- Always return `{'success', 'url', 'error'}` dictionary
- Never raise exceptions (catch and return error in dict)
- Log all API responses for debugging
- Graceful degradation: failure in one platform doesn't block others

### GitHub Actions Workflow Pattern

**Workflow structure:**
```yaml
name: Publish Articles

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
      - name: Build Jekyll site (GitHub Pages deployment)
      - name: Detect changed articles
      - name: Publish to Dev.to (continue-on-error: true)
      - name: Publish to Medium (continue-on-error: true)
      - name: Publish to Hashnode (continue-on-error: true)
      - name: Report results
```

**Critical patterns:**
- `continue-on-error: true` on all platform publish steps
- Separate step for each platform (parallel execution possible)
- Final reporting step aggregates results
- Secrets: `DEV_TO_API_KEY`, `MEDIUM_API_KEY`, `HASHNODE_API_KEY`

## Consistency Rules

### Naming Conventions

**Variables:**
- Python: `snake_case` (e.g., `api_key`, `article_path`)
- YAML: `kebab-case` (e.g., `canonical-url`)
- Environment variables: `SCREAMING_SNAKE_CASE` (e.g., `DEV_TO_API_KEY`)

**Functions:**
- Python: `snake_case_verbs` (e.g., `publish_article`, `detect_changes`)
- Prefix platform-specific: `publish_devto`, `publish_medium`, `publish_hashnode`

**Files & Directories:**
- Directories: `lowercase` or `_underscore` (Jekyll convention)
- Scripts: `snake_case.py`
- Articles: `YYYY-MM-DD-slug.md`

### Code Organization

**Python Script Structure:**
```python
# 1. Imports (stdlib, then third-party, then local)
import os
import sys
from datetime import datetime

import requests
import frontmatter

# 2. Constants
API_URL = "https://dev.to/api/articles"
TIMEOUT = 30

# 3. Helper functions
def parse_article(path):
    ...

def convert_markdown(content, platform):
    ...

# 4. Main function
def publish_article(article_path, api_key):
    ...

# 5. CLI entry point
if __name__ == "__main__":
    ...
```

**File Location Rules:**
- All Python scripts: `scripts/`
- All articles: `_posts/` (published) or `_drafts/` (work in progress)
- Images: `assets/images/`
- Configuration: project root

### Error Handling

**Standard Error Handling Pattern:**
```python
try:
    result = risky_operation()
    return {'success': True, 'data': result, 'error': None}
except SpecificException as e:
    logger.error(f"Specific error: {e}")
    return {'success': False, 'data': None, 'error': str(e)}
except Exception as e:
    logger.error(f"Unexpected error: {e}")
    return {'success': False, 'data': None, 'error': str(e)}
```

**Never:**
- Let exceptions propagate to GitHub Actions (catch everything)
- Fail entire workflow if one platform fails
- Hide errors (always log and return error details)

**Always:**
- Return structured result dictionaries
- Log both successes and failures
- Include enough error detail for debugging

### Logging Strategy

**Log Levels:**
- `INFO`: Workflow milestones (e.g., "Publishing to Dev.to...")
- `WARNING`: Platform degradation (e.g., "Medium API deprecated, may fail")
- `ERROR`: Platform failures (e.g., "Dev.to publish failed: 401 Unauthorized")

**Log Format:**
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)
```

**What to Log:**
- Start/end of each platform publish attempt
- API response status codes
- Error messages with context
- Final summary (X/4 platforms successful)

## Data Architecture

**No database - Git is the single source of truth.**

**Article Data Model (Front Matter):**
```yaml
---
title: string (required)
date: YYYY-MM-DD (required)
tags: array of strings (required, max 4 for platforms)
description: string (required, <160 chars for SEO)
canonical_url: string (required, GitHub Pages URL)
published: boolean (optional, default true)
---
```

**Platform State Tracking:**
No persistent state. Each workflow run is stateless:
- Change detection via `git diff`
- No tracking of "already published" articles
- Idempotent: Re-running publish on same article updates it (if platform supports)

**Rationale:** Simplicity over features. No database means no sync issues, no state corruption, pure Git-based workflow.

## API Contracts

### Dev.to REST API

**Endpoint:** `POST https://dev.to/api/articles`

**Request:**
```json
{
  "article": {
    "title": "Article Title",
    "published": false,
    "body_markdown": "# Content\n\n...",
    "tags": ["python", "automation"],
    "canonical_url": "https://username.github.io/blog/article-title"
  }
}
```

**Response (201 Created):**
```json
{
  "id": 123456,
  "url": "https://dev.to/username/article-title-abc123",
  "...": "..."
}
```

**Authentication:** Header: `api-key: YOUR_API_KEY`

### Medium REST API (Deprecated)

**Endpoint:** `POST https://api.medium.com/v1/users/{userId}/posts`

**Request:**
```json
{
  "title": "Article Title",
  "contentFormat": "markdown",
  "content": "# Content\n\n...",
  "tags": ["python", "automation"],
  "canonicalUrl": "https://username.github.io/blog/article-title",
  "publishStatus": "draft"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": "abc123",
    "url": "https://medium.com/@username/article-title-abc123",
    "...": "..."
  }
}
```

**Authentication:** Header: `Authorization: Bearer YOUR_ACCESS_TOKEN`

**Limitations:**
- Cannot update posts after publish (publish once only)
- API deprecated, may break anytime
- Implement graceful degradation

### Hashnode GraphQL API

**Endpoint:** `POST https://gql.hashnode.com`

**Request:**
```graphql
mutation PublishPost($input: PublishPostInput!) {
  publishPost(input: $input) {
    post {
      id
      url
      title
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "title": "Article Title",
    "contentMarkdown": "# Content\n\n...",
    "tags": [{"slug": "python"}, {"slug": "automation"}],
    "publicationId": "YOUR_PUBLICATION_ID",
    "canonicalUrl": "https://username.github.io/blog/article-title"
  }
}
```

**Authentication:** Header: `Authorization: YOUR_API_KEY`

## Security Architecture

**API Key Management:**
- All API keys stored as GitHub Secrets
- Never committed to Git
- Accessed in GitHub Actions via `${{ secrets.DEV_TO_API_KEY }}`
- Minimum required permissions (write to blog only)

**Secret Names:**
```
DEV_TO_API_KEY
MEDIUM_API_KEY
HASHNODE_API_KEY
HASHNODE_PUBLICATION_ID (if needed)
MEDIUM_USER_ID (if needed)
```

**Content Security:**
- Markdown sanitization handled by Jekyll (XSS prevention)
- No user input processed (content comes from trusted Git repo)
- HTTPS for all API calls
- HTTPS for GitHub Pages (automatic)

**Audit Trail:**
- All API calls logged in GitHub Actions workflow runs
- Git history provides complete content audit trail
- Failed API calls visible in workflow logs

## Performance Considerations

**Build Performance:**
- Docker Compose local preview: <30 seconds startup
- LiveReload: <5 seconds file change → browser refresh
- Jekyll build (50 articles): <2 minutes

**Publish Performance:**
- Total workflow time: <5 minutes (GitHub Pages + 3 platforms)
- GitHub Pages deployment: <2 minutes
- Each platform API call: <30 seconds
- Platforms called in parallel (separate GitHub Actions steps)

**Scalability:**
- Support 100+ articles without performance degradation
- Incremental publishing (only changed articles)
- No database means no query performance issues
- Static site = instant page loads (<3 seconds)

**Optimization Strategies:**
- Jekyll incremental builds (only rebuild changed files)
- Image optimization (compress before commit)
- Minimal JavaScript (default Minima theme)
- CDN via GitHub Pages (free, fast)

## Deployment Architecture

**Production Environment: GitHub Pages**
- Hosting: GitHub Pages (free, HTTPS, CDN)
- URL: `https://username.github.io/personal-blog/`
- Deployment trigger: Push to `main` branch
- Build: GitHub Actions builds Jekyll, deploys to `gh-pages` branch

**CI/CD Pipeline:**
```
Developer → Write article in _posts/
         → Commit + push to main
         → GitHub Actions triggered
         → Jekyll build + deploy to GitHub Pages
         → Detect changed articles (git diff)
         → Publish to Dev.to (parallel)
         → Publish to Medium (parallel)
         → Publish to Hashnode (parallel)
         → Report results
```

**Deployment Requirements:**
- Public GitHub repository (for free GitHub Pages)
- GitHub Actions enabled
- Secrets configured (API keys)
- `gh-pages` branch created (automatic)

**Rollback Strategy:**
- `git revert` commit → Re-run workflow
- Previous article versions restored
- Platform updates follow Git state

## Development Environment

### Prerequisites

**Required:**
- Docker & Docker Compose
- Git
- Text editor (VS Code, Vim, etc.)

**Optional:**
- Ruby + Jekyll (for native local dev without Docker)
- Python 3.11+ (for testing scripts locally)

### Setup Commands

**Initial Setup:**
```bash
# Clone repository
git clone https://github.com/username/personal-blog.git
cd personal-blog

# Start local preview (Docker Compose)
docker-compose up

# Site available at http://localhost:4000
# LiveReload at http://localhost:35729
```

**Create New Article:**
```bash
# Create in _drafts/ first (not published)
touch _drafts/my-new-article.md

# Edit with front matter
cat > _drafts/my-new-article.md << 'EOF'
---
title: "My New Article"
date: 2025-01-15
tags: [python, automation]
description: "Short description"
canonical_url: "https://username.github.io/personal-blog/my-new-article"
---

# Article content here...
EOF

# Preview locally (drafts visible with --drafts flag)
# Already running in docker-compose.yml

# When ready to publish, move to _posts/
mv _drafts/my-new-article.md _posts/2025-01-15-my-new-article.md

# Commit and push
git add _posts/2025-01-15-my-new-article.md
git commit -m "Add article: My New Article"
git push origin main

# GitHub Actions automatically publishes to all platforms
```

**Testing Platform Scripts Locally:**
```bash
# Install Python dependencies
pip install requests gql frontmatter python-frontmatter

# Test Dev.to publish (dry run)
export DEV_TO_API_KEY="your-key"
python scripts/publish_devto.py _posts/2025-01-15-my-new-article.md

# Check output for success/failure
```

## Architecture Decision Records (ADRs)

### ADR-001: Use Docusaurus 3.x (Modern React-based SSG)

**Status:** Accepted (Revised 2025-11-09)

**Context:** Need static site generator with modern developer experience, excellent documentation support, and reliable deployment.

**Decision:** Use Docusaurus 3.x with GitHub Actions deployment instead of Jekyll 3.9.3 native GitHub Pages.

**Rationale:**
- **Modern DX** - React/Node.js ecosystem, active development, excellent community
- **MDX Support** - Embed React components in markdown for interactive examples
- **TypeScript** - Type safety for configuration and customization
- **Better for technical content** - Built for documentation, code examples, versioning
- **Unified tooling** - Node.js for both site generation and syndication scripts
- **Future-proof** - Active Meta project with regular updates

**Trade-offs:**
- Requires GitHub Actions build step (not native GitHub Pages like Jekyll)
- Slightly more complex than Jekyll (React/Node.js vs Ruby)
- Larger build artifacts (~2-3MB vs ~500KB)

**Consequences:**
- Modern, maintainable codebase with excellent developer experience
- Can use React components for interactive demos and examples
- TypeScript provides safety for config and scripts
- GitHub Actions required for deployment (1-2 minute build time)
- Better long-term maintainability and community support

---

### ADR-002: Include Medium Despite Deprecated API

**Status:** Accepted with Risk

**Context:** Medium's official API is deprecated and unsupported as of 2024.

**Decision:** Include Medium syndication in MVP with graceful degradation.

**Rationale:**
- API still functional (as of 2025-01)
- Reach a broad technical audience
- Graceful degradation architecture handles failure
- Easy to remove if/when API breaks

**Consequences:**
- **Risk:** API may break without warning
- **Mitigation:** `continue-on-error: true` in workflow
- **Mitigation:** Dev.to + Hashnode + GitHub Pages still work if Medium fails
- Cannot update articles on Medium (publish-once limitation)

---

### ADR-003: Node.js/TypeScript for Platform Adapters

**Status:** Accepted (Revised 2025-11-09)

**Context:** Need scripting language for API integration and markdown processing.

**Decision:** Use Node.js/TypeScript for all platform adapter scripts (unified with Docusaurus).

**Rationale:**
- **Unified ecosystem** - Same runtime as Docusaurus (Node.js 20+)
- **Type safety** - TypeScript prevents runtime errors in automation
- **Excellent libraries** - `axios` for HTTP, `graphql-request` for GraphQL
- **Markdown processing** - `gray-matter`, `remark` ecosystem
- **Single toolchain** - npm scripts for everything

**Consequences:**
- Node.js runtime already required for Docusaurus (no additional dependency)
- TypeScript compilation adds build step but provides safety
- Consistent tooling and dependencies across entire project
- Better integration with Docusaurus plugin ecosystem

---

### ADR-004: Stateless Architecture (No Database)

**Status:** Accepted

**Context:** Need to track published articles and platform state.

**Decision:** No database. Git is single source of truth. Stateless workflow.

**Rationale:**
- Simplicity > features for MVP
- No sync issues between database and Git
- No state corruption
- Idempotent operations

**Consequences:**
- Cannot track "already published to platform X" state
- Re-running workflow on same article attempts re-publish (platform handles duplicates)
- Change detection via `git diff` only (no persistent state)
- Simpler architecture, easier to reason about

---

_Generated by BMAD Decision Architecture Workflow v1.3.2_
_Date: 2025-01-08_
_For: James Crowley_
