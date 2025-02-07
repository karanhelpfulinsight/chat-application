const express = require('express');
const http = require("http");
const cors = require("cors");
const dbMethod = require("./config/dbConfig");
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const messageRouter = require("./routes/messageRoutes");
const cookieParser = require('cookie-parser');
const { initSocket } = require('./socket');

const app = express();
const server = http.createServer(app);  // Create server first

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);
const io = initSocket(server);

server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
