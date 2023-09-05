const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "haianh123",
  database: "user-keeper",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to database");
  }
});

app.get("/api/users", (req, res) => {
  const sql = "SELECT * FROM users ORDER BY id";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Error fetching users" });
    } else {
      res.json(results);
    }
  });
});

app.post("/api/users", (req, res) => {
  const { name, description } = req.body;
  const sql = "INSERT INTO users (name, description) VALUES (?, ?)";
  connection.query(sql, [name, description], (err, result) => {
    if (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ error: "Error creating user" });
    } else {
      res.json({ message: "User created successfully", id: result.insertId });
    }
  });
});

app.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const { name, description } = req.body;
  const sql = "UPDATE users SET name = ?, description = ? WHERE id = ?";
  connection.query(sql, [name, description, userId], (err) => {
    if (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ error: "Error updating user" });
    } else {
      res.json({ message: "User updated successfully" });
    }
  });
});

app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const sql = "DELETE FROM users WHERE id = ?";
  connection.query(sql, [userId], (err) => {
    if (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ error: "Error deleting user" });
    } else {
      res.json({ message: "User deleted successfully" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
