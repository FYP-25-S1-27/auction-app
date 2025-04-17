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


5. For database schema changes/migrations, please use:
```bash
npm run -w web db:generate # to generate sql files (apps/web/drizzle_output)

npm run -w web db:migrate # to migrate schema using above sql files
```

1. To use or edit the files under the bruno/ folder, you can download https://www.usebruno.com/downloads (it can also be used to test our APIs)


### Contribution workflow
```bash
# Create a new branch
git checkout -b my-branch

# Fetch the latest changes from the main branch
git fetch origin

# Rebase your branch on top of the main branch
git rebase origin/main

# Push your rebased branch to update the remote branch
git push --set-upstream origin my-branch

# Then go to GitHub and create a pull request before merging it (all to be done on the website)
```


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
