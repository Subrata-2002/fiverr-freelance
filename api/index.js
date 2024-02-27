import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
// routes
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser(
   { secure: true, // Set to true if using HTTPS
    httpOnly: true,}
));

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin:'http://127.0.0.1:5173',
    // origin:"https://fiverr-nest.netlify.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
     credentials:true ,
}))

dotenv.config();

const connect = async () =>{

    try {
        await mongoose.connect(process.env.MONGO);
        console.log("database connected..")
    } catch (error) {
       console.log(error)
    }
}


app.use("/api/auths", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);

if (process.env.NODE_ENV === 'production') {
    const root = path.join(__dirname, 'client', 'dist');
    app.use(express.static(root));
    app.get('*', (req, res) => {
      res.sendFile('index.html', { root });
    })
  }

app.use((err, req, res, next)=>{
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong..."

    return res.status(errorStatus).send(errorMessage);
})

app.listen(PORT, () => {
    console.log("Server is running...")
    connect();
})

