# weav 🪡

weav is a smart scheduling app that seamlessly syncs availability and integrates individual preferences to suggest events and outings. By weaving together schedules and preferences, friends and family can coordinate their time together effectively. (modified from https://github.com/shiumash/weav)

## Features

### 👥 Social Features
- Connect with friends and manage your social circle
- User discovery and friend management system
- Personalized dashboard experience

### 📅 Event Discovery
- Browse and discover local events with Eventbrite-style interface
- Advanced search and filtering by category, price, and keywords
- Interactive event cards with images, descriptions, and attendance info
- Categories include networking, food & drinks, fitness, art, education, and music
- Like and share events with friends

### 🔐 Authentication & User Management
- Secure user authentication 
- User profiles with personal information and food preferences

## Technical Stack

### Frontend
- **Framework**: Next.js 14 w/ App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system

### Backend & Services
- **Authentication**: Clerk (user management and auth)
- **Database**: Prisma ORM with PostgreSQL
- **API**: REST API endpoints built with Next.js API routes
- **Deployment**: Vercel with automatic deployments

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint with TypeScript rules
- **Type Checking**: TypeScript strict mode
- **Build System**: Next.js with SWC compiler

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm package manager
- PostgreSQL database

### Local Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weav
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Clerk, database, and other service credentials.

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Navigate to `http://localhost:3000`**

## License

[MIT](https://choosealicense.com/licenses/mit/)
