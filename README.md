# Vulnerable Next.js Application

This repository contains a sample Next.js application that demonstrates the authorization bypass vulnerability in Next.js Middleware (GHSA-f82v-jwr5-mffw). The vulnerability was present in Next.js version 13.5.6 and fixed in version 13.5.9.

## Vulnerability Details

### 1. Next.js Middleware Authorization Bypass

**CVE ID**: CVE-2023-46298  
**Vulnerability**: Authorization Bypass in Next.js Middleware  
**Affected Version**: Next.js 13.5.6  
**Fixed Version**: Next.js 13.5.9  
**GitHub Security Advisory**: [GHSA-f82v-jwr5-mffw](https://github.com/advisories/GHSA-f82v-jwr5-mffw)  
**Severity**: Medium

#### Description

In Next.js 13.5.6, there is a vulnerability in the middleware that allows bypassing authorization checks by manipulating the URL. The middleware is supposed to protect routes like `/protected` and `/admin`, but due to the vulnerability, these routes can be accessed even without authentication by using specific URL patterns.

## Running the Application Locally

### Prerequisites

- Node.js 16 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/vulnerable-nextjs-app.git
   cd vulnerable-nextjs-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Running with Docker

### Prerequisites

- Docker

### Building and Running the Docker Container

1. Build the Docker image:
   ```
   docker build -t vulnerable-nextjs-app .
   ```

2. Run the Docker container:
   ```
   docker run -p 3000:3000 vulnerable-nextjs-app
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Fixing the Vulnerabilities

### 1. Next.js Middleware Authorization Bypass

To fix the Next.js middleware vulnerability, update Next.js to version 13.5.9 or later in the package.json file:

```json
"dependencies": {
  "next": "13.5.9",
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```