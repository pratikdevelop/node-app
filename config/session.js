const session = require("express-session");

const sessionConfig = session({
  secret: "yourSecretKey",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure: true in production with HTTPS
});

module.exports = sessionConfig;