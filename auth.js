const express = require("express");
const app = express();
const addUser = require("./controllers")
const login = require("./controllers")
const logout = require("./controllers")


app.post("/form", addUser)
app.post("/login", login)
app.get("/logout", logout) 

module.exports = app;