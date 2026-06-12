import express, {
  type Request,
  type Response,
  type Application,
} from "express";
import dotenv from "dotenv";
dotenv.config();
import config from "./config";
import { initDB, pool } from "./db";
import { userSignupRoute } from "./modules/user/user.route";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));


// Route


app.use('/api/signup', userSignupRoute);



// app.post("/", async (req: Request, res: Response) => {
//         const {name, email, password,role} = req.body;
//         res.status(200).json({
//             message: "User created successfully",
//             user: {
//                 name,
//                 email,
//                 role
//             }
//         });
//     });
// app.post("/", async (req: Request, res: Response) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const result = await pool.query(
//       `INSERT INTO users (name, email, password, role)
//        VALUES ($1, $2, $3, $4)
//        RETURNING id, name, email, role`,
//       [name, email, password, role || "contributor"]
//     );

//     res.status(201).json({
//       message: "User created successfully",
//       user: result.rows[0],
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Database error",
//       error,
//     });
//   }
// });


export default app;