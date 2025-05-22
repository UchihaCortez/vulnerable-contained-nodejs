// This is a server-side API route that demonstrates SQL injection vulnerability
// It's intentionally vulnerable for demonstration purposes

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// In-memory database for demonstration
let db;

// Initialize the database with some sample data
async function initializeDatabase() {
  if (!db) {
    db = await open({
      filename: ':memory:',
      driver: sqlite3.Database
    });

    // Create users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        email TEXT,
        password TEXT,
        is_admin INTEGER
      )
    `);

    // Insert sample data
    await db.exec(`
      INSERT INTO users (username, email, password, is_admin) VALUES
      ('admin', 'admin@example.com', 'admin_password', 1),
      ('user1', 'user1@example.com', 'user1_password', 0),
      ('user2', 'user2@example.com', 'user2_password', 0)
    `);
  }
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    await initializeDatabase();

    // Vulnerable to SQL injection - directly inserting user input into SQL query
    // A secure implementation would use parameterized queries
    const query = `SELECT id, username, email, is_admin FROM users WHERE username = '${username}'`;
    
    console.log(`Executing query: ${query}`);
    
    const results = await db.all(query);
    
    return res.status(200).json({ results });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: error.message });
  }
}