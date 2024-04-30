# nest-template

This repository contains a template for creating RESTful APIs using NestJS, PostgreSQL (TypeORM), Redis, and MinIO. It's designed to serve as a starting point for new projects, providing a structured and scalable foundation.

# Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Docker](#docker)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing
purposes.

## Features

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **PostgreSQL (TypeORM)**: An ORM that can run in NodeJS and can be used with TypeScript and JavaScript (ES5, ES6, ES7, ES8).
- **Redis**: An open-source, in-memory data structure store, used as a database, cache, and message broker.
- **MinIO**: A high performance, distributed object storage system.
- **Authentication**: Implements Passport for authentication.
- **Authorization**: Utilizes Redis for managing role permissions across all services.
- **Email Service**: Supports SMTP for sending emails.
- **Docker Support**: Comes with Docker support for easy deployment.
- **Environment Configuration**: Supports `.env` files for easy environment configuration.


### Prerequisites

- Node.js (v14.x or higher)
- NestJS CLI
- PostgreSQL (v12.x or higher)
- Redis (v5.x or higher)
- MinIO
- Docker (optional, for containerization)

### Installation

1. Clone the repository:
   git clone https://github.com/samb2/nest-template.git
2. Navigate to the project directory:
   cd nest-template
3. Install dependencies:
   npm install

## Configuration

Before running the application, you need to configure the environment variables. Copy the `.env.example` file to `.env`
and update the values as needed:

```
cp .env.example .env.development
cp .env.example .env.production
cp .env.example .env.test
```

## Running the Application

To start the application, run:

```
npm run start
```

For development, you can use:

```
npm run start:dev
```

## Usage

After starting the application, you can access the API endpoints via `http://localhost:3000`.

### Docker

If you prefer to run the application in Docker, you can use the provided `compose.yml` file:

```
docker-compose up
```

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) before getting started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.