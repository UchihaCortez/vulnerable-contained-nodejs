# Vulnerable Next.js Application

This repository contains a sample Next.js application that demonstrates the authorization bypass vulnerability in Next.js Middleware (GHSA-f82v-jwr5-mffw). The vulnerability was present in Next.js version 13.5.6 and fixed in version 13.5.9.

## Vulnerability Details

**CVE ID**: CVE-2023-46298  
**Vulnerability**: Authorization Bypass in Next.js Middleware  
**Affected Version**: Next.js 13.5.6  
**Fixed Version**: Next.js 13.5.9  
**GitHub Security Advisory**: [GHSA-f82v-jwr5-mffw](https://github.com/advisories/GHSA-f82v-jwr5-mffw)

### Description

In Next.js 13.5.6, there is a vulnerability in the middleware that allows bypassing authorization checks by manipulating the URL. The middleware is supposed to protect routes like `/protected` and `/admin`, but due to the vulnerability, these routes can be accessed even without authentication by using specific URL patterns.

## Application Structure

The application consists of:

- A home page with login/logout functionality
- A public page accessible to everyone
- A protected page that should only be accessible to authenticated users
- An admin page that should only be accessible to authenticated users
- A middleware that checks for authentication and protects the protected and admin routes

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

## Demonstrating the Vulnerability

1. Open the application in your browser.
2. Without logging in, try to access the protected page at [http://localhost:3000/protected](http://localhost:3000/protected). You should be redirected to the home page because the middleware is protecting this route.
3. Now, try to access the protected page using the URL pattern that exploits the vulnerability: [http://localhost:3000/protected/..](http://localhost:3000/protected/..) or [http://localhost:3000/protected/..;](http://localhost:3000/protected/..;). You should see the "Access Denied" page with a note saying "If you're seeing this page without logging in, it means you've successfully bypassed the middleware protection! This demonstrates the vulnerability." This confirms that you've successfully bypassed the middleware, but the client-side protection is still in place. **Important**: If you're being redirected to the home page instead, it means the middleware is still blocking access and the vulnerability demonstration is not working correctly.
4. Similarly, you can access the admin page using [http://localhost:3000/admin/..](http://localhost:3000/admin/..) or [http://localhost:3000/admin/..;](http://localhost:3000/admin/..;) without authentication and see a similar "Admin Access Denied" page with the same note.

Note: The middleware has been configured to allow access to specific URL patterns like '/protected/..', '/protected/..;', '/protected/../', '/admin/..', '/admin/..;', and '/admin/../' to demonstrate the vulnerability. In a real-world scenario with Next.js 13.5.6, these URL patterns would naturally bypass the middleware protection without any special configuration.

## Fixing the Vulnerability

To fix the vulnerability, update Next.js to version 13.5.9 or later in the package.json file:

```json
"dependencies": {
  "next": "13.5.9",
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

Then run `npm install` to update the dependencies.

## Disclaimer

This application is created for educational purposes only to demonstrate a specific security vulnerability. Do not use this code in production environments. Always keep your dependencies updated to the latest secure versions.
