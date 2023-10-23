const express = require('express');
const https = require('https');
const socketIo = require('socket.io');
var fs = require('fs');
const app = express();
const path = require('path');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
var request = require('request');
const bcrypt = require("bcryptjs");
const saltRounds = 10;
var cookieParser = require('cookie-parser');
var cookieEncrypter = require('cookie-encrypter');
require('dotenv').config();

const secretKey = process.env.SECRETKEY;

// Using an encryption key to encode and decode cookies
app.use(cookieParser(secretKey));
app.use(cookieEncrypter(secretKey));

// Configuring Node.js to use the EJS template engine and setting the "views" folder for template files
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Creating an HTTPS server with SSL certificates
const server = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'security', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'security', 'cert.pem'))
}, app);

// Setting up Socket.IO with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: "https://localhost:8000",
    methods: ["GET", "POST"]
  }
});

// Handling the '/login' route for GET requests
app.get('/login', (req, res) => {
  // Serving an HTML page for customer care agents
  res.sendFile(__dirname + '/views/login.html');
});

// Handling the '/login' route for POST requests (user authentication)
app.post('/login', (req, res) => {
  // Retrieving and processing user login data
  console.log(req.body);

  username = req.body.username;
  password = req.body.password;
  request({
    url: 'http://admin:admin@couchdb:5984/customer-care/_all_docs?include_docs=true&limit=100',
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    },
  }, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      var data = JSON.parse(body);
      console.log(data);
      for (var i = 0; i < data.total_rows; i++) {
        if (data.rows[i].doc.username === username) {
          var userHash;
          // Hashing the provided password for comparison
          bcrypt
            .hash(password, saltRounds)
            .then(hash => {
              userHash = hash;
              console.log('Hash ', userHash);
              // Comparing the hashed password with the stored password
              bcrypt
                .compare(password, data.rows[i].doc.password)
                .then(res1 => {
                  console.log(res1); // Returns true if passwords match
                  if (!res1) res.redirect('/login');
                  else res.redirect('/support');
                })
                .catch(err => console.error(err.message));
            })
            .catch(err => console.error(err.message));
          return;
        }
      }
      res.redirect('/login');
    }
  });
});

// Handling the '/support' route for GET requests
app.get('/support', (req, res) => {
  // Rendering the EJS template with activeUsers and serving it
  const activeUsersArray = Array.from(activeUsers).map((user) => user.username);
  res.render('support.ejs', { activeUsers: activeUsersArray });
});

const activeUsers = new Set(); // Storing active user connections

// Handling socket.io connections
io.on('connection', (socket) => {
  sendUpdatedUserListToSupport(); // Sending the updated user list to /support after adding the user

  console.log(socket.id);
  socket.on('sendUsername', (username) => {
    console.log('Received username:', username);
    console.log('A user connected');
    for (const userSocketObj of activeUsers) {
      if (userSocketObj.username === username) {
        activeUsers.delete(userSocketObj);
      }
    }
    activeUsers.add({ username, socket_id: socket.id }); // Adding the user's socket ID to the active users set
    console.log(activeUsers);
    sendUpdatedUserListToSupport(); // Sending the updated list to /support after adding the user
  });

  if (socket.handshake.headers.origin === 'https://localhost:8000') {
    // Code for handling regular user connections
  } else {
    console.log('A customer care agent connected.');
    const usernamesArray = Array.from(activeUsers).map(user => user.username);
    io.emit('updateUserList', usernamesArray);
  }

  socket.on('chatMessage', (message) => {
    // Broadcasting the message to all connected users
    io.emit('chatMessage', message);
  });

  socket.on('disconnect', () => {
    if (socket.handshake.headers.origin === 'https://localhost:8000') {
      console.log('A user disconnected');
      // Removing the user's socket ID from the active users set
      objToDelete = getUserAndSocketBySocketId(socket.id, activeUsers);
      console.log(objToDelete);
      activeUsers.delete(objToDelete);
      console.log(activeUsers);
      sendUpdatedUserListToSupport(); // Sending the updated list to /support after removing the user
    } else {
      console.log('A customer care agent disconnected.');
    }
  });

  // Function to send the updated user list to /support
  function sendUpdatedUserListToSupport() {
    const usernamesArray = Array.from(activeUsers).map(user => user.username);
    io.of('/support').emit('updateUserList', usernamesArray);
  }
});

// Function to retrieve a user and socket by socket ID
function getUserAndSocketBySocketId(socketId, activeUsersSet) {
  for (const userSocketObj of activeUsersSet) {
    if (userSocketObj.socket_id === socketId) {
      return userSocketObj; // Returning the found user object
    }
  }
  return null; // Returning null if not found
}

// Handling the '/activeUsers' route for GET requests
app.get('/activeUsers', (req, res) => {
  const usersArray = Array.from(activeUsers);
  res.json(usersArray);
});

// Starting the server on port 3000
server.listen(3000, () => {
  console.log('Customer care server is running on port 3000');
});
