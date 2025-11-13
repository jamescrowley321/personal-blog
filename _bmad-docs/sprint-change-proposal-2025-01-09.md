# Sprint Change Proposal: Jekyll to Docusaurus Technology Pivot

**Date:** 2025-01-09
**Author:** James Crowley
**Change Scope:** Moderate - Story and documentation updates
**Status:** Approved

---

## Section 1: Issue Summary

### Problem Statement

Story 1.1 (Initialize Project with Starter Template and Docker Compose) was successfully completed using **Docusaurus 3.9.2** instead of the originally planned **Jekyll 3.9.3**. This strategic pivot was made during implementation for sound technical reasons and documented in architecture.md (ADR-001).

However, the remaining project artifacts still reference Jekyll:
- Epic 1 stories (1-2 through 1-5) describe Jekyll-specific features
- Epic 2 stories reference Jekyll build processes
- tech-spec-epic-1.md contains Jekyll implementation details
- sprint-status.yaml story keys reference Jekyll features

### Context and Discovery

**When Discovered:** During Story 1.1 implementation on 2025-01-08

**How Discovered:** User explicitly chose Docusaurus over Jekyll after reviewing options:
> "I want this to be modern and can take today to pivot."

**Decision Documentation:** Architecture updated with ADR-001 documenting the Jekyll → Docusaurus pivot with full rationale.

### Evidence

1. **Architecture ADR-001** (`_bmad-docs/architecture.md`):
   - Documents strategic decision to use Docusaurus
   - Rationale: Modern DX, React/Node.js ecosystem, MDX support, TypeScript

2. **Story 1.1 Implementation**:
   - Uses Docusaurus 3.9.2, React 19, TypeScript 5.6
   - Docker Compose configured with Node.js 20-alpine (not Jekyll image)
   - package.json created (not Gemfile)
   - docusaurus.config.ts created (not _config.yml)

3. **Current Backlog Conflicts**:
   - Story 1-2: "configure-jekyll-with-default-minima-theme" (Minima is Jekyll theme)
   - Story 2-1: "set-up-github-actions-workflow" (references Jekyll build)
   - tech-spec-epic-1.md: Contains Ruby/Jekyll implementation specs

---

## Section 2: Impact Analysis

### Epic Impact

**Epic 1: Foundation & Local Development** ⚠️ HIGH IMPACT
- **Status:** Story 1.1 complete with Docusaurus, stories 1-2 through 1-5 need rewrite
- **Changes Required:** 4 stories need significant rewrites
- **Goal Preserved:** Yes - "establish local development with live preview" still valid
- **Impact:** Story descriptions, acceptance criteria, and technical approaches need updates

**Epic 2: GitHub Pages Deployment Pipeline** ⚠️ MEDIUM IMPACT
- **Status:** Stories 2-1 and 2-2 need updates for Docusaurus build process
- **Changes Required:** 2 stories need technology substitution (Jekyll → Docusaurus)
- **Goal Preserved:** Yes - automated deployment to GitHub Pages unchanged
- **Impact:** Build commands and setup actions change, but workflow structure identical

**Epic 3: Multi-Platform Syndication** ✅ LOW IMPACT
- **Status:** Minimal impact - only directory path change needed
- **Changes Required:** Story 3-1 change detection: `_posts/` → `blog/`
- **Goal Preserved:** Yes - platform adapters work with markdown regardless of source
- **Impact:** One path reference update

**Epic 4: Production Validation & Sustainability** ✅ NO IMPACT
- **Status:** Completely technology-agnostic
- **Changes Required:** None
- **Goal Preserved:** Yes - content production and publishing validation unchanged
- **Impact:** Zero

### Artifact Conflicts and Required Updates

**HIGH PRIORITY:**
1. **epics.md** - Rewrite Epic 1 stories 1-2 through 1-5 with Docusaurus equivalents
2. **epics.md** - Update Epic 2 stories 2-1 and 2-2 for Docusaurus builds
3. **tech-spec-epic-1.md** - Complete rewrite for Docusaurus implementation details
4. **sprint-status.yaml** - Update story keys if story names change significantly

**LOW PRIORITY:**
5. **PRD.md** - Minor update: line 45 mentions "Jekyll/Hugo/11ty" - add note about Docusaurus choice

**ALREADY COMPLETE:**
- ✅ **architecture.md** - Already updated with ADR-001 documenting pivot

### Technical Impact

**Infrastructure:**
- Docker Compose: Already updated (Node.js 20-alpine)
- Dependencies: package.json vs Gemfile (already correct)
- Build output: `build/` vs `_site/` (already correct)

**Code/Configuration:**
- Existing files correct: docker-compose.yml, package.json, docusaurus.config.ts
- No rollback or rework needed

**Deployment:**
- GitHub Actions will use `npm run build` instead of `jekyll build`
- GitHub Pages deployment mechanism identical

---

## Section 3: Recommended Approach

### Selected Path: Direct Adjustment (Option 1)

**Decision:** Modify existing stories in epics.md and tech-spec to reflect Docusaurus implementation.

### Rationale

**Why Direct Adjustment:**
1. **Sound Technical Decision:** Docusaurus pivot was well-reasoned and documented
   - Modern React/TypeScript stack
   - Superior DX and hot reload
   - MDX support for interactive components
   - Active development and Meta backing

2. **MVP Goals Unchanged:** All PRD success criteria still achievable
   - Automated multi-platform publishing: ✅ Yes
   - <5 minute publish time: ✅ Yes
   - Git-native workflow: ✅ Yes
   - Canonical URLs: ✅ Yes

3. **Low Risk:** Technology substitution, not fundamental redesign
   - Clear 1:1 story mappings
   - No new epics or major scope changes
   - Implementation patterns well-understood

4. **Preserves Momentum:** No rollback waste
   - Story 1.1 complete and working
   - Architecture already aligned
   - Moving forward, not backward

**Why NOT Rollback (Option 2):**
- Reverses documented strategic decision
- Wastes completed Docusaurus work
- Loses modern tech stack benefits
- Medium-high effort with no technical benefit

**Why NOT MVP Review (Option 3):**
- MVP scope unaffected
- All goals achievable with Docusaurus
- No need to reduce scope or defer features

### Effort Estimate

**Story Rewrites:**
- Epic 1: 4 stories × 30 min = 2 hours
- Epic 2: 2 stories × 20 min = 40 min
- Epic 3: 1 story × 10 min = 10 min
- **Total Story Updates: ~3 hours**

**Documentation:**
- tech-spec-epic-1.md rewrite: 2-3 hours
- PRD.md minor update: 5 min
- **Total Documentation: ~3 hours**

**Grand Total: 6 hours of planning updates**

### Risk Assessment

**Risk Level: LOW**

**Risks:**
- ❌ None identified - straightforward documentation update
- ✅ No technical risk - Docusaurus proven working
- ✅ No timeline risk - effort contained within planning phase
- ✅ No scope risk - MVP unchanged

---

## Section 4: Detailed Change Proposals

### Epic 1 Story Updates

#### Story 1-2: Configure Theme and Branding

**OLD:**
```
Story 1.2: Configure Docker Compose for Local Development

As a developer,
I want Docker Compose to run Jekyll locally with live reload,
So that I can preview articles without installing Ruby/Jekyll natively.
```

**NEW:**
```
Story 1.2: Configure Docusaurus Theme and Site Branding

As a developer,
I want to customize the Docusaurus theme with proper branding and navigation,
So that the blog reflects my professional identity and provides clear site structure.
```

**Justification:** Docker Compose already configured in Story 1.1. Next logical step is theme customization (navbar, footer, colors, branding).

---

#### Story 1-3: Create Blog Post Template

**OLD:**
```
Story 1.3: Create Sample Article with Front Matter Template

As a developer,
I want a sample article demonstrating proper front matter format,
So that I have a template for future articles and can validate the setup works.
```

**NEW:**
```
Story 1.3: Create Blog Post Template with MDX and Front Matter

As a developer,
I want to create a sample blog post demonstrating MDX features and front matter,
So that I have a template for future articles with proper metadata and interactive components.
```

**Justification:** Same goal (template article) but emphasizes MDX capabilities unique to Docusaurus. Front matter structure aligns with Docusaurus conventions.

---

#### Story 1-4: Configure Blog Features

**OLD:**
```
Story 1.4: Implement Draft Management Workflow

As a developer,
I want to write articles in `_drafts/` that don't trigger publishing,
So that I can work on content privately before making it live.
```

**NEW:**
```
Story 1.4: Configure Blog Features and Draft Workflow

As a developer,
I want to configure blog features (reading time, RSS feed, pagination) and draft workflow,
So that I can manage unpublished content and provide reader-friendly blog features.
```

**Justification:** Docusaurus uses `draft: true` front matter (not `_drafts/` folder). Broader story covers essential blog plugin configuration (RSS, reading time, pagination).

---

#### Story 1-5: Validate Environment (Minor Update)

**OLD:**
```
Story 1.5: Validate Local Environment End-to-End

As a developer,
I want to verify the complete local workflow functions correctly,
So that I'm confident the foundation is solid before adding deployment.
```

**NEW:**
```
Story 1.5: Validate Local Development Environment End-to-End

As a developer,
I want to verify the complete Docusaurus local workflow functions correctly,
So that I'm confident the foundation is solid before adding deployment.
```

**Justification:** Minimal change - adds "Docusaurus" for clarity. Core intent unchanged (E2E validation).

---

### Epic 2 Story Updates

#### Story 2-1: GitHub Actions Build

**OLD:**
```
Story 2.1: Create GitHub Actions Workflow for Jekyll Build

As a developer,
I want GitHub Actions to automatically build Jekyll when I push to main,
So that deployment is automated without manual intervention.
```

**NEW:**
```
Story 2.1: Create GitHub Actions Workflow for Docusaurus Build

As a developer,
I want GitHub Actions to automatically build Docusaurus when I push to main,
So that deployment is automated without manual intervention.
```

**Justification:** Simple technology substitution. Build uses `npm run build` instead of `jekyll build`. Same automation goal.

**Technical Changes:**
- Setup action: `actions/setup-node@v4` (not `ruby/setup-ruby@v1`)
- Dependencies: `npm ci` (not `bundle install`)
- Build command: `npm run build` (not `jekyll build`)
- Output directory: `build/` (not `_site/`)

---

#### Story 2-2: GitHub Pages Deployment

**OLD:**
```
Story 2.2: Implement Jekyll Build Automation in CI/CD

As a developer,
I want the built Jekyll site automatically deployed to GitHub Pages,
So that articles are live at the canonical URL after build succeeds.
```

**NEW:**
```
Story 2.2: Configure GitHub Pages Deployment for Docusaurus

As a developer,
I want the built Docusaurus site automatically deployed to GitHub Pages,
So that articles are live at the canonical URL after build succeeds.
```

**Justification:** Same deployment mechanism (`actions/deploy-pages@v4`). Only difference is source directory (`build/` vs `_site/`).

---

#### Stories 2-3, 2-4, 2-5: No Changes

**Stories:**
- 2.3: Validate Canonical URLs and SEO
- 2.4: Implement Build Failure Notifications
- 2.5: End-to-End GitHub Pages Publishing Test

**Rationale:** Technology-agnostic validation stories. Test outcomes, not implementation details.

---

### Epic 3 Story Updates

#### Story 3-1: Change Detection (Minimal Update)

**OLD:**
```
Filters for files in `_posts/` directory only
```

**NEW:**
```
Filters for files in `blog/` directory only
```

**Justification:** Blog posts located in `blog/` (Docusaurus) vs `_posts/` (Jekyll). Simple path change.

---

#### Stories 3-2 through 3-6: No Changes

**Rationale:** Platform adapters read markdown files - agnostic to static site generator. No changes needed.

---

### Epic 4: No Changes

**All Stories Unchanged:** Content production is completely tool-agnostic. Writing and publishing workflow identical regardless of underlying technology.

---

## Section 5: Implementation Handoff

### Change Scope Classification

**MODERATE SCOPE** - Requires backlog reorganization and documentation updates

### Handoff Plan

**Primary Responsibility: Product Owner / Scrum Master**

**Tasks:**
1. **Update epics.md** with approved story changes
   - Rewrite Epic 1 stories 1-2 through 1-5
   - Update Epic 2 stories 2-1 and 2-2
   - Update Epic 3 story 3-1 path reference

2. **Update tech-spec-epic-1.md** with Docusaurus implementation details
   - Replace Jekyll commands with Docusaurus equivalents
   - Update directory structure references
   - Revise acceptance criteria for Docusaurus features

3. **Update sprint-status.yaml** story keys if story titles changed significantly
   - Maintain story key format: `{epic}-{story}-{slug}`
   - Update any Jekyll-specific slugs

4. **Update PRD.md** line 45 reference to static site generators

5. **Verify consistency** across all updated documents

**Secondary Review: Solution Architect**
- Validate tech-spec technical accuracy
- Ensure architecture.md and tech-spec alignment

### Success Criteria

**Implementation Complete When:**
- ✅ All Epic 1 stories (1-2 through 1-5) rewritten for Docusaurus
- ✅ Epic 2 stories (2-1, 2-2) updated for Docusaurus builds
- ✅ Epic 3 story 3-1 directory path corrected
- ✅ tech-spec-epic-1.md rewritten with Docusaurus details
- ✅ sprint-status.yaml story keys aligned with new story names
- ✅ PRD.md static site generator reference updated
- ✅ All documents reviewed for Jekyll references (none remaining)
- ✅ Next story (1-2) can be drafted from updated epics without confusion

### Timeline

**Estimated Effort:** 6 hours (as detailed in Section 3)

**Proposed Completion:** Immediate - complete during this session if possible

**Blocker Check:** None - all information available to complete updates now

---

## Approval and Next Steps

**Proposal Status:** ✅ APPROVED (User confirmed incrementally during workflow)

**Next Actions:**
1. Implement story changes in epics.md
2. Rewrite tech-spec-epic-1.md
3. Update sprint-status.yaml
4. Minor PRD.md update
5. Resume create-story workflow to draft Story 1-2

**Post-Implementation:**
- Verify Story 1-2 can be drafted cleanly from updated epics
- Continue normal sprint execution with Docusaurus stories

---

**Generated by:** BMAD Method - correct-course workflow
**Workflow Version:** 4.0
**Date:** 2025-01-09
