const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const http = require('http');
const localStrategy = require("passport-local").Strategy;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const User = require("./models/user");
const Message = require("./models/message");
var bodyParser = require("body-parser");
const multer = require("multer");
var cloudinary = require("cloudinary").v2;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { Server } = require("socket.io");

app.use(cors());


const server = http.createServer(app);


const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("disconnect", (reason) => {
    console.log(reason,23)
  });

  socket.on('message',(data)=>{
    console.log(data,35);
    io.emit("message recieved", data);
  })

});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

const jwt = require("jsonwebtoken");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection Successful"))
  .catch((e) => console.log("DB connection Failed", e));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

// app.get("/register",(req,res)=>res.send("sad"))

//funtion to create token
const createToken = (userId) => {
  const payload = {
    userId: userId,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
  return token;
};

app.post("/register", upload.single("image"), async (req, res) => {
  try {
    const imageData = req.file.buffer.toString("base64");
    const { username, email, password } = req.body;
    // console.log(imageData.substring(1,10),123)
    const imageCloudData = await cloudinary.uploader.upload(
      "data:image/jpeg;base64," + imageData
    );
    const newUser = new User({
      username,
      email,
      password,
      image: imageCloudData.url,
    });
    const data = await newUser.save();
    res.status(200).json({
      message: "user Registered Successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error Registering the User",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    console.log("asd");
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }
    const token = createToken(user._id);
    return res.status(200).json({
      message: "Logged In Successfully",
      user,
      token,
    });
  } catch (error) {
    console.log("error");
    res.status(500).json({
      message: "Error Registering the User",
    });
  }
});

app.get("/users/:userId", async (req, res) => {
  try {
    const token = req.params.userId;

    const { userId } = await jwt.verify(token, process.env.JWT_SECRET);
    const userData = await User.find({ _id: { $ne: userId } });
    res.status(200).json({ data: userData });
  } catch (error) {
    console.log("error", error);
    res.status(404).json({ message: "asndk" });
  }
});

app.get("/me/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { userId } = await jwt.verify(token, process.env.JWT_SECRET);
    const userInfo = await User.findById(userId);
    res.status(200).json({ userInfo: userInfo });
  } catch (error) {
    console.log(error, 1234);
  }
});

app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userInfo = await User.findById(userId);
    res.status(200).json({ userInfo: userInfo });
  } catch (error) {
    console.log(error, 1234);
  }
});

app.post("/friend-request", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;
  const { userId } = await jwt.verify(currentUserId, process.env.JWT_SECRET);
  try {
    const isAlreadySent = await User.find({
      _id: userId,
      sentFriendRequests: selectedUserId,
    });
    if (isAlreadySent.length > 0) {
      return res.status(403).json({
        message: "Friend Request Already Sent",
      });
    }
    await Promise.all([
      User.findByIdAndUpdate(userId, {
        $push: { sentFriendRequests: selectedUserId },
      }),
      User.findByIdAndUpdate(selectedUserId, {
        $push: { freindRequests: userId },
      }),
    ]);

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

app.get("/friend-request/:token", async (req, res) => {
  const { token } = req.params;
  const { userId } = await jwt.verify(token, process.env.JWT_SECRET);
  try {
    const requests = await User.findById(userId)
      .populate("freindRequests")
      .populate("friends")
      .populate("sentFriendRequests");
    return res.status(200).json({ requests: requests });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

//endpoint to accept a friend-request of a particular person

app.post("/friend-request/accept", async (req, res) => {
  try {
    const { token, senderId } = req.body;
    const { userId } = await jwt.verify(token, process.env.JWT_SECRET);
    const recepientId = userId;
    //retrieve the documents of sender and the recipient
    const [sender, recepient] = await Promise.all([
      User.findById(senderId),
      User.findById(recepientId),
    ]);

    sender.friends.push(recepientId);
    recepient.friends.push(senderId);

    recepient.freindRequests = recepient.freindRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );

    sender.sentFriendRequests = sender.sentFriendRequests.filter(
      (request) => request.toString() !== recepientId.toString
    );

    await Promise.all([sender.save(), recepient.save()]);

    res.status(200).json({ message: "Friend Request accepted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/chatlist/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { userId } = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId).populate("friends");
    const acceptedFriends = user.friends;
    res.json(acceptedFriends);
  } catch (error) {
    console.log("error", error);
    res.sendStatus(500);
  }
});

app.post("/message", upload.single("image"), async (req, res) => {
  try {
    const { token } = req.body;
    const { userId } = await jwt.verify(token, process.env.JWT_SECRET);
    const {recepientId,messageType,messageText} = req.body;
    let imageData,imageCloudData;
    if(messageType==="image"){
      imageData = req.file.buffer.toString("base64");
    
      imageCloudData = await cloudinary.uploader.upload(
        "data:image/jpeg;base64," + imageData
      );
    }
    

    const newMessage = await Message.create({
      senderId:userId,
      recepientId,
      messageType,
      message:messageText,
      imageUrl:imageCloudData?.url,
      timeStamp: new Date()
    })

    res.status(200).json({
      newMessage
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"unable to send message"});
  }
});

//fetch messages
app.get('/messages/:token/:recepientId',async(req,res)=>{
  try {
    const {token,recepientId} = req.params;
    const {userId} = await jwt.verify(token,process.env.JWT_SECRET);
    const messages = await Message.find({
      $or:[
        {senderId:userId,recepientId:recepientId},
        {senderId:recepientId,recepientId:userId}
      ]
    }).populate('senderId','_id username');
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"unable to fetch messages"});
  }
})

server.listen(port, () => {
  console.log("Server Started");
});
