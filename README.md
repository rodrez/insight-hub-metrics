# SitRep Management System

A modern web application for managing Situation Reports (SitReps) and collaborations across different organizational levels.

## Features

- **SitRep Management**: Create, edit, and track situation reports with different status levels (Submitted, Pending Review, Ready)
- **Partner Collaboration**: Manage Fortune 30 and SME partner relationships
- **Project Tracking**: Monitor projects and their associated partners
- **Department Organization**: Organize content by departments and teams
- **Real-time Updates**: Track changes and updates across the organization

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Data Storage**: IndexedDB for local data persistence

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
```

2. Navigate to the project directory:
```sh
cd <PROJECT_NAME>
```

3. Install dependencies:
```sh
npm install
```

4. Start the development server:
```sh
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

- `/src/components/` - React components organized by feature
  - `/sitreps/` - SitRep-related components
  - `/projects/` - Project management components
  - `/ui/` - Reusable UI components
- `/src/lib/` - Core utilities and services
  - `/services/` - Data services and API integrations
  - `/types/` - TypeScript type definitions
  - `/utils/` - Helper functions and utilities

## Development

### Using Lovable

1. Visit [Lovable Project](https://lovable.dev/projects/26db535a-309b-4c46-9cdc-9453068364f3)
2. Start making changes through the interactive interface
3. Changes will be automatically committed to the repository

### Using Local Development

1. Make your changes in your preferred IDE
2. Test locally using `npm run dev`
3. Commit and push changes to reflect them in Lovable

### Using GitHub Codespaces

1. Navigate to the repository on GitHub
2. Click "Code" > "Codespaces"
3. Create a new codespace
4. Make changes directly in the browser-based IDE

## Deployment

### Quick Deploy

1. Open [Lovable](https://lovable.dev/projects/26db535a-309b-4c46-9cdc-9453068364f3)
2. Click Share -> Publish
3. Your application will be deployed instantly

### Custom Domain Setup

While direct custom domain support isn't available through Lovable yet, you can deploy to Netlify:

1. Connect your repository to Netlify
2. Configure your custom domain in Netlify settings
3. Follow [our custom domain guide](https://docs.lovable.dev/tips-tricks/custom-domain/) for detailed instructions

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request
4. Changes will be reflected in Lovable once merged

## License

This project is private and proprietary. All rights reserved.