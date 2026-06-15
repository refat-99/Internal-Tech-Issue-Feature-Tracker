
    import { createRequire } from "module";
    const require = createRequire(import.meta.url); 
    
    

// src/app.ts
import express3 from "express";
import dotenv2 from "dotenv";

// src/modules/issues/issue.route.ts
import express from "express";

// src/db/db.ts
import { Pool } from "pg";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env")
});
var config = {
  connection_string: process.env.CONNECTIONSTRING,
  port: process.env.PORT,
  secret: process.env.JWT_SECRET,
  ssl: {
    rejectUnauthorized: false
  }
};

// src/db/db.ts
var pool = new Pool({
  connectionString: config.connection_string
});
var initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR(20) DEFAULT 'contributor',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues (
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      type VARCHAR(20) NOT NULL,
      status VARCHAR(20) DEFAULT 'open',
      reporter_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );    `);
    console.log("Database connected successfully!");
  } catch (error) {
    console.log(error);
  }
};

// src/modules/issues/issue.service.ts
var createIssue = async (payload, reporterId) => {
  const { title, description, type } = payload;
  const result = await pool.query(
    `
    INSERT INTO issues
    (title,description,type,reporter_id)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [title, description, type, reporterId]
  );
  return result.rows[0];
};
var getAllIssues = async (query) => {
  const { sort = "newest", type, status } = query;
  let sql = "SELECT * FROM issues";
  const values = [];
  const conditions = [];
  if (type) {
    values.push(type);
    conditions.push(
      `type = $${values.length}`
    );
  }
  if (status) {
    values.push(status);
    conditions.push(
      `status = $${values.length}`
    );
  }
  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(
      " AND "
    )}`;
  }
  sql += sort === "oldest" ? " ORDER BY created_at ASC" : " ORDER BY created_at DESC";
  const issuesResult = await pool.query(
    sql,
    values
  );
  const issues = issuesResult.rows;
  const reporterIds = [
    ...new Set(
      issues.map(
        (issue) => issue.reporter_id
      )
    )
  ];
  if (reporterIds.length === 0) {
    return [];
  }
  const usersResult = await pool.query(
    `
    SELECT id,name,role
    FROM users
    WHERE id = ANY($1)
    `,
    [reporterIds]
  );
  const users = usersResult.rows;
  return issues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: users.find(
      (u) => u.id === issue.reporter_id
    ),
    created_at: issue.created_at,
    updated_at: issue.updated_at
  }));
};
var getSingleIssue = async (id) => {
  const issueResult = await pool.query(
    "SELECT * FROM issues WHERE id=$1",
    [id]
  );
  const issue = issueResult.rows[0];
  if (!issue) {
    throw new Error("Issue not found");
  }
  const userResult = await pool.query(
    `
    SELECT id,name,role
    FROM users
    WHERE id=$1
    `,
    [issue.reporter_id]
  );
  return {
    ...issue,
    reporter: userResult.rows[0]
  };
};
var updateIssue = async (id, payload, currentUser) => {
  const issueResult = await pool.query(
    "SELECT * FROM issues WHERE id=$1",
    [id]
  );
  const issue = issueResult.rows[0];
  if (!issue) {
    throw new Error("Issue not found");
  }
  if (currentUser.role === "contributor") {
    if (issue.reporter_id !== currentUser.id) {
      throw new Error(
        "You can update only your own issue"
      );
    }
    if (issue.status !== "open") {
      throw new Error(
        "Cannot update non-open issue"
      );
    }
  }
  const { title, description, type, status } = payload;
  const result = await pool.query(
    `
    UPDATE issues
    SET
      title=$1,
      description=$2,
      type=$3,
      status=$4,
      updated_at=NOW()
    WHERE id=$5
    RETURNING *
    `,
    [
      title,
      description,
      type,
      status || issue.status,
      id
    ]
  );
  return result.rows[0];
};
var deleteIssue = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM issues
    WHERE id=$1
    RETURNING *
    `,
    [id]
  );
  if (!result.rows[0]) {
    throw new Error("Issue not found");
  }
  return result.rows[0];
};

// src/utility/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data
  });
};
var sendResponse_default = sendResponse;

// src/modules/issues/issue.controller.ts
var createIssueController = async (req, res) => {
  try {
    const result = await createIssue(
      req.body,
      req.user.id
    );
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issue created successfully",
      data: result
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 400,
      success: false,
      message: error.message
    });
  }
};
var getAllIssuesController = async (req, res) => {
  try {
    const result = await getAllIssues(
      req.query
    );
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issue retrived successfully",
      data: result
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message
    });
  }
};
var getSingleIssueController = async (req, res) => {
  try {
    const result = await getSingleIssue(Number(req.params.id));
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issue retrived successfully",
      data: result
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 404,
      success: false,
      message: error.message
    });
  }
};
var updateIssueController = async (req, res) => {
  try {
    const result = await updateIssue(
      Number(req.params.id),
      req.body,
      req.user
    );
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: error.message === "Issue not found" ? 404 : 403,
      success: false,
      message: error.message
    });
  }
};
var deleteIssueController = async (req, res) => {
  try {
    await deleteIssue(
      Number(req.params.id)
    );
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully"
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 404,
      success: false,
      message: error.message
    });
  }
};

// src/utility/jwt.ts
import jwt from "jsonwebtoken";
var SECRET = process.env.JWT_SECRET;
var signToken = (payload) => {
  return jwt.sign(payload, SECRET, {
    expiresIn: "7d"
  });
};
console.log("JWT SECRET LOADED:", !!SECRET);
var verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

// src/middlewares/auth.middleware.ts
var authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided"
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};
var auth_middleware_default = authMiddleware;

// src/middlewares/role.middleware.ts
var roleMiddleware = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({
      success: false,
      message: "Forbidden"
    });
  }
  next();
};

// src/modules/issues/issue.route.ts
var router = express.Router();
router.post("/create", auth_middleware_default, createIssueController);
router.get("/", getAllIssuesController);
router.get("/:id", getSingleIssueController);
router.patch("/:id", auth_middleware_default, updateIssueController);
router.delete(
  "/:id",
  auth_middleware_default,
  roleMiddleware("maintainer"),
  deleteIssueController
);
var issueRoute = router;

// src/modules/auth/auth.route.ts
import express2 from "express";

// src/utility/bcrypt.ts
import bcrypt from "bcrypt";
var hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};
var matched = async (password, dbPassword) => {
  console.log("INPUT PASSWORD:", password);
  console.log("DB PASSWORD:", dbPassword);
  return await bcrypt.compare(password, dbPassword);
};

// src/modules/auth/auth.service.ts
var signUpIntoDB = async (payload) => {
  const { name, email, password, role } = payload;
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );
  if (existingUser.rowCount) {
    throw new Error("Email already exists");
  }
  const hashedPassword = await hashPassword(password);
  console.log(hashedPassword);
  const result = await pool.query(
    `
      INSERT INTO users
      (name,email,password,role)
      VALUES ($1,$2,$3,$4)
      RETURNING *
    `,
    [
      name,
      email,
      hashedPassword,
      role || "contributor"
    ]
  );
  delete result.rows[0].password;
  return result.rows[0];
};
var logInintoDb = async (payload) => {
  const { email, password } = payload;
  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );
  if (result.rows.length === 0) {
    throw new Error("Invalid credentials");
  }
  const user = result.rows[0];
  const dbPassword = user.password;
  const isMatched = matched(password, dbPassword);
  if (!isMatched) {
    throw new Error("Invalid credentials");
  }
  const jwtToken = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  const accesstoken = signToken(jwtToken);
  return {
    accesstoken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  };
};

// src/modules/auth/auth.controller.ts
var signupController = async (req, res) => {
  try {
    const result = await signUpIntoDB(req.body);
    sendResponse_default(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully"
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 400,
      success: false,
      message: error.message
    });
  }
};
var loginController = async (req, res) => {
  try {
    const result = await logInintoDb(req.body);
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 400,
      success: false,
      message: error.message
    });
  }
};

// src/modules/auth/auth.route.ts
var router2 = express2.Router();
router2.post("/signup", signupController);
router2.post("/login", loginController);
var authRoute = router2;

// src/app.ts
dotenv2.config();
var app = express3();
app.use(express3.json());
app.use(express3.text());
app.use(express3.urlencoded({ extended: true }));
app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);
var app_default = app;

// src/server.ts
var port = config.port || 5e3;
var main = () => {
  initDB();
  app_default.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
main();
//# sourceMappingURL=server.js.map