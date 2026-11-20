# Document Library

A lightweight document management application with a vanilla JavaScript frontend and a .NET 8 Web API backend. The library displays sample business documents with name search and category filtering; document data is owned and served by the backend.
 
## Architecture 

- **Frontend:** Node.js and Express serve static HTML, CSS, and vanilla JavaScript from `frontend/public`.
- **Backend:** ASP.NET Core Web API serves document and category data from an in-memory repository.
- **Communication:** The browser uses `fetch()` to call the backend. The frontend server injects the API base URL from `DOCUMENT_API_BASE_URL`, defaulting to `http://localhost:5000/api/documents`.

```text
.
├── frontend/
│   ├── public/                 # Browser application
│   ├── test/                   # Frontend checks
│   ├── package.json
│   └── server.js               # Static-file server and API URL configuration
├── backend/
│   ├── DocumentApi/            # ASP.NET Core API
│   ├── DocumentApi.Tests/      # Focused SemVer controller tests
│   └── DocumentApi.sln
├── .github/workflows/          # CI build and validation
└── README.md
```

## Prerequisites   

- Node.js 20 or later and npm
- .NET 8 SDK

## Run locally

Start the backend in one terminal:

```sh
dotnet run --project backend/DocumentApi/DocumentApi.csproj
```

The backend listens at `http://localhost:5000` when started with its included development launch profile.

In another terminal, install and start the frontend:

```sh
cd frontend
npm ci
npm start
```

Open [http://localhost:3000](http://localhost:3000). To use a different backend URL or frontend port, set `DOCUMENT_API_BASE_URL` or `PORT` before starting the frontend. In PowerShell, for example:

```powershell
$env:DOCUMENT_API_BASE_URL = "http://localhost:5000/api/documents"
npm start
```

## API

| Method | Endpoint | Response |
| --- | --- | --- |
| `GET` | `/api/documents` | All documents as a JSON array |
| `GET` | `/api/documents/{id}` | A document, or `404 Not Found` |
| `GET` | `/api/documents/categories` | Distinct category names |
| `GET` | `/api/semver/validate?version=1.2.3-beta.1+build.7` | Validates and parses a semantic version |

The sample repository contains documents across Finance, Human Resources, Operations, Technology, and Legal. No database or authentication is configured.

## Checks

Run the frontend checks:

```sh
cd frontend
npm ci
npm run build
npm test
```

Restore and build the backend:

```sh
dotnet restore backend/DocumentApi.sln
dotnet build backend/DocumentApi.sln --configuration Release --no-restore
```

The GitHub Actions workflow runs the frontend checks and builds the backend separately; it does not deploy or publish packages.

## NuGet semantic version policy

The `DocumentApi` package uses the following repository policy:

- Major: the target .NET major version (`8` for `net8.0`, `10` for `net10.0`, and so on).
- Minor: increments only for a pull request labeled `breaking-change`.
- Build: starts at `0` and increments for approved non-breaking package revisions.
- Prerelease: `prerelease-##`, starting at `prerelease-01`, is created only when the approved PR's latest commit has a matching Git tag such as `prerelease` or `prerelease.01`.
- Merged pull requests targeting `main` trigger version calculation and package packing. After a successful package build, the workflow creates and pushes a `DocumentApi-v<version>` tag on the merge commit. Re-running a workflow for a commit already tagged skips version calculation and packaging. Unmerged and non-`main` pull requests do not produce package versions.
- The workflow uploads the package as an artifact; it does not create a GitHub Release or publish to NuGet.

Examples for a .NET 8 package are `8.0.0`, `8.0.1`, `8.1.0`, and `8.0.1-prerelease-01`.
