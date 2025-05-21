import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has a token in localStorage
    const token = localStorage.getItem('auth-token');
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

  // This is a client-side check that complements the middleware
  // In a real application, you would also verify the token on the server
  if (!isLoading && !isLoggedIn) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Admin Access Denied</h1>
        <p>You need to be logged in to view this admin page.</p>
        <p>
          <strong>Note:</strong> If you're seeing this page without logging in, it means you've successfully bypassed the middleware protection!
          This demonstrates the vulnerability.
        </p>
        <div style={{ marginTop: '20px' }}>
          <Link href="/">
            <button style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Admin Dashboard</h1>
      <p>This is an admin page that should only be accessible to authenticated users.</p>
      <p>If you're logged in, you should see this content normally.</p>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h2>Sensitive Admin Information</h2>
        <p>This section contains sensitive information that should only be visible to authenticated administrators.</p>
        <ul>
          <li>User database: 1,000 records</li>
          <li>System status: Online</li>
          <li>Last backup: 2023-10-15</li>
        </ul>
      </div>

      <p style={{ marginTop: '20px' }}>
        <strong>URL Vulnerability Test:</strong> Try accessing this page with the URL pattern <code>/admin/..</code> or <code>/admin/..;</code> without being logged in.
        Due to the vulnerability in Next.js 13.5.6, you'll be able to bypass the middleware protection.
      </p>

      <div style={{ marginTop: '20px' }}>
        <Link href="/">
          <button style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
