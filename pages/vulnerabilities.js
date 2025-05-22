import { useState, useEffect } from 'react';
import Link from 'next/link';
import _ from 'lodash';

export default function VulnerabilitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState('');
  const [command, setCommand] = useState('date');
  const [commandOutput, setCommandOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [prototypeInput, setPrototypeInput] = useState('{"constructor": {"prototype": {"isAdmin": true}}}');
  const [prototypeOutput, setPrototypeOutput] = useState('');
  const [sqlUsername, setSqlUsername] = useState('user1');
  const [sqlResults, setSqlResults] = useState('');
  const [sqlLoading, setSqlLoading] = useState(false);

  // Vulnerable to XSS - directly inserting user input into innerHTML
  const handleSearch = (e) => {
    e.preventDefault();
    // Vulnerable implementation - no sanitization of user input
    setSearchResults(`<div>Search results for: ${searchTerm}</div>`);
  };

  // Vulnerable to Command Injection - directly executing user input as a command
  const executeCommand = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Vulnerable implementation - no sanitization of user input
      const response = await fetch('/api/execute-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setCommandOutput(`Error: ${data.error}`);
        return;
      }

      setCommandOutput(data.output);
    } catch (error) {
      setLoading(false);
      setCommandOutput(`Error: ${error.message}`);
    }
  };

  // Vulnerable to Prototype Pollution in lodash 4.17.15
  const handlePrototypePollution = (e) => {
    e.preventDefault();
    try {
      // Parse the user input as JSON
      const userInput = JSON.parse(prototypeInput);

      // Create a test object
      const testObj = {};

      // Use vulnerable lodash.merge to merge the user input into the test object
      // This can lead to prototype pollution if the input contains constructor.prototype properties
      _.merge({}, userInput);

      // Check if the prototype has been polluted
      const newObj = {};
      const pollutionResult = newObj.isAdmin === true ? 
        "Vulnerability successfully exploited! The prototype has been polluted." : 
        "Vulnerability not exploited. Try a different payload.";

      setPrototypeOutput(
        `Test result: ${pollutionResult}\n\n` +
        `New object's isAdmin property: ${newObj.isAdmin}\n\n` +
        `Technical details:\n` +
        `In lodash 4.17.15, the merge function is vulnerable to prototype pollution.\n` +
        `The payload modifies Object.prototype, affecting all JavaScript objects.`
      );
    } catch (error) {
      setPrototypeOutput(`Error: ${error.message}`);
    }
  };

  // Vulnerable to SQL Injection
  const handleSqlInjection = async (e) => {
    e.preventDefault();
    setSqlLoading(true);

    try {
      // Vulnerable implementation - no sanitization of user input
      const response = await fetch('/api/query-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: sqlUsername }),
      });

      const data = await response.json();
      setSqlLoading(false);

      if (!response.ok) {
        setSqlResults(`Error: ${data.error}`);
        return;
      }

      // Format the results for display
      const formattedResults = JSON.stringify(data.results, null, 2);
      setSqlResults(
        `Query results:\n${formattedResults}\n\n` +
        `Technical details:\n` +
        `This endpoint is vulnerable to SQL injection because it directly inserts user input into an SQL query.\n` +
        `Try payloads like: ' OR '1'='1 to retrieve all users, or ' UNION SELECT sql,null,null,null FROM sqlite_master --`
      );
    } catch (error) {
      setSqlLoading(false);
      setSqlResults(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Additional Vulnerabilities Demo</h1>
      <p>This page demonstrates additional vulnerabilities in the application.</p>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h2>Cross-Site Scripting (XSS) Vulnerability</h2>
        <p>
          This search feature is vulnerable to XSS attacks because it renders user input directly in the DOM without sanitization.
        </p>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Try entering: <script>alert('XSS')</script>"
            style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
          />
          <button
            type="submit"
            style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Search
          </button>
        </form>
        {searchResults && (
          <div 
            style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}
            // Vulnerable to XSS - directly setting innerHTML from user input
            dangerouslySetInnerHTML={{ __html: searchResults }}
          />
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h2>Command Injection Vulnerability</h2>
        <p>
          This feature is vulnerable to command injection because it executes shell commands based on user input without proper sanitization.
        </p>
        <form onSubmit={executeCommand}>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter a command (e.g., 'date')"
            style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
          />
          <button
            type="submit"
            style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Execute
          </button>
        </form>
        {loading && <p>Loading...</p>}
        {commandOutput && (
          <pre style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
            {commandOutput}
          </pre>
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h2>Prototype Pollution Vulnerability (Lodash 4.17.15)</h2>
        <p>
          This feature demonstrates a prototype pollution vulnerability in lodash 4.17.15. The vulnerability allows an attacker to modify the prototype of JavaScript objects.
        </p>
        <form onSubmit={handlePrototypePollution}>
          <textarea
            value={prototypeInput}
            onChange={(e) => setPrototypeInput(e.target.value)}
            placeholder='{"constructor": {"prototype": {"isAdmin": true}}}'
            style={{ padding: '8px', width: '100%', height: '100px', marginBottom: '10px', fontFamily: 'monospace' }}
          />
          <button
            type="submit"
            style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Test Vulnerability
          </button>
        </form>
        {prototypeOutput && (
          <pre style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
            {prototypeOutput}
          </pre>
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h2>SQL Injection Vulnerability</h2>
        <p>
          This feature demonstrates an SQL injection vulnerability. The server-side API endpoint directly inserts user input into an SQL query without proper sanitization.
        </p>
        <form onSubmit={handleSqlInjection}>
          <input
            type="text"
            value={sqlUsername}
            onChange={(e) => setSqlUsername(e.target.value)}
            placeholder="Enter a username (e.g., 'user1')"
            style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
          />
          <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>
            Try SQL injection payloads like: <code>' OR '1'='1</code> to retrieve all users, or <code>' UNION SELECT sql,null,null,null FROM sqlite_master --</code> to retrieve database schema.
          </p>
          <button
            type="submit"
            style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Query Database
          </button>
        </form>
        {sqlLoading && <p>Loading...</p>}
        {sqlResults && (
          <pre style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
            {sqlResults}
          </pre>
        )}
      </div>

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
