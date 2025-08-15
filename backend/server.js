const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const SECRET = "supersecretkey";
const REFRESH_SECRET = "refreshsupersecretkey";
const TOKEN_EXPIRY = "5m";
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Banking API",
      version: "1.0.0",
      description:
        "A simple banking API with authentication, accounts, cards, and transactions",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./server.js"],
};

const specs = swaggerJsdoc(swaggerOptions);

// Serve the OpenAPI spec at the root of docs
app.get("/api-docs/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json(specs);
});

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// SQLite setup
const db = new sqlite3.Database("./data/banking.db");

// Seed data
db.serialize(() => {
  const username = "test@test.test";
  const password = "password@123";

  // clear db on every start
  db.run("DROP TABLE IF EXISTS users");
  db.run("DROP TABLE IF EXISTS accounts");
  db.run("DROP TABLE IF EXISTS cards");
  db.run("DROP TABLE IF EXISTS transactions");

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    number TEXT,
    expiry TEXT,
    cvv TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    account_id INTEGER,
    amount REAL,
    type TEXT,
    description TEXT,
    date TEXT
  )`);

  // Insert a test user if not exists
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (!row) {
      const hash = bcrypt.hashSync(password, 10);
      db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hash],
        function (err) {
          const userId = this.lastID;
          // Seed accounts
          db.run("INSERT INTO accounts (user_id, name) VALUES (?, ?)", [
            userId,
            "Checking",
          ]);
          db.run("INSERT INTO accounts (user_id, name) VALUES (?, ?)", [
            userId,
            "Savings",
          ]);
          // Seed cards
          db.run(
            "INSERT INTO cards (user_id, number, expiry, cvv) VALUES (?, ?, ?, ?)",
            [userId, "4111111111111111", "12/26", "123"]
          );
          db.run(
            "INSERT INTO cards (user_id, number, expiry, cvv) VALUES (?, ?, ?, ?)",
            [userId, "5500000000000004", "11/25", "456"]
          );
          // Seed transactions
          db.run(
            'INSERT INTO transactions (user_id, account_id, amount, type, description, date) VALUES (?, 1, -50.25, "debit", "Grocery Store", "2024-06-01T10:00:00Z")',
            [userId]
          );
          db.run(
            'INSERT INTO transactions (user_id, account_id, amount, type, description, date) VALUES (?, 1, 2000.00, "credit", "Salary", "2024-06-02T09:00:00Z")',
            [userId]
          );
          db.run(
            'INSERT INTO transactions (user_id, account_id, amount, type, description, date) VALUES (?, 2, -100.00, "debit", "Online Shopping", "2024-06-03T15:30:00Z")',
            [userId]
          );
          db.run(
            'INSERT INTO transactions (user_id, account_id, amount, type, description, date) VALUES (?, 1, -120.00, "debit", "Online Shopping", "2024-06-02T10:00:00Z")',
            [userId]
          );
          db.run(
            'INSERT INTO transactions (user_id, account_id, amount, type, description, date) VALUES (?, 1, -35.60, "debit", "Restaurant - Italian Bistro", "2024-06-04T19:45:00Z")',
            [userId]
          );
          db.run(
            'INSERT INTO transactions (user_id, account_id, amount, type, description, date) VALUES (?, 2, -75.00, "debit", "Electricity Bill", "2024-06-05T08:00:00Z")',
            [userId]
          );
          db.run(
            'INSERT INTO transactions (user_id, account_id, amount, type, description, date) VALUES (?, 1, -20.00, "debit", "ATM Withdrawal", "2024-06-06T12:30:00Z")',
            [userId]
          );
          db.run(
            'INSERT INTO transactions (user_id, account_id, amount, type, description, date) VALUES (?, 2, 500.00, "credit", "Transfer from Checking", "2024-06-07T14:00:00Z")',
            [userId]
          );
          db.run(
            'INSERT INTO transactions (user_id, account_id, amount, type, description, date) VALUES (?, 1, -12.99, "debit", "Coffee Shop", "2024-06-08T09:15:00Z")',
            [userId]
          );
          db.run(
            'INSERT INTO transactions (user_id, account_id, amount, type, description, date) VALUES (?, 1, -60.00, "debit", "Gas Station", "2024-06-09T17:20:00Z")',
            [userId]
          );
          db.run(
            'INSERT INTO transactions (user_id, account_id, amount, type, description, date) VALUES (?, 2, 100.00, "credit", "Gift Received", "2024-06-10T11:00:00Z")',
            [userId]
          );
          db.run(
            'INSERT INTO transactions (user_id, account_id, amount, type, description, date) VALUES (?, 1, -45.00, "debit", "Pharmacy", "2024-06-11T16:10:00Z")',
            [userId]
          );
          db.run(
            'INSERT INTO transactions (user_id, account_id, amount, type, description, date) VALUES (?, 2, -150.00, "debit", "Online Subscription", "2024-06-12T07:30:00Z")',
            [userId]
          );
          db.run(
            'INSERT INTO transactions (user_id, account_id, amount, type, description, date) VALUES (?, 1, -80.00, "debit", "Electronics Store", "2024-06-13T13:50:00Z")',
            [userId]
          );
          db.run(
            'INSERT INTO transactions (user_id, account_id, amount, type, description, date) VALUES (?, 2, 250.00, "credit", "Freelance Payment", "2024-06-14T18:00:00Z")',
            [userId]
          );
          db.run(
            'INSERT INTO transactions (user_id, account_id, amount, type, description, date) VALUES (?, 1, -22.50, "debit", "Bookstore", "2024-06-15T15:40:00Z")',
            [userId]
          );
          db.run(
            'INSERT INTO transactions (user_id, account_id, amount, type, description, date) VALUES (?, 2, -90.00, "debit", "Water Bill", "2024-06-16T10:00:00Z")',
            [userId]
          );
          db.run(
            'INSERT INTO transactions (user_id, account_id, amount, type, description, date) VALUES (?, 1, -5.75, "debit", "Bakery", "2024-06-17T08:25:00Z")',
            [userId]
          );
          db.run(
            'INSERT INTO transactions (user_id, account_id, amount, type, description, date) VALUES (?, 2, 300.00, "credit", "Stock Dividend", "2024-06-18T20:00:00Z")',
            [userId]
          );
        }
      );
    }
  });
});

function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}
function generateRefreshToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Auth endpoints
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate user and get JWT tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "test@test.test"
 *               password:
 *                 type: string
 *                 example: "password@123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 */
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    res.json({ token, refreshToken });
  });
});

/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Refresh JWT access token using refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: JWT refresh token
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: New JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: New JWT refresh token
 *       401:
 *         description: No refresh token provided
 *       403:
 *         description: Invalid or expired refresh token
 */
app.post("/refresh-token", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);
  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({ token, refreshToken });
  });
});

// Protected endpoints
/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: Get user accounts with balances
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user accounts with balances
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   user_id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Checking"
 *                   balance:
 *                     type: number
 *                     format: float
 *                     example: 1950.25
 *       401:
 *         description: Unauthorized - No valid token
 *       403:
 *         description: Forbidden - Invalid token
 *       500:
 *         description: Internal server error
 */
app.get("/accounts", authenticateToken, (req, res) => {
  db.all(
    "SELECT * FROM accounts WHERE user_id = ?",
    [req.user.id],
    (err, accounts) => {
      if (err) return res.status(500).json({ error: "DB error" });
      if (!accounts.length) return res.json([]);
      // For each account, calculate balance from transactions
      const accountIds = accounts.map((acc) => acc.id);
      db.all(
        `SELECT account_id, SUM(amount) as balance FROM transactions WHERE user_id = ? AND account_id IN (${accountIds
          .map(() => "?")
          .join(",")}) GROUP BY account_id`,
        [req.user.id, ...accountIds],
        (err, balances) => {
          if (err) return res.status(500).json({ error: "DB error" });
          const balanceMap = {};
          balances.forEach((b) => {
            balanceMap[b.account_id] = b.balance || 0;
          });
          const result = accounts.map((acc) => ({
            ...acc,
            balance: balanceMap[acc.id] || 0,
          }));
          res.json(result);
        }
      );
    }
  );
});

/**
 * @swagger
 * /cards:
 *   get:
 *     summary: Get user's credit/debit cards
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   user_id:
 *                     type: integer
 *                     example: 1
 *                   number:
 *                     type: string
 *                     example: "4111111111111111"
 *                   expiry:
 *                     type: string
 *                     example: "12/26"
 *                   cvv:
 *                     type: string
 *                     example: "123"
 *       401:
 *         description: Unauthorized - No valid token
 *       403:
 *         description: Forbidden - Invalid token
 */
app.get("/cards", authenticateToken, (req, res) => {
  db.all(
    "SELECT * FROM cards WHERE user_id = ?",
    [req.user.id],
    (err, rows) => {
      res.json(rows);
    }
  );
});

// Transactions: search, sort, paginate
/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get user transactions with search, sort, and pagination
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for description or type
 *         example: "grocery"
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [date, amount, type, description]
 *         description: Field to sort by
 *         example: "date"
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *         example: "desc"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *         example: 10
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   user_id:
 *                     type: integer
 *                     example: 1
 *                   account_id:
 *                     type: integer
 *                     example: 1
 *                   amount:
 *                     type: number
 *                     format: float
 *                     example: -50.25
 *                   type:
 *                     type: string
 *                     example: "debit"
 *                   description:
 *                     type: string
 *                     example: "Grocery Store"
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-06-01T10:00:00Z"
 *       401:
 *         description: Unauthorized - No valid token
 *       403:
 *         description: Forbidden - Invalid token
 */
app.get("/transactions", authenticateToken, (req, res) => {
  const {
    search = "",
    sort = "date",
    order = "desc",
    page = 1,
    limit = 10,
  } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let query = "SELECT * FROM transactions WHERE user_id = ?";
  let params = [req.user.id];
  if (search.length) {
    query += " AND (description LIKE ? OR type LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  query += ` ORDER BY ${sort} ${order.toUpperCase()} LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);
  db.all(query, params, (err, rows) => {
    res.json(rows);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
