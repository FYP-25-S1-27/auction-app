# Auction App

A web-based auction platform application.

## Getting Started (Development)

### Prerequisites
- Node.js (v22 or higher)
- npm

**NOTE**: This is a monorepo (npm workspaces), please be mindful when adding dependencies.
### Installation
1. Install dependencies
```bash
npm install
```

2. Set up environment variables
```bash
cp .env.example .env
# Edit .env file with your configuration
```

3. Start development server
```bash
npm run dev
```

4. View Database Tables
- You can use DBeaver to view and manage your local database tables.
- [Download DBeaver](https://dbeaver.io/download/) and follow the installation instructions.


### Need a local PostgreSQL instance?
1. Install Docker Desktop
	- [Download Docker Desktop](https://www.docker.com/products/docker-desktop) and follow the installation instructions for your operating system.

2. Start PostgreSQL using Docker Compose
	- Ensure Docker Desktop is running.
	- Navigate to the project root directory and run:
	```bash
	docker-compose up -d db
	```
	This will start a local PostgreSQL instance as defined in the `docker-compose.yml` file.
