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

3. Start server
```bash
# for development:
npm run dev
# for production:
npm run build
npm start
```

4. View Database Tables
- You can use DBeaver to view and manage your local database tables.
- [Download DBeaver](https://dbeaver.io/download/) and follow the installation instructions.


5. For database schema changes/migrations, please use:
```bash
# to push the database schema
npm run -w web db:push
# to seed data
npm run -w web db:seed # this will reset+seed the db as well as create the test users on auth0/reset their password
npm run -w web db:seed:skip-users # use this if you only need to reset+seed the db (it will still fetch the users from auth0 but will not create/reset their info)
```

#### Optional
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
