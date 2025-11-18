# 🎨 Zeyryth'Studio

Tips and tutorials for sculpting and drawing - Color collector, textures gallery, and artist community.

## ✨ Features

- 🎨 **Color Collector** - Extract colors from images with interactive magnifying glass
- 🖼️ **Texture Gallery** - 14+ AI-generated textures (marble, wood, skin, gradients, shading)
- 🎭 **Color Palettes** - Create, save and share color palettes with the community
- 💬 **Community Chat** - Real-time chat to share colors and textures with other artists
- 👤 **User Profiles** - Display tags, favorite palettes and edit avatars
- 🏷️ **Artist Tags** - Admin panel to manage and assign artistic tags (Artist, Sculptor, Illustrator, etc)
- 🌍 **Bilingual** - Portuguese (PT-BR) and English (EN)
- 🌓 **Dark/Light Mode** - Full theme support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
zeyryth-studio/
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   ├── contexts/   # React contexts (Theme, Language)
│   │   └── lib/        # Utilities and tRPC client
│   └── public/         # Static assets and textures
├── server/             # Express backend
│   ├── _core/         # Core infrastructure
│   ├── db.ts          # Database queries
│   ├── routers.ts     # tRPC procedures
│   └── storage.ts     # S3 storage helpers
├── drizzle/           # Database schema and migrations
├── shared/            # Shared types and constants
└── package.json
```

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- **Backend**: Express 4 + tRPC 11
- **Database**: MySQL/TiDB + Drizzle ORM
- **Auth**: Manus OAuth
- **Deployment**: Vercel (recommended)

## 📚 Available Scripts

```bash
# Development
pnpm dev              # Start dev server

# Database
pnpm db:push         # Push schema changes to database
pnpm db:studio       # Open Drizzle Studio

# Build
pnpm build           # Build for production
pnpm preview         # Preview production build

# Linting
pnpm lint            # Run ESLint
```

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions on deploying to:
- Vercel (recommended - free tier available)
- Railway
- Render

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - How to deploy to production
- [GitHub Setup Guide](./GITHUB_SETUP_GUIDE.md) - How to set up the GitHub repository
- [TODO List](./todo.md) - Feature checklist and progress

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 👤 Admin Account

Default admin account is configured for: `caiokcoalhlb@gmail.com`

Only admins can:
- Create and manage artist tags
- Assign tags to users
- Remove tags from users

## 🎯 Roadmap

- [ ] Real-time notifications
- [ ] Public artist profiles
- [ ] Favorite system for palettes and colors
- [ ] Advanced search and filters
- [ ] Mobile app
- [ ] API documentation

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ by the Zeyryth'Studio team
