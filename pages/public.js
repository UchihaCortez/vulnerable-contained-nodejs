import Link from 'next/link';

export default function PublicPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Public Page</h1>
      <p>This page is accessible to everyone, no authentication required.</p>
      
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