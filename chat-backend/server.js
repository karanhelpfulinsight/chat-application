const express = require('express')
const http = require("http");
const cors = require("cors");
const dbMethod = require("./config/dbConfig")
const userRouter = require("./routes/userRoutes")
const chatRouter = require("./routes/chatRoutes")
const messageRouter = require("./routes/messageRoutes")
var cookieParser = require('cookie-parser')
const { initSocket } = require('./socket')
const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // your frontend URL
    credentials: true // this is important for cookies
  }));
app.use(cookieParser())
app.use(express.json())

app.use("/user", userRouter)
app.use("/chat", chatRouter)
app.use("/message", messageRouter)


const server = http.createServer(app);
initSocket(server)
app.listen(5000, () => {
    console.log('Server is running on port 3000')
})