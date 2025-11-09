# Architecture

## Executive Summary

Git-native automated publishing platform using Jekyll static site generation with multi-platform API syndication. Architecture optimizes for reliability over features - native GitHub Pages deployment minimizes complexity, Docker Compose ensures local/production consistency, and modular platform adapters enable graceful degradation.

**Key Architectural Principles:**
1. **Boring technology for stability** - Jekyll 3.9.3 (GitHub Pages native), proven static generation
2. **Git as single source of truth** - No databases, no state outside Git
3. **Fail gracefully** - Platform API failures don't block other platforms
4. **Local = Production** - Docker Compose mirrors GitHub Pages environment

## Project Initialization

**No starter template** - Simple Jekyll project structure:

```bash
# Local development setup
gem install bundler jekyll
jekyll new personal-blog --skip-bundle
cd personal-blog
```

**Gemfile for GitHub Pages compatibility:**
```ruby
source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins
gem "jekyll-feed"
gem "jekyll-seo-tag"
```

**Docker Compose for local development:**
```yaml
# docker-compose.yml
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

This establishes the foundation with these decisions already made:
- Jekyll 3.9.3 (GitHub Pages compatible version)
- Minima default theme (included with Jekyll)
- Docker-based local development
- LiveReload for instant feedback

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |
| Static Site Generator | Jekyll (GitHub Pages native) | 3.9.3 | All content epics | Native GitHub Pages support, zero-config deployment, proven stability |
| Theme | Minima (default) | Bundled with Jekyll | Content authoring | Default theme for MVP, defer customization until automation proven |
| Local Development | Docker Compose | jekyll/jekyll:3.9 | Development workflow | Environment consistency, cross-platform support |
| Deployment | GitHub Pages (native) | N/A | Publishing pipeline | Simplest deployment, automatic from gh-pages branch |
| CI/CD | GitHub Actions | N/A | Publishing pipeline | Native GitHub integration, free for public repos |
| Dev.to Integration | REST API | Current | Syndication | Well-documented API, POST /api/articles endpoint, API key auth |
| Medium Integration | REST API (deprecated) | Current | Syndication | **RISK**: Deprecated API, publish-once only, graceful degradation if breaks |
| Hashnode Integration | GraphQL API | Current | Syndication | Modern GraphQL API, publishPost mutation, active maintenance |
| Markdown Processing | Python script | Python 3.11+ | Platform adapters | Platform-specific markdown conversion, handle quirks per platform |
| Secret Management | GitHub Secrets | N/A | All platform APIs | API keys stored as secrets, never in code |
| Scripting Language | Python | 3.11+ | Automation scripts | Simple HTTP/GraphQL calls, markdown processing libraries |
| Article Detection | Git diff | N/A | Change detection | Detect modified files in /posts directory, incremental publishing |
| Error Handling | Continue on failure | N/A | All platform publishing | If one platform fails, others continue (graceful degradation) |

## Project Structure

```
personal-blog/
├── .github/
│   └── workflows/
│       └── publish.yml                 # GitHub Actions publishing workflow
├── _posts/                              # Published articles (trigger syndication)
│   └── 2025-01-15-example-article.md
├── _drafts/                             # Unpublished drafts (no syndication)
│   └── work-in-progress.md
├── _site/                               # Jekyll build output (gitignored)
├── assets/
│   └── images/                          # Article images
├── scripts/
│   ├── publish_devto.py                # Dev.to API adapter
│   ├── publish_medium.py               # Medium API adapter
│   ├── publish_hashnode.py             # Hashnode API adapter
│   ├── detect_changes.py               # Git diff analyzer
│   └── markdown_converter.py           # Platform-specific markdown conversion
├── .gitignore
├── _config.yml                          # Jekyll configuration
├── docker-compose.yml                   # Local development environment
├── Gemfile                              # Ruby dependencies
├── Gemfile.lock
└── README.md
```

## Epic to Architecture Mapping

*Will be populated after epics are defined*

**Anticipated Epic Structure:**
- **Epic 1: Jekyll Setup & Local Dev** → Docker Compose, Jekyll config, Minima theme
- **Epic 2: GitHub Pages Deployment** → GitHub Actions, static site build
- **Epic 3: Dev.to Integration** → Python script, REST API, change detection
- **Epic 4: Medium Integration** → Python script, REST API (deprecated), graceful degradation
- **Epic 5: Hashnode Integration** → Python script, GraphQL API
- **Epic 6: End-to-End Testing** → 10-article validation, reliability testing

## Technology Stack Details

### Core Technologies

**Static Site Generation:**
- **Jekyll 3.9.3** - GitHub Pages compatible version
- **Minima theme** - Default Jekyll theme, no customization for MVP
- **Plugins**: jekyll-feed (RSS), jekyll-seo-tag (SEO metadata)

**Local Development:**
- **Docker** - jekyll/jekyll:3.9 image
- **Docker Compose** - Development environment orchestration
- **LiveReload** - Instant feedback on file changes

**Deployment:**
- **GitHub Pages** - Native Jekyll deployment from gh-pages branch
- **GitHub Actions** - CI/CD automation, secret management

**Scripting & Automation:**
- **Python 3.11+** - Platform adapter scripts
- **requests** library - HTTP API calls (Dev.to, Medium)
- **gql** library - GraphQL API calls (Hashnode)
- **frontmatter** library - YAML front matter parsing
- **markdown** library - Markdown processing/conversion

### Integration Points

**1. GitHub Actions → Jekyll Build**
- Trigger: Push/merge to `main` branch
- Action: Build Jekyll static site
- Output: Deploy to GitHub Pages

**2. GitHub Actions → Change Detection**
- Script: `scripts/detect_changes.py`
- Input: Git diff between HEAD and HEAD~1
- Output: List of changed/new files in `_posts/`

**3. GitHub Actions → Platform Adapters**
- **Dev.to**: `scripts/publish_devto.py` → POST https://dev.to/api/articles
- **Medium**: `scripts/publish_medium.py` → POST https://api.medium.com/v1/users/{userId}/posts
- **Hashnode**: `scripts/publish_hashnode.py` → POST https://gql.hashnode.com (GraphQL)

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

### ADR-001: Use Jekyll 3.9.3 (GitHub Pages Native)

**Status:** Accepted

**Context:** Need static site generator with minimal configuration and reliable deployment.

**Decision:** Use Jekyll 3.9.3 via native GitHub Pages deployment instead of Jekyll 4.x with custom GitHub Actions.

**Rationale:**
- Zero-config deployment (just push to main)
- Proven stability (GitHub Pages standard)
- Fewer moving parts = less to break
- Can upgrade to Jekyll 4.x + custom Actions later if needed

**Consequences:**
- Limited to Jekyll 3.9.x features
- Limited to GitHub-approved plugins
- Simpler architecture
- Faster to "automation proven" milestone

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

### ADR-003: Python for Platform Adapters

**Status:** Accepted

**Context:** Need scripting language for API integration and markdown processing.

**Decision:** Use Python 3.11+ for all platform adapter scripts.

**Rationale:**
- Simple HTTP/GraphQL libraries (`requests`, `gql`)
- Excellent markdown processing (`frontmatter`, `markdown`)
- Easy to run in GitHub Actions
- Widely known language (maintainability)

**Consequences:**
- Python runtime required in GitHub Actions (minimal overhead)
- Consistent scripting across all platforms
- Easy to test locally

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
