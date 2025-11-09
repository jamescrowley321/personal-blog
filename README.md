# Personal Technical Blog

A Git-native technical blogging platform with automated multi-platform syndication.

## Overview

This platform enables:
- Writing articles once in markdown
- Local preview with live reload via Docker Compose
- Automated publishing to GitHub Pages, Dev.to, Medium, and Hashnode
- Zero manual cross-posting

## Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (macOS/Windows) or Docker Engine (Linux)
- [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop)
- Git

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/personal-blog.git
   cd personal-blog
   ```

2. **Start the local development server:**
   ```bash
   docker-compose up
   ```

   The first run will take a few minutes to download the Docker image and install dependencies.

3. **Access your blog:**
   - Blog preview: http://localhost:4000
   - LiveReload automatically refreshes your browser when files change

4. **Stop the server:**
   ```bash
   # Press Ctrl+C in the terminal
   # Or in another terminal:
   docker-compose down
   ```

## Writing Articles

### Draft Workflow

1. **Create a draft:**
   ```bash
   # Drafts don't need a date prefix
   touch _drafts/my-article-idea.md
   ```

2. **Add front matter and content:**
   ```markdown
   ---
   title: "My Article Title"
   tags: [python, automation, blogging]
   description: "A brief description for SEO"
   ---

   # Article Content

   Your markdown content here...
   ```

3. **Preview your draft:**
   - Drafts are visible at http://localhost:4000 when running `docker-compose up`
   - Edit and save to see live updates

4. **Publish when ready:**
   ```bash
   # Move to _posts/ with date prefix
   mv _drafts/my-article-idea.md _posts/2025-01-08-my-article-idea.md
   ```

5. **Add canonical URL:**
   ```yaml
   ---
   title: "My Article Title"
   date: 2025-01-08
   tags: [python, automation, blogging]
   description: "A brief description for SEO"
   canonical_url: "https://yourusername.github.io/personal-blog/my-article-idea"
   ---
   ```

6. **Commit and push:**
   ```bash
   git add _posts/2025-01-08-my-article-idea.md
   git commit -m "Add article: My Article Title"
   git push origin main
   ```

## Project Structure

```
personal-blog/
├── _posts/              # Published articles
├── _drafts/             # Unpublished drafts
├── assets/
│   └── images/          # Article images
├── _site/               # Build output (gitignored)
├── _config.yml          # Jekyll configuration
├── docker-compose.yml   # Local development environment
├── Gemfile              # Ruby dependencies
└── README.md
```

## Technology Stack

- **Static Site Generator:** Jekyll 3.9.3 (GitHub Pages compatible)
- **Theme:** Minima (default)
- **Local Development:** Docker Compose with `jekyll/jekyll:3.9` image
- **Deployment:** GitHub Pages (automated)
- **Syndication:** Dev.to, Medium, Hashnode APIs (planned)

## Troubleshooting

### Port Conflicts

If ports 4000 or 35729 are already in use:

1. Edit `docker-compose.yml`
2. Change port mappings:
   ```yaml
   ports:
     - "4001:4000"      # Change first number only
     - "35730:35729"    # Change first number only
   ```
3. Access blog at http://localhost:4001

### Docker Not Found

1. Install Docker Desktop:
   - macOS: https://docs.docker.com/desktop/install/mac-install/
   - Windows: https://docs.docker.com/desktop/install/windows-install/
   - Linux: https://docs.docker.com/engine/install/

2. Verify installation:
   ```bash
   docker --version
   docker-compose --version
   ```

### Slow Startup

First run is slower due to image download and gem installation. Subsequent runs should start in <30 seconds.

### File Changes Not Detected (Windows)

Enable file sharing in Docker Desktop settings:
1. Settings → Resources → File Sharing
2. Add project directory
3. Restart Docker Desktop

## Development Workflow

**Local development:**
```bash
# Start server (drafts visible)
docker-compose up

# Edit files - changes auto-refresh browser
# Ctrl+C to stop
```

**Publishing:**
```bash
# Move draft to _posts/ with date
mv _drafts/article.md _posts/2025-01-08-article.md

# Commit and push
git add _posts/2025-01-08-article.md
git commit -m "Publish: Article Title"
git push origin main
```

## License

MIT

## Author

James Crowley

---

Built with [BMAD-METHOD](https://github.com/bmad-method/bmad) - AI-assisted product development methodology.
