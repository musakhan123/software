const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin123",
    database: "ride_sharing"
});

db.connect(function (err) {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

app.post("/signup", function (req, res) {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const sql = "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, email, phone, password, role], function (err, result) {
        if (err) {
            console.log(err);
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ error: "Email already registered" });
            }
            return res.status(500).json({ error: "Server error" });
        }
        res.json({ message: "Account created" });
    });
});

app.post("/login", function (req, res) {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], function (err, results) {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Server error" });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: "Incorrect email or password" });
        }

        const user = results[0];
        res.json({ message: "Login successful", name: user.name, role: user.role });
    });
});

app.listen(3000, function () {
    console.log("Server running on http://localhost:3000");
});