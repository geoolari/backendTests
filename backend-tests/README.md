# Playwright API Testing Project

This project contains API tests using Playwright and TypeScript for testing multiple REST API endpoints.

## Recommended VS Code Extensions

For the best development experience, install these VS Code extensions:

- **[Playwright Test for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)**: Provides integrated test running, debugging, and reporting directly in VS Code
- **[GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)**: AI-powered code completion and assistance for writing tests

### **Installation:**

You can install these extensions by:

1. Opening VS Code
2. Going to Extensions (Ctrl+Shift+X)
3. Searching for each extension by name or ID
4. Clicking "Install"9

## Prerequisites

- **Node.js** (version 18 or higher): Required to run npm commands and execute the tests
- **npm**: Comes bundled with Node.js for package management
- **TypeScript**: Already included as a dev dependency

## Project Structure

```
backend-tests/
├── .github/             # GitHub workflows and configuration
├── tests-api/           # API test files
├── helpers/             # Shared helper functions and utilities
├── test-results/        # Test execution results
├── playwright-report/   # Generated HTML reports
├── playwright.config.ts # Playwright configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## APIs Under Test

The test suite covers multiple APIs:

### **Albums Collection Service:**

- Base URL: `https://albums-collection-service.herokuapp.com`
- Endpoints: CRUD operations for album management
- Test file: `tests-api/albums.spec.ts`

### **JSONPlaceholder API:**

- Base URL: `https://jsonplaceholder.typicode.com`
- Endpoints: Users and Posts operations
- Test file: `tests-api/jsonplaceholder.spec.ts`

## Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

   _(Replace `<repository-url>` with the actual URL of your repository and `<project-directory>` with the name of your cloned project folder)_

2. **Install dependencies:**
   This command installs Playwright (v1.53.0) and other project dependencies listed in `package.json`.

   ```bash
   npm install
   ```

> **Note**: Since this project only contains API tests using Playwright's request context, browser installation is not required.

## Running Tests

**Run all tests:**

Using npm script:

```bash
npm test
```

Or directly with Playwright:

```bash
npx playwright test tests-api
```

### **Additional Test Options:**

**Run tests in a specific file:**

```bash
npx playwright test tests-api/albums.spec.ts
```

**Run tests matching a pattern:**

```bash
npx playwright test -g "Create album"
```

**Run tests with verbose output:**

```bash
npx playwright test --reporter=list
```

## Viewing Test Reports

**View detailed HTML report:**

Using npm script (if you want to add this to package.json):

```bash
npm run report
```

Or directly with Playwright:

```bash
npx playwright show-report
```

This command opens the last generated Playwright report in your web browser, allowing you to inspect test results and API response details.

## Configuration

The project uses `playwright.config.ts` for configuration, which includes:

- **Test directory**: `./tests-api`
- **Single worker**: `workers: 1` - Ensures tests run sequentially to avoid API rate limiting and data conflicts
- **HTML reporter**: Generates detailed test reports
- **Retries**: 0 retries for faster feedback during local development
