# Getting Started

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [composer.json](file://composer.json)
- [package.json](file://package.json)
- [config/app.php](file://config/app.php)
- [config/database.php](file://config/database.php)
- [routes/api.php](file://routes/api.php)
- [database/migrations/2026_04_11_134759_create_employees_table.php](file://database/migrations/2026_04_11_134759_create_employees_table.php)
- [app/Http/Controllers/EmployeeController.php](file://app/Http/Controllers/EmployeeController.php)
- [app/Models/Employee.php](file://app/Models/Employee.php)
- [bootstrap/app.php](file://bootstrap/app.php)
- [public/index.php](file://public/index.php)
- [resources/views/welcome.blade.php](file://resources/views/welcome.blade.php)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [API Endpoints](#api-endpoints)
8. [Development Workflow](#development-workflow)
9. [Common Issues and Solutions](#common-issues-and-solutions)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [Conclusion](#conclusion)

## Introduction
This guide helps you set up and run the employees API project locally. It covers prerequisites, installation, environment configuration, database setup, running migrations, and testing the API endpoints. The project is built with Laravel 13 and uses a modern frontend toolchain with Vite.

## Prerequisites
Before installing the project, ensure your system meets the following requirements:

- PHP: Version 8.3 or higher
- Composer: Dependency manager for PHP
- Node.js: Required for frontend asset compilation
- Database: SQLite (default), MySQL, PostgreSQL, SQL Server, or MariaDB

These requirements are defined in the project configuration:
- PHP version requirement is specified in the project metadata.
- Laravel 13 requires PHP 8.3+.
- Node.js is used for asset bundling via Vite.

**Section sources**
- [composer.json:8-12](file://composer.json#L8-L12)
- [composer.json:74-84](file://composer.json#L74-L84)

## Installation
Follow these steps to install and set up the project locally:

1. **Clone the repository**
   - Clone the project to your local machine using your preferred Git client.

2. **Install PHP dependencies**
   - Navigate to the project root and run:
     ```
     composer install
     ```

3. **Create and configure the environment file**
   - Copy the example environment file:
     ```
     copy .env.example .env
     ```
   - Generate the application key:
     ```
     php artisan key:generate
     ```

4. **Install frontend dependencies**
   - Install Node.js dependencies:
     ```
     npm install
     ```

5. **Compile assets**
   - Build the frontend assets:
     ```
     npm run build
     ```

6. **Run database migrations**
   - Apply all pending migrations:
     ```
     php artisan migrate
     ```

7. **Start the development server**
   - Launch the Laravel development server:
     ```
     php artisan serve
     ```

8. **Open the application**
   - Visit http://localhost:8000 in your browser to see the welcome page.

**Section sources**
- [composer.json:34-41](file://composer.json#L34-L41)
- [package.json:5-8](file://package.json#L5-L8)

## Environment Configuration
Configure your local environment by editing the `.env` file. Key settings include:

- Application name and environment
- Debug mode
- Application URL
- Timezone and locale
- Encryption key
- Database connection defaults

Important environment variables:
- `APP_ENV`: Application environment (default: production)
- `APP_DEBUG`: Enable/disable debug mode
- `APP_URL`: Base URL for the application
- `DB_CONNECTION`: Default database driver (default: sqlite)
- `DB_DATABASE`: Path to SQLite database file or name for other databases
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`: Database credentials for MySQL/MariaDB/PostgreSQL/SQL Server

Default database configuration supports multiple drivers. The default is SQLite, which works immediately after running migrations.

**Section sources**
- [config/app.php:16-100](file://config/app.php#L16-L100)
- [config/database.php:20](file://config/database.php#L20)
- [config/database.php:35-45](file://config/database.php#L35-L45)
- [config/database.php:47-85](file://config/database.php#L47-L85)
- [config/database.php:87-100](file://config/database.php#L87-L100)
- [config/database.php:102-115](file://config/database.php#L102-L115)

## Database Setup
The project includes a dedicated employees table migration. By default, the application uses SQLite, but you can switch to MySQL, PostgreSQL, SQL Server, or MariaDB.

Steps to set up the database:

1. **SQLite (default)**
   - No additional setup required. The migration creates the employees table automatically.
   - Ensure the database file exists or let migrations create it.

2. **MySQL/MariaDB**
   - Set the connection driver to mysql or mariadb.
   - Configure host, port, database name, username, and password in the environment file.

3. **PostgreSQL**
   - Set the connection driver to pgsql.
   - Configure host, port, database name, username, and password in the environment file.

4. **SQL Server**
   - Set the connection driver to sqlsrv.
   - Configure host, port, database name, username, and password in the environment file.

After configuring the database connection, run migrations to create the employees table.

**Section sources**
- [database/migrations/2026_04_11_134759_create_employees_table.php:14-23](file://database/migrations/2026_04_11_134759_create_employees_table.php#L14-L23)
- [config/database.php:33-116](file://config/database.php#L33-L116)

## Running the Application
Once installed, you can run the application in development mode:

- Start the Laravel development server:
  ```
  php artisan serve
  ```

- Access the application:
  - Open http://localhost:8000 in your browser.

- Frontend asset pipeline:
  - Use Vite for development:
    ```
    npm run dev
    ```
  - Or build for production:
    ```
    npm run build
    ```

- Queue listener (optional):
  - The development script includes a queue listener for background jobs.

**Section sources**
- [composer.json:42-45](file://composer.json#L42-L45)
- [package.json:5-8](file://package.json#L5-L8)
- [public/index.php:16-21](file://public/index.php#L16-L21)
- [bootstrap/app.php:7-18](file://bootstrap/app.php#L7-L18)

## API Endpoints
The API exposes employee-related endpoints. Routes are defined in the API routes file.

Available endpoints:
- GET /api/employees/search
  - Search employees by name, email, or phone
  - Query parameter: q (required)
- GET /api/employees
  - List all employees
- POST /api/employees
  - Create a new employee
- GET /api/employees/{id}
  - Retrieve a specific employee
- PUT/PATCH /api/employees/{id}
  - Update an existing employee
- DELETE /api/employees/{id}
  - Delete an employee

Validation rules:
- Name: required, string
- Email: required, valid email, unique
- Gender: required, one of male, female, other
- Phone: required, string
- Address: required, string
- Note: optional, string

Search endpoint:
- Requires a query parameter q
- Returns employees matching name, email, or phone

**Section sources**
- [routes/api.php:6-7](file://routes/api.php#L6-L7)
- [app/Http/Controllers/EmployeeController.php:13-16](file://app/Http/Controllers/EmployeeController.php#L13-L16)
- [app/Http/Controllers/EmployeeController.php:21-32](file://app/Http/Controllers/EmployeeController.php#L21-L32)
- [app/Http/Controllers/EmployeeController.php:34-41](file://app/Http/Controllers/EmployeeController.php#L34-L41)
- [app/Http/Controllers/EmployeeController.php:46-63](file://app/Http/Controllers/EmployeeController.php#L46-L63)
- [app/Http/Controllers/EmployeeController.php:69-77](file://app/Http/Controllers/EmployeeController.php#L69-L77)
- [app/Http/Controllers/EmployeeController.php:78-92](file://app/Http/Controllers/EmployeeController.php#L78-L92)
- [app/Models/Employee.php:9-16](file://app/Models/Employee.php#L9-L16)

## Development Workflow
The project includes convenient scripts for streamlined development:

- Setup script:
  - Installs dependencies, generates keys, runs migrations, installs frontend dependencies, and builds assets
  - Command: `composer setup`

- Development script:
  - Runs the Laravel server, queue listener, log tailing, and Vite dev server concurrently
  - Command: `composer dev`

- Testing:
  - Clear configuration cache and run tests
  - Command: `composer test`

- Asset pipeline:
  - Vite build and dev commands are available via npm scripts

**Section sources**
- [composer.json:34-49](file://composer.json#L34-L49)
- [package.json:5-8](file://package.json#L5-L8)

## Common Issues and Solutions
Below are frequently encountered setup issues and their resolutions:

- PHP version mismatch
  - Symptom: Composer fails with PHP version error
  - Solution: Upgrade to PHP 8.3 or later

- Missing OpenSSL extension
  - Symptom: Application key generation fails
  - Solution: Enable the OpenSSL extension in your PHP configuration

- Database connection errors
  - Symptom: Migration or application fails with database connectivity issues
  - Solution: Verify database credentials and ensure the database server is running

- SQLite database file permissions
  - Symptom: Cannot write to database file
  - Solution: Ensure the storage directory is writable by the web server

- Node.js/npm compatibility
  - Symptom: Asset compilation fails
  - Solution: Use a compatible Node.js version as specified in package.json

- Port conflicts
  - Symptom: Laravel development server cannot bind to port 8000
  - Solution: Stop the conflicting service or change the port

- CORS issues (frontend integration)
  - Symptom: Browser blocks API requests from frontend
  - Solution: Configure CORS middleware or proxy settings

**Section sources**
- [composer.json:8-12](file://composer.json#L8-L12)
- [config/database.php:20](file://config/database.php#L20)
- [package.json:9-16](file://package.json#L9-L16)

## Troubleshooting Guide
Use these steps to diagnose and resolve common problems:

- Verify PHP and Composer versions
  - Check PHP version: `php -v`
  - Check Composer version: `composer --version`

- Clear caches and configuration
  - Clear configuration cache: `php artisan config:clear`
  - Clear route cache: `php artisan route:clear`
  - Clear view cache: `php artisan view:clear`

- Check database connectivity
  - Test database connection: `php artisan tinker` then attempt a simple query
  - Verify database credentials in the environment file

- Inspect logs
  - Review Laravel logs in storage/logs
  - Tail application logs during development

- Rebuild frontend assets
  - Delete node_modules and reinstall dependencies
  - Clear Vite cache and rebuild assets

- Reset migrations (development only)
  - Rollback all migrations: `php artisan migrate:reset`
  - Re-run migrations: `php artisan migrate`

- Health check
  - Access the health endpoint: http://localhost:8000/up

**Section sources**
- [composer.json:47-49](file://composer.json#L47-L49)
- [public/index.php:8-11](file://public/index.php#L8-L11)

## Conclusion
You now have the employees API project running locally. Use the provided endpoints to manage employees, leverage the development scripts for efficient workflow, and refer to the troubleshooting section for common issues. For further learning, consult the Laravel documentation and the project's README.