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
const corsOptions = {
  
    origin:process.env.TRUSTED_ORIGINS?.split(',') || [],
   
    credentials: true
     
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



const port = process.env.PORT||3000;

console.log(process.env.TRUSTED_ORIGINS)

app.post('/api/stripe',express.raw({type: 'application/json'}), stripeWebhook)
app.use("/uploads", express.static("uploads"));




app.use('/api/auth', toNodeHandler(auth));

app.get('/', (req: Request, res: Response) => {
    res.send('Server is live with Neon!');
});
app.use('/api/user',userRouter);
app.use('/api/project',projectRouter);
app.use("/api", uploadRoutes);
app.use("/api/deploy", deployRoutes);
const distPath = path.resolve(process.cwd(), "client/dist");

app.use(express.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

