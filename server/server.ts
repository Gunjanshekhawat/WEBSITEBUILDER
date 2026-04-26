import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from 'express';
import path from "path";
import { fileURLToPath } from "url";

import cors from 'cors';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth.js';
import userRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRouts.js';
import uploadRoutes from "./routes/uploadRoutes.js";
import deployRoutes from "./routes/deploy.js";
import { stripeWebhook } from "./controllers/stripeWebhook.js";
const app = express();
const port = process.env.PORT||3000;
const corsOptions = {
  
    origin:process.env.TRUSTED_ORIGINS?.split(',') || [],
   
    credentials: true
     
};
console.log(process.env.TRUSTED_ORIGINS)
app.use(cors(corsOptions));
app.post('/api/stripe',express.raw({type: 'application/json'}), stripeWebhook)


app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use((req, res, next) => {
    console.log("🔥 HIT:", req.method, req.url);
  console.log("BODY:", req.body);
  console.log("COOKIES:", req.headers.cookie);
  next();
});
app.use((req, res, next) => {
  console.log("🌍 GLOBAL HIT:", req.method, req.url);
  next();
});

app.use('/api/auth', toNodeHandler(auth));

app.get('/', (req: Request, res: Response) => {
    res.send('Server is live with Neon!');
});
app.use('/api/user',userRouter);
app.use('/api/project',projectRouter);
app.use("/api", uploadRoutes);
app.use("/api/deploy", deployRoutes);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, "../client/dist")));

// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist/index.html"));
// });