# {{project_name}} - Product Requirements Document

**Author:** {{user_name}}
**Date:** {{date}}
**Version:** 1.0

---

## Executive Summary

**Vision:** A Git-native technical blogging platform that eliminates manual cross-posting through automated multi-platform syndication, enabling sustainable knowledge transfer at scale.

**Core Problem:** Technical writers must choose between content ownership (GitHub Pages) and reach (Medium/Dev.to/Hashnode), then manually syndicate content across platforms - a tedious, error-prone process that kills momentum.

**Solution:** Write markdown once in Git → Commit triggers GitHub Actions → Auto-publish to 4 platforms (GitHub Pages, Dev.to, Medium, Hashnode) with proper canonical URLs → Zero manual intervention.

**Product Brief:** docs/product-brief-personal-blog-2025-11-08.md

### What Makes This Special

**The magic moment:** Committing an article and watching it appear perfectly formatted across all 4 platforms within 5 minutes, knowing you can sustain this weekly without friction.

**Dual purpose:**
1. **Practical automation** - "Eating your own dogfood" with a publishing system that actually works
2. **Knowledge crystallization experiment** - Testing whether AI assistance enables transferring tacit expertise (OAuth2 patterns, PostGIS optimization, microservice decomposition) into reusable digital artifacts at sustainable velocity

**Meta-layer:** The platform's development using BMAD-METHOD becomes blog content itself - documenting the AI-assisted planning and implementation journey as proof of concept for the knowledge transfer hypothesis.

**Success proof:** 10 published articles demonstrating both automation reliability and content sustainability.

---

## Project Classification

**Technical Type:** Developer Tool / CLI + Web App Hybrid
**Domain:** General Software (Technical Publishing)
**Complexity:** Low-Medium

**Classification Rationale:**

This is fundamentally a **developer tool** - a Git-based automation workflow that developers interact with through commits and CI/CD. It has a minimal **web app** component (static site via GitHub Pages) but the core innovation is the publishing automation.

**Primary components:**
- GitHub Actions workflow (automation engine)
- Static site generator (Jekyll/Hugo/11ty)
- Multi-platform API integrations (Dev.to, Medium, Hashnode)
- Markdown processing and transformation pipeline

**Domain:** General software development - no specialized domain complexity (healthcare, fintech, etc.). Standard software practices apply.

---

## Success Criteria

### MVP Success (Must Achieve)

**Automation Reliability:**
- ✅ **100% publish success rate** - Every commit to `main` triggers successful publication to all 4 platforms
- ✅ **<5 minute publish time** - From commit to live on all platforms
- ✅ **Zero manual intervention** - No copy/paste, no platform logins, no manual formatting
- ✅ **Clear failure notification** - If workflow fails, immediate alert (not silent failure)

**Content Sustainability:**
- ✅ **10 published articles** - Proves weekly cadence is achievable
- ✅ **<8 hours per article** - Article writing + working code example completed in sustainable timeframe
- ✅ **Every article has working code** - GitHub repository link with functional examples

**Technical Quality:**
- ✅ **Canonical URLs working** - SEO properly configured with GitHub Pages as source
- ✅ **Code syntax highlighting** - Technical content renders correctly on all platforms
- ✅ **Markdown compatibility** - Platform-specific quirks handled by conversion scripts

### Secondary Success Indicators (Measured, Not Optimized For)

**Knowledge Transfer Validation:**
- Readers successfully implement solutions (evidenced by GitHub issues/questions showing actual usage)
- Teaching clarifies understanding (writing reveals knowledge gaps, refines mental models)

**Engagement (Nice-to-Have):**
- GitHub stars/forks on py-identity-model, codegen
- Organic citations in technical discussions
- Developers asking implementation questions

**Career/Professional (Long-term):**
- Inbound recruiting opportunities
- Speaking/conference invitations
- Community recognition in identity/GIS/cloud domains

### Failure Criteria (What Would Make This Not Worth It)

- **Automation breaks frequently** - Manual intervention becomes regular occurrence
- **Weekly pace unsustainable** - Articles take >8 hours consistently
- **Platform friction** - APIs change/break and require constant maintenance
- **Content doesn't transfer** - Readers can't successfully implement solutions from articles

---

## Product Scope

### MVP - Minimum Viable Product

**Core automation pipeline - must work flawlessly:**

1. **Markdown-first content system**
   - Write articles in pure markdown with YAML front matter (title, date, tags, description, canonical URL)
   - Source files remain in Git repository
   - Optimized for technical content: code blocks, diagrams, examples

2. **Static site generation**
   - Jekyll/Hugo/11ty (choose simplest option - likely Jekyll for GitHub Pages native support)
   - Runs in Docker Compose environment for local development and testing
   - **Default theme for MVP** - no customization until automation proven
   - Code syntax highlighting (default theme provides this)
   - Mobile-responsive (default theme handles this)
   - Local preview via Docker Compose before committing
   - Deploy to GitHub Pages from Docker build output

3. **Multi-platform syndication automation**
   - GitHub Actions workflow triggered on **merge to `main`** (not every commit)
   - Publish only changed/new articles (not full republish every time)
   - Publish to Dev.to via REST API
   - Publish to Medium via API (research needed - may have limitations)
   - Publish to Hashnode via GraphQL API
   - Platform-specific markdown conversion (handle quirks)
   - Canonical URL configuration pointing to GitHub Pages

4. **Draft workflow**
   - `/drafts` directory for unpublished articles
   - Articles moved to `/posts` or `/articles` when ready to publish
   - Local preview works for drafts (via Docker Compose)
   - Only articles in publish directory trigger syndication on merge to `main`

5. **Reliability & observability**
   - Workflow succeeds or fails clearly (no silent failures)
   - Notification on publish failure (GitHub Actions notifications)
   - Git-based rollback capability

6. **Local development workflow**
   - Docker Compose environment spins up local Jekyll/Hugo instance
   - Live reload on file changes
   - Preview drafts and published articles locally before merging
   - Same environment locally as in CI/CD (consistency)

**MVP validation test:**
- Article #1 committed → Published to all 4 platforms within 5 minutes → Zero manual steps
- Repeat for 10 articles to prove sustainability

### Growth Features (Post-MVP)

**Deferred until automation proven and 10 articles published:**

**Phase 1 - Content organization:**
- Article series/collections grouping
- Topic taxonomies beyond tags
- Learning paths (beginner → advanced)
- Search functionality

**Phase 2 - Reader engagement:**
- Newsletter integration (Substack, Buttondown, or custom)
- RSS feed enhancements
- Social media auto-posting (Twitter, LinkedIn)
- Comment aggregation across platforms

**Phase 3 - Analytics & optimization:**
- Privacy-focused analytics (Plausible, Simple Analytics)
- Reader satisfaction tracking
- A/B testing for titles/descriptions

**Phase 4 - UI customization & branding:**
- Theme customization: colors, typography, layout
- Custom homepage showcasing GitHub projects (py-identity-model, codegen)
- Enhanced code presentation (copy buttons, language tabs)
- Custom navigation and footer
- Custom domain setup (move from username.github.io)
- Performance optimization

### Vision (Future)

**Long-term enhancements exploring the knowledge transfer hypothesis:**

**Content reuse & amplification:**
- Automatic slide deck generation from articles
- Conference talk support
- Video script generation
- Podcast episode outlines

**AI experimentation:**
- AI-assisted code example generation
- Automated article improvement suggestions
- Multi-language translation for global reach
- Context-aware article recommendations

**Meta-content series:**
- "Building a Multi-Platform Blog with AI Assistance" - documenting this journey using BMAD-METHOD
- Capture planning sessions, architectural decisions, implementation challenges
- Demonstrate knowledge transfer in action

---

{{#if domain_considerations}}

## Domain-Specific Requirements

{{domain_considerations}}

This section shapes all functional and non-functional requirements below.
{{/if}}

---

{{#if innovation_patterns}}

## Innovation & Novel Patterns

{{innovation_patterns}}

### Validation Approach

{{validation_approach}}
{{/if}}

---

{{#if project_type_requirements}}

## {{project_type}} Specific Requirements

{{project_type_requirements}}

{{#if endpoint_specification}}

### API Specification

{{endpoint_specification}}
{{/if}}

{{#if authentication_model}}

### Authentication & Authorization

{{authentication_model}}
{{/if}}

{{#if platform_requirements}}

### Platform Support

{{platform_requirements}}
{{/if}}

{{#if device_features}}

### Device Capabilities

{{device_features}}
{{/if}}

{{#if tenant_model}}

### Multi-Tenancy Architecture

{{tenant_model}}
{{/if}}

{{#if permission_matrix}}

### Permissions & Roles

{{permission_matrix}}
{{/if}}
{{/if}}

---

{{#if ux_principles}}

## User Experience Principles

{{ux_principles}}

### Key Interactions

{{key_interactions}}
{{/if}}

---

## Functional Requirements

### FR-1: Content Authoring

**FR-1.1: Markdown Article Creation**
- User writes articles in pure markdown with YAML front matter
- Required front matter fields: `title`, `date`, `tags`, `description`, `canonical_url`
- Support for code blocks with syntax highlighting (inline and fenced)
- Support for images stored in repository
- Support for diagrams (Mermaid or similar)

**FR-1.2: Draft Management**
- Articles placed in `/drafts` directory are not published
- Drafts visible in local preview via Docker Compose
- Moving article from `/drafts` to `/posts` or `/articles` makes it publishable
- Git history tracks article evolution from draft to published

**FR-1.3: Local Preview**
- `docker-compose up` starts local Jekyll/Hugo instance
- Live reload on file changes (hot reload)
- Preview URL accessible at `localhost:4000` (or configured port)
- Drafts and published articles both visible locally
- Same rendering as production (consistency)

### FR-2: Static Site Generation

**FR-2.1: Build Process**
- Jekyll/Hugo/11ty processes markdown to HTML
- Default theme applied (no customization for MVP)
- Code syntax highlighting automatically applied
- Mobile-responsive layouts (default theme provides)
- Generated site output ready for GitHub Pages deployment

**FR-2.2: Site Structure**
- Homepage listing recent articles
- Individual article pages
- Tag-based article listing pages (if theme supports)
- RSS feed generated automatically (if theme supports)
- Sitemap.xml for SEO

### FR-3: Multi-Platform Publishing

**FR-3.1: Automated Workflow Trigger**
- GitHub Actions workflow triggered on merge to `main` branch
- Workflow detects changed files in `/posts` or `/articles` directory
- Only publishes new or modified articles (not full site republish)
- Skips workflow if only non-article files changed (README, config, etc.)

**FR-3.2: GitHub Pages Publication**
- Build static site from markdown source
- Deploy built site to GitHub Pages (`username.github.io/repo-name` or custom)
- Site available at canonical URL for all articles
- Update occurs within 5 minutes of merge

**FR-3.3: Dev.to Syndication**
- POST to Dev.to API with article content
- Convert markdown to Dev.to-compatible format
- Set canonical URL pointing to GitHub Pages
- Include tags from front matter
- Handle Dev.to markdown quirks (if any)
- Return article URL for verification

**FR-3.4: Medium Syndication**
- POST to Medium API with article content
- Convert markdown to Medium-compatible format
- Set canonical URL pointing to GitHub Pages
- Include tags from front matter
- Handle Medium API limitations/workarounds
- Return article URL for verification

**FR-3.5: Hashnode Syndication**
- POST to Hashnode GraphQL API with article content
- Convert markdown to Hashnode-compatible format
- Set canonical URL pointing to GitHub Pages
- Include tags from front matter
- Return article URL for verification

**FR-3.6: Platform-Specific Formatting**
- Detect and convert platform markdown differences
- Handle code block syntax variations
- Preserve inline code, links, images across platforms
- Fallback gracefully if conversion fails (log error, continue)

### FR-4: Workflow Reliability

**FR-4.1: Success/Failure Detection**
- Each platform publish step reports success/failure clearly
- Workflow marked as failed if any platform fails
- Partial success reported (e.g., "3/4 platforms successful")
- No silent failures

**FR-4.2: Notifications**
- GitHub Actions failure notifications sent on workflow failure
- Success notification with URLs to all published versions
- Include specific error messages for debugging

**FR-4.3: Rollback Capability**
- Git revert undoes article publication trigger
- Re-running workflow on previous commit state restores prior version
- Platform updates follow Git state (update published versions on re-publish)

### FR-5: Article Updates

**FR-5.1: Update Detection**
- Workflow detects modified articles (Git diff on merge)
- Identifies which articles changed since last publish

**FR-5.2: Update Propagation**
- Updates GitHub Pages with new content
- Updates Dev.to, Medium, Hashnode with revised content (if APIs support)
- Preserves canonical URLs (same article, updated content)
- Maintains publication history

---

## Non-Functional Requirements

### NFR-1: Performance

**Build Performance:**
- Docker Compose local preview starts in <30 seconds
- Live reload reflects changes in <5 seconds
- Static site build completes in <2 minutes for 50 articles

**Publish Performance:**
- Total workflow time (all 4 platforms) <5 minutes from merge to live
- GitHub Pages deployment <2 minutes
- Each platform API call <30 seconds

**Page Load Performance:**
- GitHub Pages article loads in <3 seconds (default theme should handle this)
- Mobile-friendly performance (default theme should handle this)

### NFR-2: Reliability

**Automation Reliability:**
- **Target: 100% success rate** for properly formatted articles
- Graceful degradation: If one platform fails, others still publish
- Retry logic for transient API failures (network issues, rate limits)
- Idempotent operations: Re-running workflow on same article is safe

**Data Integrity:**
- Git is single source of truth - no data loss
- Article content preserved exactly across platforms (within markdown compatibility)
- Canonical URLs never change once set

### NFR-3: Security

**API Security:**
- Platform API keys stored as GitHub Secrets (never in code)
- API keys have minimum required permissions (write to blog, nothing else)
- No secrets exposed in workflow logs

**Content Security:**
- Markdown sanitization to prevent XSS (static site generator handles this)
- No user input processed (content comes from trusted Git repository)
- HTTPS for all published sites (GitHub Pages, platforms provide this)

### NFR-4: Maintainability

**Code Organization:**
- GitHub Actions workflow defined in `.github/workflows/publish.yml`
- Platform-specific publishing scripts separated (modular)
- Docker Compose configuration in `docker-compose.yml`
- Clear README with setup instructions

**Debugging:**
- Workflow logs all platform API responses
- Error messages include specific failure reasons
- Failed articles identifiable in workflow output

**Dependency Management:**
- Pin static site generator version (reproducible builds)
- Pin GitHub Actions versions (stability)
- Document required platform API versions/capabilities

### NFR-5: Portability

**Environment Portability:**
- Everything runs in Docker Compose (local = CI/CD)
- No reliance on local machine configuration
- Works on macOS, Linux, Windows (Docker Compose cross-platform)

**Content Portability:**
- Pure markdown source (never locked to specific platform)
- Can switch static site generators without rewriting content
- Can drop/add syndication platforms without affecting source
- Export entire blog by cloning Git repository

### NFR-6: Scalability

**Content Scale:**
- Support for 100+ articles without performance degradation
- Incremental builds (only changed articles) for efficiency
- No database required (stateless static generation)

**Platform Scale:**
- Easy to add new syndication platforms (modular architecture)
- Easy to remove platforms if APIs sunset or pricing changes

_Note: Accessibility, integration complexity, and advanced scalability not critical for MVP - static site with default theme handles basics._

---

## Implementation Planning

### Epic Breakdown Required

Requirements must be decomposed into epics and bite-sized stories (200k context limit).

**Next Step:** Run `workflow create-epics-and-stories` to create the implementation breakdown.

---

## References

**Product Brief:** docs/product-brief-personal-blog-2025-11-08.md
**Brainstorming Session:** docs/bmm-brainstorming-session-2025-11-08.md

**Supporting Context:**
- 43 articles mapped across 9 content branches
- Open source projects: py-identity-model, codegen
- Content strategy: End-to-end integrated solutions with working code
- Meta-documentation: BMAD-METHOD usage will become blog content

---

## PRD Summary

**What we're building:** A Git-native automated publishing platform that eliminates manual cross-posting friction.

**The magic:** Commit article → Watch it appear perfectly on 4 platforms in 5 minutes → Sustainable weekly cadence.

**MVP proof:** 10 published articles demonstrating both automation reliability and content sustainability.

**Core requirements:**
- 5 functional requirement categories (Content Authoring, Static Site Generation, Multi-Platform Publishing, Workflow Reliability, Article Updates)
- 6 non-functional requirement categories (Performance, Reliability, Security, Maintainability, Portability, Scalability)

**Technical approach:**
- Docker Compose for local development
- Jekyll/Hugo/11ty with default theme (no customization for MVP)
- GitHub Actions for CI/CD
- Multi-platform APIs: Dev.to (REST), Medium (REST with limitations), Hashnode (GraphQL)

**Success metrics:**
- 100% publish success rate
- <5 minute publish time
- Zero manual intervention
- 10 articles in sustainable <8 hour/week pace

---

## Next Steps

1. **Epic & Story Breakdown** (Required) - Run: `/bmad:bmm:workflows:create-epics-and-stories`
2. **Architecture** (Recommended) - Run: `/bmad:bmm:workflows:create-architecture`
3. **UX Design** (Deferred) - Skipping for MVP, using default theme

---

_This PRD captures the essence of Personal Technical Blog Platform - the moment you commit an article and watch automation work flawlessly, proving sustainable knowledge transfer at scale._

_Created through collaborative discovery between James Crowley and AI Product Manager using BMAD-METHOD._
