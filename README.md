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

### 2. Cross-Site Scripting (XSS)

**Vulnerability**: Reflected Cross-Site Scripting  
**Severity**: High  
**Location**: `/vulnerabilities` page

#### Description

The application contains a search feature that is vulnerable to XSS attacks. User input is directly rendered in the DOM without proper sanitization, allowing attackers to inject and execute malicious JavaScript code in the context of the victim's browser.

### 3. Command Injection

**Vulnerability**: OS Command Injection  
**Severity**: Critical  
**Location**: `/vulnerabilities` page and `/api/execute-command` API route

#### Description

The application contains a command execution feature that is vulnerable to command injection attacks. User input is sent to a server-side API endpoint that passes it directly to the `exec` function without proper sanitization, allowing attackers to execute arbitrary commands on the server.

### 4. Prototype Pollution (Lodash)

**CVE ID**: CVE-2020-8203, CVE-2019-10744  
**Vulnerability**: Prototype Pollution in Lodash  
**Affected Version**: Lodash 4.17.15  
**Fixed Version**: Lodash 4.17.21  
**Severity**: High

#### Description

The application uses a vulnerable version of the Lodash library (4.17.15) that is susceptible to prototype pollution attacks. This vulnerability allows attackers to modify the prototype of JavaScript objects, potentially leading to application crashes, logic bypasses, or even remote code execution.

### 5. SQL Injection

**Vulnerability**: SQL Injection  
**Severity**: Critical  
**Location**: `/vulnerabilities` page and `/api/query-users` API route

#### Description

The application contains a user query feature that is vulnerable to SQL injection attacks. User input is directly inserted into an SQL query without proper sanitization, allowing attackers to manipulate the query to access unauthorized data, modify database contents, or potentially execute arbitrary code on the database server.

## Application Structure

The application consists of:

- A home page with login/logout functionality
- A public page accessible to everyone
- A protected page that should only be accessible to authenticated users
- An admin page that should only be accessible to authenticated users
- A vulnerabilities page that demonstrates multiple security vulnerabilities:
  - Cross-Site Scripting (XSS)
  - Command Injection
  - Prototype Pollution (using vulnerable Lodash 4.17.15)
  - SQL Injection
- API routes in the `/pages/api` directory:
  - `/api/execute-command` - Vulnerable to command injection
  - `/api/query-users` - Vulnerable to SQL injection
- A middleware that checks for authentication and protects the protected and admin routes
- Vulnerable dependencies:
  - Next.js 13.5.6 (middleware authorization bypass)
  - Lodash 4.17.15 (prototype pollution)

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

## Demonstrating the Vulnerabilities

### 1. Next.js Middleware Authorization Bypass

1. Open the application in your browser.
2. Without logging in, try to access the protected page at [http://localhost:3000/protected](http://localhost:3000/protected). You should be redirected to the home page because the middleware is protecting this route.
3. Now, try to access the protected page using the URL pattern that exploits the vulnerability: [http://localhost:3000/protected/..](http://localhost:3000/protected/..) or [http://localhost:3000/protected/..;](http://localhost:3000/protected/..;). You should see the "Access Denied" page with a note saying "If you're seeing this page without logging in, it means you've successfully bypassed the middleware protection! This demonstrates the vulnerability." This confirms that you've successfully bypassed the middleware, but the client-side protection is still in place. **Important**: If you're being redirected to the home page instead, it means the middleware is still blocking access and the vulnerability demonstration is not working correctly.
4. Similarly, you can access the admin page using [http://localhost:3000/admin/..](http://localhost:3000/admin/..) or [http://localhost:3000/admin/..;](http://localhost:3000/admin/..;) without authentication and see a similar "Admin Access Denied" page with the same note.

Note: The middleware has been configured to allow access to specific URL patterns like '/protected/..', '/protected/..;', '/protected/../', '/admin/..', '/admin/..;', and '/admin/../' to demonstrate the vulnerability. In a real-world scenario with Next.js 13.5.6, these URL patterns would naturally bypass the middleware protection without any special configuration.

### 2. Cross-Site Scripting (XSS)

1. Navigate to the Vulnerabilities Demo page at [http://localhost:3000/vulnerabilities](http://localhost:3000/vulnerabilities).
2. In the XSS vulnerability section, enter a malicious script in the search box, such as `<script>alert('XSS')</script>` or `<img src="x" onerror="alert('XSS')">`.
3. Click the "Search" button.
4. The application will render the malicious script directly in the DOM, executing the JavaScript code in your browser.

### 3. Command Injection

1. Navigate to the Vulnerabilities Demo page at [http://localhost:3000/vulnerabilities](http://localhost:3000/vulnerabilities).
2. In the Command Injection vulnerability section, enter a command in the input field. The default command is `date`, which is harmless.
3. To demonstrate the vulnerability, try entering commands like:
   - `date && ls` (to list files in the current directory)
   - `date && pwd` (to show the current working directory)
   - `date && whoami` (to show the current user)
4. Click the "Execute" button.
5. The application will send the command to the server-side API endpoint (`/api/execute-command`), which will execute it and return the output to be displayed in the browser.

**Warning**: Be careful when testing command injection vulnerabilities. Only use commands that are safe and don't modify the system. Avoid destructive commands like `rm` or commands that could expose sensitive information.

### 4. Prototype Pollution (Lodash)

1. Navigate to the Vulnerabilities Demo page at [http://localhost:3000/vulnerabilities](http://localhost:3000/vulnerabilities).
2. In the Prototype Pollution vulnerability section, you'll see a JSON input field with a default payload: `{"constructor": {"prototype": {"isAdmin": true}}}`.
3. Click the "Test Vulnerability" button.
4. The application will use the vulnerable lodash.merge function to process the input, which will pollute the Object prototype.
5. The result will show whether the vulnerability was successfully exploited by checking if a new object has the `isAdmin` property set to `true`.

### 5. SQL Injection

1. Navigate to the Vulnerabilities Demo page at [http://localhost:3000/vulnerabilities](http://localhost:3000/vulnerabilities).
2. In the SQL Injection vulnerability section, enter a username in the input field. The default is `user1`, which will return a single user record.
3. To demonstrate the vulnerability, try entering SQL injection payloads like:
   - `' OR '1'='1` (to retrieve all users in the database)
   - `' UNION SELECT sql,null,null,null FROM sqlite_master --` (to retrieve the database schema)
   - `admin' --` (to retrieve the admin user by commenting out the rest of the query)
4. Click the "Query Database" button.
5. The application will send the input to the server-side API endpoint (`/api/query-users`), which will directly insert it into an SQL query without sanitization, allowing the injection to succeed.

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

Then run `npm install` to update the dependencies.

### 2. Cross-Site Scripting (XSS)

To fix the XSS vulnerability, sanitize user input before rendering it in the DOM. You can use a library like DOMPurify:

```javascript
import DOMPurify from 'dompurify';

// Sanitize user input before setting it in the state
setSearchResults(`<div>Search results for: ${DOMPurify.sanitize(searchTerm)}</div>`);
```

Or avoid using dangerouslySetInnerHTML altogether and use safer alternatives:

```javascript
// Instead of dangerouslySetInnerHTML
<div>Search results for: {searchTerm}</div>
```

### 3. Command Injection

To fix the command injection vulnerability in the API route, avoid using user input directly in command execution. If you must use user input, validate and sanitize it strictly:

```javascript
// In pages/api/execute-command.js
// Whitelist approach - only allow specific commands
const allowedCommands = ['date', 'echo', 'uptime'];
if (!allowedCommands.includes(command)) {
  return res.status(400).json({ error: 'Command not allowed' });
}

// Or use a safer alternative like child_process.execFile with arguments separated
execFile(command, [], (error, stdout, stderr) => {
  // Handle the output and send response
});
```

You should also implement proper authentication and authorization for API routes that perform sensitive operations:

```javascript
// Check for authentication before executing commands
if (!req.session.user || !req.session.user.isAuthenticated) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

Alternatively, consider using a safer approach that doesn't involve executing shell commands at all, such as using dedicated Node.js APIs for the specific functionality you need.

### 4. Prototype Pollution (Lodash)

To fix the prototype pollution vulnerability in Lodash, update to version 4.17.21 or later in the package.json file:

```json
"dependencies": {
  "lodash": "4.17.21"
}
```

Then run `npm install` to update the dependency.

Alternatively, you can implement additional safeguards in your code:

```javascript
// Check if the input contains potentially dangerous properties
function isSafe(obj) {
  return !obj || (typeof obj !== 'object' || 
    !('constructor' in obj) && 
    !('__proto__' in obj) && 
    !('prototype' in obj));
}

// Only merge if the input is safe
if (isSafe(userInput)) {
  _.merge({}, userInput);
} else {
  console.error('Potentially dangerous input detected');
}
```

### 5. SQL Injection

To fix the SQL injection vulnerability, use parameterized queries instead of directly inserting user input into SQL queries:

```javascript
// In pages/api/query-users.js
// Use parameterized queries
const query = `SELECT id, username, email, is_admin FROM users WHERE username = ?`;
const results = await db.all(query, [username]);
```

You can also use an ORM (Object-Relational Mapping) library like Sequelize or Prisma, which automatically handles parameterized queries:

```javascript
// Using Prisma as an example
const user = await prisma.user.findUnique({
  where: {
    username: username
  },
  select: {
    id: true,
    username: true,
    email: true,
    is_admin: true
  }
});
```

Additionally, implement input validation to reject potentially malicious inputs:

```javascript
// Validate input before using it in a query
if (!/^[a-zA-Z0-9_]+$/.test(username)) {
  return res.status(400).json({ error: 'Invalid username format' });
}
```

## Disclaimer

This application is created for educational purposes only to demonstrate a specific security vulnerability. Do not use this code in production environments. Always keep your dependencies updated to the latest secure versions.
