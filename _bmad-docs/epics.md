# personal-blog - Epic Breakdown

**Author:** James Crowley
**Date:** 2025-01-08
**Project Level:** Enterprise (Greenfield)
**Target Scale:** Personal/Professional Portfolio

---

## Overview

This document provides the complete epic and story breakdown for personal-blog, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

### Epic Summary

**Epic 1: Docusaurus Foundation & Local Development**
Establish the core Docusaurus site with Docker Compose for local development, enabling immediate article preview and iteration.

**Value:** Developer can write articles locally with live preview before any deployment complexity.

**Epic 2: GitHub Pages Deployment Pipeline**
Automate Docusaurus build and deployment to GitHub Pages, establishing the canonical publishing destination.

**Value:** Articles automatically published to primary platform (GitHub Pages) on merge to main.

**Epic 3: Multi-Platform Syndication**
Implement automated syndication to Dev.to, Medium, and Hashnode with graceful degradation.

**Value:** Zero manual cross-posting - articles appear on all platforms automatically with proper canonical URLs.

**Epic 4: Production Validation & Sustainability**
Publish 10 real articles to validate automation reliability and sustainable weekly cadence.

**Value:** Proof that system works in production, handles real content, and supports sustainable publishing pace.

**Sequencing Rationale:**
- Epic 1 enables local content creation immediately
- Epic 2 establishes primary publishing destination
- Epic 3 adds multi-platform reach
- Epic 4 validates the entire system with real usage

---

## Epic 1: Docusaurus Foundation & Local Development

**Goal:** Establish core Docusaurus site with Docker Compose, enabling local article writing with live preview and draft workflow support.

**Value:** Developer can write and preview articles locally before any deployment complexity. Validates Docusaurus + Docker setup works correctly.

**Success Metrics:**
- Docker Compose starts Docusaurus in <30 seconds
- Live reload works (<5 second file change to browser refresh)
- Can preview drafts and published articles locally
- Default classic theme renders correctly

---

### Story 1.1: Initialize Docusaurus Project Structure

As a developer,
I want to create the basic Docusaurus project structure with GitHub Pages compatibility,
So that I have a foundation for the blog with proper configuration.

**Acceptance Criteria:**

**Given** I have Node.js 20+ and npm installed
**When** I initialize a new Docusaurus project
**Then** The project structure is created with:
- `docusaurus.config.ts` and `sidebars.ts` configured for GitHub Pages
- `package.json` with Docusaurus dependencies
- `blog/` directory for published articles
- `draft: true` front matter for unpublished articles (no separate directory)
- `.gitignore` excluding `build/`, `node_modules/`, and Docusaurus cache files

**And** The `docusaurus.config.ts` includes:
- Site title, description, and author information
- `@docusaurus/preset-classic` with built-in RSS/Atom feed and SEO metadata
- Permalink structure for clean URLs
- Classic theme configuration (`src/css/custom.css`)

**Prerequisites:** None (first story)

**Technical Notes:**
- Follow architecture.md initialization commands
- Use Docusaurus 3.9 configuration
- Configure for `username.github.io/personal-blog` URL structure

---

### Story 1.2: Configure Docker Compose for Local Development

As a developer,
I want Docker Compose to run Docusaurus locally with live reload,
So that I can preview articles without installing Node.js/Docusaurus natively.

**Acceptance Criteria:**

**Given** The Docusaurus project structure exists
**When** I run `docker-compose up`
**Then** The Docusaurus dev server starts successfully
- Binds to `localhost:3000`
- Hot module reload enabled (no separate LiveReload port needed)
- Mounts current directory as `/app`
- Uses `node:20-alpine` image (container port 3000 mapped to host 3001)

**And** Live reload works correctly
- File changes in `blog/` (draft or published) trigger rebuild
- Browser auto-refreshes within 5 seconds
- No manual restart required

**And** Draft preview is enabled
- Articles with `draft: true` visible when browsing locally
- Drafts not included in production builds

**Prerequisites:** Story 1.1 (project structure must exist)

**Technical Notes:**
- Use docker-compose.yml from architecture.md
- Command: `npm start -- --host 0.0.0.0`
- Environment: `NODE_ENV=development`

---

### Story 1.3: Create Sample Article with Front Matter Template

As a developer,
I want a sample article demonstrating proper front matter format,
So that I have a template for future articles and can validate the setup works.

**Acceptance Criteria:**

**Given** Docusaurus is running via Docker Compose
**When** I create a sample article `blog/2025-01-08-sample-article.mdx`
**Then** The article includes required front matter:
```yaml
---
title: "Sample Technical Article"
date: 2025-01-08
tags: [docusaurus, automation, blogging]
description: "A sample article demonstrating the blog setup"
canonical_url: "https://username.github.io/personal-blog/sample-article"
---
```

**And** The article renders correctly at `localhost:3000`
- Title displays properly
- Date formats correctly
- Tags are visible
- Syntax highlighting works for code blocks
- Images (if included) load correctly

**And** The article includes example content:
- Multiple markdown sections (headers, lists, code blocks)
- Demonstrates syntax highlighting with Python/Bash examples
- Tests image embedding from `static/img/`

**Prerequisites:** Story 1.2 (Docker Compose must be working)

**Technical Notes:**
- Use filename format: `YYYY-MM-DD-title-slug.mdx`
- Test with realistic technical content (code examples, diagrams)
- Validate canonical_url format matches architecture

---

### Story 1.4: Implement Draft Workflow

As a developer,
I want to write articles marked `draft: true` that don't trigger publishing,
So that I can work on content privately before making it live.

**Acceptance Criteria:**

**Given** Docusaurus is running locally
**When** I create an article in `blog/` with `draft: true` in its front matter
**Then** The draft is visible at `localhost:3000` in development mode

**And** Removing `draft: true` (or setting it to `false`) makes it publishable:
- The post is included in production builds
- Article now considered "published" for build purposes

**And** Draft front matter uses the `draft` flag:
```yaml
---
title: "Work in Progress"
tags: [draft, wip]
description: "Article being developed"
draft: true
---
```

**And** Documentation exists for the workflow:
- README.md explains draft → publish process
- Commands for creating drafts
- When/how to remove `draft: true`

**Prerequisites:** Story 1.3 (sample article template exists)

**Technical Notes:**
- Docusaurus renders `draft: true` posts in development mode; production builds exclude them
- Focus on documenting the workflow clearly
- Draft posts live in `blog/` and are tracked by Git like any other post

---

### Story 1.5: Validate Local Environment End-to-End

As a developer,
I want to verify the complete local workflow functions correctly,
So that I'm confident the foundation is solid before adding deployment.

**Acceptance Criteria:**

**Given** All previous stories are complete
**When** I perform end-to-end local validation
**Then** The following workflow succeeds:

1. **Start environment:** `docker-compose up` completes in <30 seconds
2. **Create draft:** Article with `draft: true` visible locally
3. **Live reload:** Editing draft triggers browser refresh <5 seconds
4. **Publish draft:** Remove `draft: true` front matter
5. **Verify rendering:** Published article displays correctly
6. **Stop environment:** `docker-compose down` cleans up properly

**And** No errors in Docusaurus build logs
**And** No broken links or missing images
**And** Classic theme renders responsively (mobile and desktop)

**And** Documentation is complete:
- README.md with setup instructions
- Example article demonstrating front matter
- Troubleshooting section for common issues

**Prerequisites:** Stories 1.1-1.4 (entire Epic 1 foundation)

**Technical Notes:**
- This is an integration test story
- Validates all Epic 1 components work together
- Creates baseline for Epic 2 (deployment)
- Should take <30 minutes to verify manually

---

## Epic 2: GitHub Pages Deployment Pipeline

**Goal:** Automate Docusaurus build and deployment to GitHub Pages, establishing the canonical publishing destination with <5 minute commit-to-live time.

**Value:** Articles automatically published to primary platform (GitHub Pages) on merge to main. Proves automation works for at least one platform.

**Success Metrics:**
- Push to main → Live on GitHub Pages in <5 minutes
- Build succeeds on first try (Docusaurus 3.9 compatibility verified)
- Canonical URLs work correctly
- No manual deployment steps required

---

### Story 2.1: Create GitHub Actions Workflow for Docusaurus Build

As a developer,
I want GitHub Actions to automatically build Docusaurus when I push to main,
So that deployment is automated without manual intervention.

**Acceptance Criteria:**

**Given** The Docusaurus project is in a GitHub repository
**When** I create `.github/workflows/deploy.yml`
**Then** The workflow includes:
- Trigger on push to `main` branch
- Checkout action to get repository code
- Setup Node.js 20+
- Install dependencies (`npm ci`)
- Build Docusaurus site (`npm run build`)
- Upload build artifacts for deployment

**And** The workflow uses GitHub's official actions:
- `actions/checkout@v4`
- `actions/setup-node@v4`
- `actions/upload-pages-artifact@v3`

**And** Build configuration matches local environment:
- Same Docusaurus version (3.9)
- Same dependencies (from `package.json` / `package-lock.json`)
- Production build (`npm run build` sets production mode)

**Prerequisites:** Epic 1 complete (Docusaurus project must exist)

**Technical Notes:**
- Follow GitHub Pages official deployment documentation
- Pin the Docusaurus version in `package.json` for reproducible builds
- Exclude `draft: true` posts from production builds (automatic in `npm run build`)

---

### Story 2.2: Configure GitHub Pages Deployment

As a developer,
I want the built Docusaurus site automatically deployed to GitHub Pages,
So that articles are live at the canonical URL after build succeeds.

**Acceptance Criteria:**

**Given** GitHub Actions successfully builds Docusaurus
**When** The build completes
**Then** The site deploys to GitHub Pages automatically
- Uses `actions/deploy-pages@v4` action
- Deploys from build artifacts (not gh-pages branch)
- Site available at `https://username.github.io/personal-blog/`

**And** GitHub Pages settings are configured:
- Source: GitHub Actions (not branch-based)
- Custom domain: None (for MVP)
- HTTPS enforced

**And** Deployment permissions are correct:
- Workflow has `pages: write` permission
- Workflow has `id-token: write` permission
- Repository settings allow Actions deployments

**Prerequisites:** Story 2.1 (build workflow must exist)

**Technical Notes:**
- Use GitHub's newer Actions-based deployment (not gh-pages branch)
- Simpler than traditional approach
- Automatic HTTPS certificate

---

### Story 2.3: Validate Canonical URLs and SEO

As a developer,
I want canonical URLs to point correctly to GitHub Pages,
So that SEO works properly and platforms know the authoritative source.

**Acceptance Criteria:**

**Given** An article is published to GitHub Pages
**When** I inspect the HTML source
**Then** The canonical link tag is present:
```html
<link rel="canonical" href="https://username.github.io/personal-blog/article-slug/" />
```

**And** SEO metadata is complete:
- `<title>` tag with article title
- `<meta name="description">` from front matter
- Open Graph tags (og:title, og:description, og:url)
- Twitter Card tags

**And** The canonical URL in front matter matches deployed URL:
- Front matter: `canonical_url: "https://username.github.io/personal-blog/article-slug"`
- Deployed URL: `https://username.github.io/personal-blog/article-slug/`
- Consistency across all articles

**Prerequisites:** Story 2.2 (deployment must work)

**Technical Notes:**
- `@docusaurus/preset-classic` generates SEO metadata (title, description, Open Graph) automatically
- Validate with sample article from Epic 1
- Test with SEO checking tools (Google Rich Results Test)

---

### Story 2.4: Implement Build Failure Notifications

As a developer,
I want to be notified immediately if the Docusaurus build fails,
So that I can fix issues before they block publishing.

**Acceptance Criteria:**

**Given** GitHub Actions workflow is running
**When** The Docusaurus build fails (syntax error, missing dependency, etc.)
**Then** I receive a notification:
- GitHub email notification (automatic)
- Workflow status visible in repository
- Failed commit marked in Git history

**And** Build logs provide actionable error messages:
- Specific Docusaurus build error displayed
- Line number if syntax error in markdown
- Missing npm dependency clearly stated

**And** Workflow prevents deployment on build failure:
- Deploy step only runs if build succeeds
- No partial deployments
- Git commit marked as failed

**Prerequisites:** Stories 2.1-2.2 (workflow must be deployable)

**Technical Notes:**
- GitHub Actions handles notifications by default
- Focus on clear error messages in workflow
- Test with intentional build failure (malformed markdown)

---

### Story 2.5: End-to-End GitHub Pages Publishing Test

As a developer,
I want to verify the complete GitHub Pages workflow end-to-end,
So that I'm confident automated publishing works before adding platform syndication.

**Acceptance Criteria:**

**Given** All Epic 2 stories are complete
**When** I perform end-to-end publishing validation
**Then** The following workflow succeeds:

1. **Create article:** New post in `blog/2025-01-08-test-deployment.mdx`
2. **Commit and push:** `git push origin main`
3. **Workflow triggers:** GitHub Actions starts automatically
4. **Build succeeds:** Docusaurus builds without errors
5. **Deploy succeeds:** Site deploys to GitHub Pages
6. **Verify live:** Article accessible at canonical URL within 5 minutes
7. **Validate SEO:** Canonical tags and metadata correct

**And** Performance metrics are met:
- Commit to live: <5 minutes
- Build time: <2 minutes
- Deploy time: <1 minute
- Page load: <3 seconds

**And** Rollback works correctly:
- `git revert` commit
- Push triggers redeploy
- Previous version restored

**Prerequisites:** Stories 2.1-2.4 (entire Epic 2 pipeline)

**Technical Notes:**
- Integration test validating full automation
- Tests the "magic moment" - commit → auto-publish
- Establishes baseline for Epic 3 (adding platforms)
- Document exact timing for future reference

---

## Epic 3: Multi-Platform Syndication

**Goal:** Implement automated syndication to Dev.to, Medium, and Hashnode with graceful degradation, completing the "write once, publish everywhere" automation.

**Value:** Zero manual cross-posting - articles appear on all 4 platforms automatically with proper canonical URLs. Maximum reach with minimal effort.

**Success Metrics:**
- Single commit publishes to all 4 platforms successfully
- Platform failures don't block other platforms (graceful degradation)
- Canonical URLs correctly point to GitHub Pages
- Total workflow time <5 minutes including all platforms

---

### Story 3.1: Implement Change Detection Script

As a developer,
I want to detect which articles changed in a commit,
So that only new/modified articles are published (not entire site).

**Acceptance Criteria:**

**Given** A commit is pushed to main
**When** The GitHub Actions workflow runs `scripts/detect_changes.py`
**Then** The script outputs a list of changed article files:
- Compares HEAD vs HEAD~1 (previous commit)
- Filters for files in `blog/` directory only
- Returns full paths to changed markdown files
- Excludes deleted files

**And** The script handles edge cases:
- First commit (no HEAD~1): Publishes all articles
- Multiple articles in one commit: Returns all changed files
- Non-article changes (README, config): Returns empty list
- Branch merge: Detects all articles since divergence

**And** Output format is machine-readable:
```json
{
  "changed_articles": [
    "blog/2025-01-08-article-one.mdx",
    "blog/2025-01-09-article-two.mdx"
  ]
}
```

**Prerequisites:** Epic 2 complete (GitHub Actions workflow exists)

**Technical Notes:**
- Use `git diff --name-status HEAD HEAD~1`
- Filter for `blog/*.mdx` pattern
- Python script for consistency with platform adapters
- See architecture.md for implementation pattern

---

### Story 3.2: Build Dev.to Platform Adapter

As a developer,
I want a Python script that publishes articles to Dev.to via REST API,
So that articles automatically syndicate to the Dev.to platform.

**Acceptance Criteria:**

**Given** An article file path and Dev.to API key
**When** `scripts/publish_devto.py` is executed
**Then** The script performs the following:

1. **Parse article:** Extract front matter and content
2. **Convert markdown:** Handle any Dev.to-specific quirks
3. **Call Dev.to API:** POST to `https://dev.to/api/articles`
4. **Return result:** `{'success': True/False, 'url': str, 'error': str}`

**And** The API request includes:
```json
{
  "article": {
    "title": "from front matter",
    "body_markdown": "article content",
    "tags": ["from", "front", "matter"],
    "canonical_url": "GitHub Pages URL",
    "published": false
  }
}
```

**And** Error handling follows architecture pattern:
- Never raises exceptions (catch all, return error dict)
- Logs API response for debugging
- Returns structured result always
- Graceful failure (doesn't crash workflow)

**And** Authentication uses GitHub Secret:
- API key from `${{ secrets.DEV_TO_API_KEY }}`
- Header: `api-key: YOUR_API_KEY`
- Never logged or exposed

**Prerequisites:** Story 3.1 (change detection must work)

**Technical Notes:**
- Follow architecture.md API integration pattern
- Use `requests` library for HTTP calls
- Use `frontmatter` library for parsing
- Test locally before workflow integration

---

### Story 3.3: Build Medium Platform Adapter (with Deprecation Handling)

As a developer,
I want a Python script that publishes articles to Medium via REST API,
So that articles syndicate to Medium despite the deprecated API.

**Acceptance Criteria:**

**Given** An article file path and Medium API key
**When** `scripts/publish_medium.py` is executed
**Then** The script performs the following:

1. **Log deprecation warning:** "Medium API deprecated, may fail"
2. **Parse article:** Extract front matter and content
3. **Call Medium API:** POST to `https://api.medium.com/v1/users/{userId}/posts`
4. **Return result:** `{'success': True/False, 'url': str, 'error': str}`

**And** The API request includes:
```json
{
  "title": "from front matter",
  "contentFormat": "markdown",
  "content": "article content",
  "tags": ["from", "front", "matter"],
  "canonicalUrl": "GitHub Pages URL",
  "publishStatus": "draft"
}
```

**And** Handles API limitations:
- **Cannot update posts** - Only first publish works
- **May fail anytime** - API deprecated, return graceful error
- **Requires userId** - Get from `${{ secrets.MEDIUM_USER_ID }}`

**And** Error handling is extra defensive:
- Log warning about deprecated API status
- Return success=False if API returns any error
- Clear error message explaining deprecation if fails
- Doesn't block other platforms

**Prerequisites:** Story 3.2 (Dev.to adapter as reference pattern)

**Technical Notes:**
- Follow same pattern as Dev.to adapter
- Header: `Authorization: Bearer YOUR_ACCESS_TOKEN`
- Accept that this may break in future (documented risk)
- See ADR-002 in architecture.md for context

---

### Story 3.4: Build Hashnode Platform Adapter

As a developer,
I want a Python script that publishes articles to Hashnode via GraphQL API,
So that articles syndicate to the Hashnode platform.

**Acceptance Criteria:**

**Given** An article file path and Hashnode API key
**When** `scripts/publish_hashnode.py` is executed
**Then** The script performs the following:

1. **Parse article:** Extract front matter and content
2. **Build GraphQL mutation:** `publishPost` with input
3. **Call Hashnode API:** POST to `https://gql.hashnode.com`
4. **Return result:** `{'success': True/False, 'url': str, 'error': str}`

**And** The GraphQL mutation is:
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

**And** The variables include:
```json
{
  "input": {
    "title": "from front matter",
    "contentMarkdown": "article content",
    "tags": [{"slug": "python"}, {"slug": "automation"}],
    "publicationId": "from secret",
    "canonicalUrl": "GitHub Pages URL"
  }
}
```

**And** Uses GraphQL client library:
- `gql` library for GraphQL requests
- Header: `Authorization: YOUR_API_KEY`
- Proper error handling for GraphQL errors

**Prerequisites:** Stories 3.2-3.3 (platform adapter patterns established)

**Technical Notes:**
- GraphQL is different from REST - use `gql` library
- Tags format differs (array of objects vs strings)
- Requires `HASHNODE_API_KEY` and `HASHNODE_PUBLICATION_ID` secrets
- See architecture.md API contracts section

---

### Story 3.5: Integrate Platform Adapters into GitHub Actions

As a developer,
I want GitHub Actions to call all platform adapters after deploying to GitHub Pages,
So that the complete multi-platform syndication is automated.

**Acceptance Criteria:**

**Given** GitHub Pages deployment succeeds
**When** The workflow continues to syndication steps
**Then** The workflow executes in parallel:

1. **Detect changes:** Run `detect_changes.py` → Get list of changed articles
2. **For each changed article:**
   - **Publish to Dev.to** (continue-on-error: true)
   - **Publish to Medium** (continue-on-error: true)
   - **Publish to Hashnode** (continue-on-error: true)
3. **Report results:** Aggregate success/failure across platforms

**And** The workflow configuration includes:
- Separate step for each platform (enables parallel execution)
- `continue-on-error: true` on all platform steps
- GitHub Secrets configured: `DEV_TO_API_KEY`, `MEDIUM_API_KEY`, `HASHNODE_API_KEY`, `MEDIUM_USER_ID`, `HASHNODE_PUBLICATION_ID`

**And** The workflow logs show:
```
✅ GitHub Pages: Published
✅ Dev.to: Published to https://dev.to/...
⚠️  Medium: Failed (deprecated API) - continuing
✅ Hashnode: Published to https://hashnode.com/...
Summary: 3/4 platforms successful
```

**And** Graceful degradation works:
- If Dev.to fails, Medium and Hashnode still attempt
- If all platforms fail, GitHub Pages still deployed
- Workflow marked successful if GitHub Pages succeeds (platforms optional)

**Prerequisites:** Stories 3.1-3.4 (all scripts must exist)

**Technical Notes:**
- Use GitHub Actions matrix strategy for parallel execution (optional optimization)
- Each platform step outputs URL or error
- Final summary step aggregates results
- See architecture.md workflow pattern

---

### Story 3.6: End-to-End Multi-Platform Publishing Test

As a developer,
I want to verify the complete multi-platform workflow end-to-end,
So that I'm confident the full "write once, publish everywhere" automation works.

**Acceptance Criteria:**

**Given** All Epic 3 stories are complete
**When** I perform end-to-end multi-platform validation
**Then** The following workflow succeeds:

1. **Create article:** New post `blog/2025-01-08-multi-platform-test.mdx`
2. **Commit and push:** `git push origin main`
3. **Workflow triggers:** GitHub Actions starts
4. **GitHub Pages:** Deploys successfully
5. **Change detection:** Identifies the new article
6. **Dev.to:** Publishes successfully, returns URL
7. **Medium:** Attempts publish (may fail due to deprecated API)
8. **Hashnode:** Publishes successfully, returns URL
9. **Verify canonical URLs:** All platforms show GitHub Pages as canonical
10. **Total time:** <5 minutes from commit to all platforms live

**And** Graceful degradation is validated:
- Test with intentional Dev.to API failure (invalid key)
- Verify Medium and Hashnode still publish
- Verify GitHub Pages unaffected
- Workflow shows partial success message

**And** Performance metrics are met:
- GitHub Pages: <2 minutes
- Platform syndication (all 3): <3 minutes total
- Page loads on all platforms: <3 seconds each

**And** The "magic moment" is achieved:
- Single commit publishes to 4 platforms
- Zero manual intervention
- Articles live everywhere within 5 minutes
- Developer only touched Git (no platform logins)

**Prerequisites:** Stories 3.1-3.5 (entire Epic 3 pipeline)

**Technical Notes:**
- This is the ultimate validation of the PRD vision
- Tests the core value proposition
- Validates architecture.md graceful degradation principle
- Document successful run as proof for Epic 4

---

## Epic 4: Production Validation & Sustainability

**Goal:** Publish 10 real articles to validate automation reliability and sustainable weekly cadence, proving the system works in production.

**Value:** Demonstrates the platform achieves its core promise - reliable automation supporting sustainable knowledge transfer at scale.

**Success Metrics:**
- 10 articles published successfully across all platforms
- Weekly cadence sustainable (<8 hours per article)
- Automation reliability >90% (max 1 failure in 10 publishes)
- Zero manual cross-posting required

---

### Story 4.1: Publish First 3 Articles (Foundation Topics)

As a content creator,
I want to publish my first 3 foundational articles,
So that I validate the automation with real content and establish my blog's foundation.

**Acceptance Criteria:**

**Given** The multi-platform automation is working (Epic 3 complete)
**When** I write and publish 3 articles over 3 weeks
**Then** Each article:
- Publishes successfully to all 4 platforms
- Contains real technical content (not test/sample content)
- Includes working code examples in GitHub repositories
- Takes <8 hours from writing to published (sustainable pace)

**And** Suggested foundational topics (from brainstorming session):
1. **"Building this Blog: Multi-Platform Publishing with GitHub Actions"** - Meta-content about BMAD-METHOD
2. **"FastAPI + OAuth2: Production-Ready Identity Integration"** - Identity & Auth branch
3. **"Docker Compose for Docusaurus Development"** - Infrastructure branch

**And** Each article demonstrates:
- Proper front matter format
- Code syntax highlighting
- Images/diagrams (if applicable)
- Links to working GitHub repository code
- Canonical URL properly configured

**And** Validation after each article:
- Verify live on all 4 platforms
- Check canonical URLs point to GitHub Pages
- Measure time from draft to published
- Document any automation issues encountered

**Prerequisites:** Epic 3 complete (automation must work)

**Technical Notes:**
- These are REAL articles, not tests
- Use actual content from your 43-article roadmap
- First article should document the BMAD-METHOD journey (meta-content)
- Validate <8 hour/article pace is achievable

---

### Story 4.2: Publish Next 4 Articles (Core Technical Content)

As a content creator,
I want to publish 4 more technical articles,
So that I prove consistent weekly cadence and cover diverse technical topics.

**Acceptance Criteria:**

**Given** First 3 articles published successfully
**When** I write and publish 4 more articles over 4 weeks
**Then** Each article:
- Published on weekly cadence (1 per week)
- Covers different technical domains from brainstorming session
- Automation success rate remains high (max 1 failure)
- Time remains sustainable (<8 hours per article)

**And** Suggested technical topics (diverse coverage):
1. **GIS topic:** "PostGIS Vector Tiles with FastAPI" or "GeoPandas for Geospatial Analysis"
2. **Code Generation topic:** "Multi-Language Scaffolding with Codegen" or "Template-Driven Development"
3. **Cloud/IaC topic:** "Terraform AWS Modules" or "Kubernetes on AWS with EKS"
4. **Database topic:** "PostgreSQL Performance Tuning" or "Database Migration Strategies"

**And** For each article, track:
- **Writing time:** Hours spent on content creation
- **Code example time:** Hours spent on working code
- **Publishing issues:** Any automation failures or manual fixes needed
- **Platform success:** Which platforms published successfully

**And** Cumulative validation (7 articles total):
- Calculate average time per article
- Calculate automation success rate
- Identify any recurring issues
- Assess weekly pace sustainability

**Prerequisites:** Story 4.1 (first 3 articles published)

**Technical Notes:**
- This tests sustainability over a month
- Diverse topics stress-test markdown compatibility across platforms
- Track metrics for retrospective analysis
- Adjust workflow if consistent issues found

---

### Story 4.3: Publish Final 3 Articles (Advanced Topics)

As a content creator,
I want to publish the final 3 articles to reach 10 total,
So that I complete the MVP validation and prove long-term viability.

**Acceptance Criteria:**

**Given** 7 articles published successfully
**When** I write and publish the final 3 articles
**Then** The 10-article milestone is achieved:
- All articles live on 4 platforms
- Weekly cadence maintained throughout
- Automation reliability proven (>90% success rate)
- Sustainable pace confirmed (<8 hours average per article)

**And** Suggested advanced topics (showcase expertise):
1. **Multi-language topic:** "Porting Python Libraries to Go: Lessons from py-identity-model"
2. **Security topic:** "Field-Level Encryption in PostgreSQL" or "Zero-Trust Architecture Patterns"
3. **Advanced integration:** "End-to-End OAuth2 Flow: Client + Server + Identity Provider"

**And** Final validation across all 10 articles:
- **Automation success rate:** Calculate failures / total publishes
- **Average time per article:** Confirm <8 hours is realistic
- **Platform reliability:** Which platforms most reliable
- **Content quality:** All articles have working code examples

**And** Retrospective analysis:
- What automation issues occurred?
- What manual interventions were needed?
- Is weekly cadence sustainable long-term?
- Which platform caused most friction?
- Were there any Medium API failures (deprecated API risk)?

**Prerequisites:** Story 4.2 (7 articles published)

**Technical Notes:**
- This completes the PRD success criteria (10 articles)
- Provides data for continuous improvement
- Validates the entire knowledge transfer hypothesis
- Documents proof for future reference

---

### Story 4.4: Document MVP Success and Lessons Learned

As a product owner,
I want to document the MVP results and lessons learned,
So that I have proof the system works and insights for future improvements.

**Acceptance Criteria:**

**Given** 10 articles published across all platforms
**When** I analyze the complete MVP experience
**Then** A retrospective document is created with:

**Automation Metrics:**
- Total articles published: 10
- Automation success rate: X/10 publishes succeeded
- Average time per article: X hours
- Average commit-to-live time: X minutes
- Platform-specific success rates (GitHub Pages, Dev.to, Medium, Hashnode)

**Content Metrics:**
- Topics covered: List of 10 article topics
- GitHub repositories created: Links to code examples
- Total words written: Approximate count
- Average article length: Words per article

**Lessons Learned:**
- What worked well (celebrate successes)
- What caused friction (automation issues, platform quirks)
- Manual interventions required (how many, what type)
- Unexpected benefits or challenges
- Medium API status (did deprecated API work throughout?)

**Future Improvements:**
- Identified pain points to address
- Nice-to-have features from PRD growth phase
- Platform-specific fixes needed
- Workflow optimizations discovered

**And** Update project documentation:
- README with "Proven in Production" badge
- Link to all 10 published articles
- Stats dashboard (if simple)
- Continuous improvement backlog

**Prerequisites:** Story 4.3 (10 articles complete)

**Technical Notes:**
- This is your victory lap and proof point
- Data validates the knowledge transfer hypothesis
- Informs decision: continue weekly, adjust cadence, or add features
- Becomes meta-content for future articles

---

### Story 4.5: Plan Growth Phase (Optional)

As a product owner,
I want to review PRD growth features and prioritize next steps,
So that I can evolve the platform based on real usage experience.

**Acceptance Criteria:**

**Given** MVP is proven successful (10 articles, automation working)
**When** I review the PRD growth features
**Then** I decide on next priorities from:

**Phase 1 - Content Organization (from PRD):**
- Article series/collections grouping
- Topic taxonomies beyond tags
- Search functionality
- Related articles

**Phase 2 - Reader Engagement:**
- Newsletter integration
- Social media auto-posting (Twitter, LinkedIn)
- Comment aggregation

**Phase 3 - Analytics:**
- Privacy-focused analytics (Plausible)
- Reader metrics
- Platform performance comparison

**Phase 4 - UI Customization:**
- Theme customization (colors, typography)
- Custom homepage showcasing projects
- Enhanced code presentation

**And** Prioritization criteria:
- What pain points emerged during MVP?
- What would most accelerate weekly publishing?
- What would increase reader value?
- What's simplest to implement?

**And** Decision documented:
- Continue with current system as-is
- OR implement specific growth features
- OR pivot based on learnings
- Timeline and roadmap (if continuing)

**Prerequisites:** Story 4.4 (retrospective complete)

**Technical Notes:**
- This story is optional - may decide current system is sufficient
- PRD growth features provide options, not mandates
- Real usage data informs better decisions than speculation
- Success is "automation works" - everything else is enhancement

---

_Epic 4 completes the MVP validation. System is proven with 10 real articles demonstrating automation reliability and sustainable knowledge transfer at scale._

---

## Implementation Summary

**Total Stories:** 21 stories across 4 epics

**Epic Breakdown:**
- **Epic 1:** 5 stories (Docusaurus foundation & local dev)
- **Epic 2:** 5 stories (GitHub Pages deployment)
- **Epic 3:** 6 stories (Multi-platform syndication)
- **Epic 4:** 5 stories (Production validation)

**Estimated Timeline:**
- Epic 1: 1-2 weeks (foundation)
- Epic 2: 1 week (deployment automation)
- Epic 3: 2-3 weeks (platform integrations)
- Epic 4: 10 weeks (1 article/week validation)
- **Total: ~14-16 weeks to proven MVP**

**Success Criteria Mapping:**
- ✅ 100% publish success rate → Epic 3.6, Epic 4 (all stories)
- ✅ <5 minute publish time → Epic 2.5, Epic 3.6
- ✅ Zero manual intervention → Epic 3.5, Epic 3.6
- ✅ 10 published articles → Epic 4.1-4.3
- ✅ <8 hours per article → Epic 4.1-4.3 (tracked)

---

_For implementation: Use `/bmad:bmm:workflows:create-story` to generate individual story implementation plans from this epic breakdown._

_Next recommended workflows:_
- _Architecture validation: `/bmad:bmm:workflows:validate-architecture`_
- _Solutioning gate check: `/bmad:bmm:workflows:solutioning-gate-check`_
- _Sprint planning: `/bmad:bmm/workflows:sprint-planning` (when ready for Phase 4)_
