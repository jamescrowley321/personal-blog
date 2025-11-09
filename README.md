# Personal Technical Blog

A Git-native technical blogging platform with automated multi-platform syndication, built with Docusaurus.

## Overview

This platform enables:
- Writing articles once in markdown (MDX)
- Local preview with hot reload via Docker Compose
- Modern React-based site with Docusaurus
- Automated publishing to GitHub Pages, Dev.to, Medium, and Hashnode
- Zero manual cross-posting

## Technology Stack

- **Docusaurus 3.9+** - Modern React-based static site generator
- **TypeScript** - Type safety for configuration and scripts
- **Node.js 20+** - Runtime for site generation and automation
- **Docker Compose** - Cross-platform local development
- **GitHub Actions** - CI/CD for deployment and syndication

## Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (macOS/Windows) or Docker Engine (Linux)
- [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop)
- Git

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jamescrowley321/personal-blog.git
   cd personal-blog
   ```

2. **Start the local development server:**
   ```bash
   docker-compose up
   ```

   The first run will take a few minutes to download the Docker image and install dependencies.

3. **Access your blog:**
   - Blog preview: http://localhost:3001
   - Hot reload automatically refreshes your browser when files change

4. **Stop the server:**
   ```bash
   # Press Ctrl+C in the terminal
   # Or in another terminal:
   docker-compose down
   ```

## Writing Articles

### Create a New Blog Post

1. **Create a file in the `blog/` directory:**
   ```bash
   # Format: YYYY-MM-DD-title.md
   touch blog/2025-01-09-my-article.md
   ```

2. **Add front matter and content:**
   ```markdown
   ---
   title: "My Article Title"
   authors: [james]
   tags: [python, automation, blogging]
   description: "A brief description for SEO"
   ---

   # Article Content

   Your markdown content here with **MDX** support!

   You can even embed React components:

   ```jsx
   <CustomComponent />
   ```
   ```

3. **Preview your post:**
   - Posts are visible at http://localhost:3001/blog
   - Edit and save to see live updates

4. **Publish when ready:**
   ```bash
   git add blog/2025-01-09-my-article.md
   git commit -m "Add article: My Article Title"
   git push origin main
   ```

## Project Structure

```
personal-blog/
├── blog/                    # Blog posts (markdown/MDX)
│   └── 2025-01-09-article.md
├── docs/                    # Documentation pages (optional)
│   └── intro.md
├── src/
│   ├── components/          # React components
│   ├── css/                 # Custom styles
│   └── pages/               # Custom pages
├── static/
│   └── img/                 # Static assets and images
├── build/                   # Build output (gitignored)
├── node_modules/            # Node dependencies (gitignored)
├── docker-compose.yml       # Local development environment
├── docusaurus.config.ts     # Docusaurus configuration
├── package.json             # Node dependencies and scripts
└── README.md
```

## Development Workflow

**Local development:**
```bash
# Start server (hot reload enabled)
docker-compose up

# Edit files in blog/ or src/
# Changes auto-refresh browser

# Ctrl+C to stop
```

**Publishing:**
```bash
# Add your article
git add blog/2025-01-09-article.md

# Commit and push
git commit -m "Publish: Article Title"
git push origin main

# GitHub Actions automatically:
# 1. Builds Docusaurus site
# 2. Deploys to GitHub Pages
# 3. Syndicates to Dev.to/Medium/Hashnode (coming soon)
```

## Docusaurus Scripts

If you prefer to run without Docker:

```bash
npm install        # Install dependencies
npm start          # Start dev server on port 3000
npm run build      # Build for production
npm run serve      # Serve built site locally
npm run deploy     # Deploy to GitHub Pages
```

## Troubleshooting

### Port Conflicts

If port 3001 is already in use:

1. Edit `docker-compose.yml`
2. Change port mapping:
   ```yaml
   ports:
     - "3002:3000"  # Change first number only
   ```
3. Access blog at http://localhost:3002

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

First run is slower due to image download and npm install. Subsequent runs should start in <30 seconds.

### File Changes Not Detected (Windows)

Enable file sharing in Docker Desktop settings:
1. Settings → Resources → File Sharing
2. Add project directory
3. Restart Docker Desktop

## License

MIT

## Author

James Crowley

---

Built with [BMAD-METHOD](https://github.com/bmad-method/bmad) - AI-assisted product development methodology.
Powered by [Docusaurus](https://docusaurus.io/) - Modern static site generator.
