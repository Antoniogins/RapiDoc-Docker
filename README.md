# API Documentation Portal

A modern web application for managing and viewing API documentation in YAML format using RapiDoc.

## Features

- 📚 View API documentation in a clean, modern interface
- 📁 File management system for YAML specifications
- 🌓 Dark/Light theme support
- 📥 Upload YAML files via drag-and-drop or file selection
- 📋 Copy file paths with one click
- 📝 Edit and update existing specifications
- 🔄 Duplicate existing specifications
- ⬇️ Download specifications
- 🗑️ Delete specifications

## Technology Stack

- Frontend:
  - HTML5/CSS3
  - JavaScript (ES6+)
  - Bootstrap 5
  - RapiDoc (OpenAPI/Swagger viewer)
  - Bootstrap Icons

- Backend:
  - Node.js
  - Express.js
  - SQLite3 (via better-sqlite3)
  - Multer (file uploads)

- Infrastructure:
  - Docker
  - Nginx
  - Alpine Linux

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git
- Internet?

### Installation

1. Clone the repository: via `git clone https://github.com/Antoniogins/RapiDoc-Docker.git` or manually downloading on `https://github.com/Antoniogins/RapiDoc-Docker`.
2. Open a terminal.
3. Execute: ```docker compose up --build```

| If your docker installation does not support the plugin `compose`, install `docker-compose`.

The application will be available at:
- Web Interface: http://localhost:8080
- API Endpoint: http://localhost:3000

## Usage Guide

### File Manager

1. **Access File Manager**
   - Click the "File Manager" button in the top-right corner

2. **Upload New API Specification**
   - Click "Create New"
   - Either drag & drop a YAML file or click "Browse"
   - Fill in the name and description
   - Click "Save"

3. **Manage Existing Specifications**
   - **Open**: Click the blue "Open" button to view the documentation
   - **Edit**: Click the pencil icon to modify details
   - **Duplicate**: Click the files icon to create a copy
   - **Copy Path**: Click the clipboard icon to copy the file path
   - **Download**: Click the download icon to get the YAML file
   - **Delete**: Click the trash icon to remove the specification

### Theme Switching

- Click the sun/moon icon in the header to toggle between light and dark themes
- Your preference is automatically saved

### Working with API Documentation

1. **Viewing Documentation**
   - Open a specification from the File Manager
   - Navigate through endpoints using the left sidebar
   - Expand/collapse sections by clicking on tags

2. **Downloading Documentation**
   - Use the "Download Current" button in File Manager to download the currently viewed specification
   - Or use the download icon next to any specification in the list

## Project structure
```
src/
├── app/ # Frontend application
│ ├── css/ # Stylesheets
│ ├── html/ # HTML templates
│ └── js/ # JavaScript files
└── server/ # Backend application
├── config/ # Configuration files
├── controllers/ # Request handlers
├── routes/ # API routes
└── services/ # Business logic
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/specs` | List all specifications |
| GET | `/api/specs/:id` | Get specification details |
| POST | `/api/specs` | Create new specification |
| PUT | `/api/specs/:id` | Update specification |
| DELETE | `/api/specs/:id` | Delete specification |
| GET | `/api/file/raw/:filename` | Get raw YAML content |

## Docker Configuration

The application uses a single container that includes:
- Nginx (port 80) - Serves frontend and proxies API requests
- Node.js (port 3000) - Handles API requests
- SQLite database - Stores specifications and metadata

### Volumes
- `sqlite_data`: Persists the SQLite database
- Source code mounts for development

## Troubleshooting

1. **File Upload Issues**
   - Ensure file is in YAML format (.yaml or .yml)
   - Check file permissions in upload directory

2. **Database Issues**
   - Check if sqlite_data volume is properly mounted
   - Verify write permissions for Node.js process

3. **Display Issues**
   - Clear browser cache
   - Check console for JavaScript errors
   - Verify CDN resources are accessible

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License