// This is a server-side API route that handles command execution
// It's intentionally vulnerable to command injection for demonstration purposes

import { exec } from 'child_process';

export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }

  // Vulnerable implementation - no sanitization of user input
  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (stderr) {
      return res.status(500).json({ error: stderr });
    }
    return res.status(200).json({ output: stdout });
  });
}