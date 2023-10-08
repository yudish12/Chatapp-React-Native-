# Chat App using React Native and Nodejs

## Motivation
By building this app I wanted to learn how to learn how I can use socket io library in react native and <br>
how to integrate express.js backend in my app also how to send images in chat

## Description
In this project I have built a Chat App using react native expo cli and also created real time message sending functionality using nodejs and socket.io library.<br>

## Features
<ol>
<li>Real Time message sending using socket io</li>
<li>image sending in chats using expo image picker</li>
<li>Authentication both login and register with protected routes using react navigation</li>
<li>Profile Photo Upload</li>
<li>Add Friends functionality you must be friends on app to chat with each other</li>
</ol>

## How to Install and Run the Project
1)Clone repo into your vscode and first go to root and enter npm install <br>
then go to /Api directory and again type npm install
```
    npm install
    cd /Api
    npm install 
```

### Start Backend Server 
1) First Create your database on mongodb and get your connection url you can refer these urls one by one for it link for it
   https://www.mongodb.com/basics/create-database

https://www.mongodb.com/basics/mongodb-connection-string#:~:text=How%20to%20get%20your%20MongoDB,connection%20string%20for%20your%20cluster.

2) Now create your cloudinary account and get api key,cloud name,secret key

3) Now create a .env file in /Api directory and add these fields   

      | Variable     | Description                        |
      |---------------------------------------------------|
      | MONGO_URI    | connection string of database      |
      | JWT_SECRET   | secret key for jsonwebtoken        |
      | CLOUD_NAME   | cloudinary cloud name              |  
      | API_KEY      | api key for cloudinary             |
      | API_SECRET   | api secret for cloudinary          |

4) now type this command to start backend server
    ```
    node index.js
    ```

### Start Mobile App

1) Install Expo go app on your mobile

2) In root directory run this command in terminal
```
npm start
```
3) Now you will see a scanner scan that qr code using expo go app for android and for ios scan using camera app

4) Now you will be able to see the app in expo go and start using it

### Project Videos

