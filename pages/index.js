import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user has a token in localStorage
    const token = localStorage.getItem('auth-token');
    setIsLoggedIn(!!token);
  }, []);

  const login = () => {
    // Set a dummy token in localStorage for client-side auth
    localStorage.setItem('auth-token', 'dummy-token');

    // Set a cookie for server-side middleware auth
    document.cookie = 'auth-token=dummy-token; path=/';

    setIsLoggedIn(true);
  };

  const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('auth-token');

    // Remove the cookie
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';

    setIsLoggedIn(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Vulnerable Next.js Application</h1>
      <p>This application demonstrates the authorization bypass vulnerability in Next.js Middleware (GHSA-f82v-jwr5-mffw).</p>

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        {isLoggedIn ? (
          <button onClick={logout} style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        ) : (
          <button onClick={login} style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Login
          </button>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Navigation</h2>
        <ul>
          <li>
            <Link href="/public">
              Public Page (accessible to everyone)
            </Link>
          </li>
          <li>
            <Link href="/protected">
              Protected Page (requires authentication)
            </Link>
          </li>
          <li>
            <Link href="/admin">
              Admin Page (requires authentication)
            </Link>
          </li>
        </ul>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h2>Vulnerability Explanation</h2>
        <p>
          In Next.js 13.5.6, there is a vulnerability in the middleware that allows bypassing authorization checks by manipulating the URL.
          The middleware is supposed to protect routes like <code>/protected</code> and <code>/admin</code>, but due to the vulnerability,
          these routes can be accessed even without authentication by using specific URL patterns.
        </p>
        <p>
          <strong>Try this:</strong> Even without logging in, you can access the protected pages by using URLs like:
        </p>
        <ul>
          <li><code>/protected/..</code> or <code>/protected/..;</code></li>
          <li><code>/admin/..</code> or <code>/admin/..;</code></li>
        </ul>
        <p>
          This vulnerability was fixed in Next.js 13.5.9.
        </p>
      </div>
    </div>
  );
}
