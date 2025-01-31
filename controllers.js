const express = require("express");
const app = express();
const mariadb = require("mariadb/callback");
// const bcrypt = require("bcrypt"); 
const bodyParser = require("body-parser");

// functions but not important
function indexController(req, res) {
  res.render("index");
}

function aboutController(req, res) {
  res.render("about", { show: false });
}

function login(req, res){
  res.render("login")
};

// users list
function getUsers(req, res) {
  const db = mariadb.createConnection({
    host: "localhost",
    user: "root",
    password: "Learned22",
    database: "db",
  });

  db.query("SELECT * from mytable", (err, rows, meta) => {
    if (!err) {
      res.render("users", { users: rows });
    } else {
      console.log(err);
      res.render("users", { users: null });
    }

    db.end();
  });
}

// add user
function addUser(req, res){

  const db = mariadb.createConnection({
    host: "localhost",
    user: "root",
    password: "Learned22",
    database: "db",
  });

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
  
  db.query("INSERT INTO mytable value(?,?, ?, ?)", [null,username,email,password], (err, resp) =>{

      if(!err){
        res.redirect("/login");
    }
    else if(err){
      throw err
    }
      res.end()
  })
};


  // users detail
function getUser(req, res) {
  const userId = req.params.userid;

  const db = mariadb.createConnection({
    host: "localhost",
    user: "root",
    password: "Learned22",
    database: "db",
  });

  db.query("SELECT userid, username FROM mytable WHERE  userid = (?)",[userId],
    (err, rows, meta) => {
      if (!err) {
        res.render("user_detail", { user: rows});
        console.log(rows);
      } else {
        console.log(err);
        res.render("users", { users: null });
      }
      db.end();
    }
  );
}


// loged_in
function loged_in(req, res){

  const email = req.body.email;
  const password = req.body.password;

  if(email && password){

    const db = mariadb.createConnection({
      host: "localhost",
      user: "root",
      password: "Learned22",
      database: "db",
    });
  
    db.query(`SELECT * FROM mytable WHERE  email = "${email}" `,
      (err, data) => {

        if(data.length > 0){
            for(let count = 0; count < data.length; count++){
              if(data[count].password == password){
                req.session.userid = data[count].userid;
                res.redirect("/profile")
              }else{
               /*  res.send(' Incorret Password') */
                res.redirect("/login")
              }
            }
        }else{
          /* res.send(' Incorret Email address') */
          res.redirect("/login")
        }
        res.end();  
      })

  }else{
    res.send('Please enter Email address and Password details');
    res.end();
  }
  
}

// logout
function logout(req, res){
  req.session.destroy();
  res.redirect("/login")
}

// edit
function userEdit(req, res){
  
  const id = require("./index")
  const userid = id.userid;
  /* console.log(userid) */


const username = req.body.username;
const email = req.body.email;
const password = req.body.password;

/* console.log(username)
console.log(email)
console.log(password ) */


  const db = mariadb.createConnection({
    host: "localhost",
    user: "root",
    password: "Learned22",
    database: "db",
  });

  db.query(`UPDATE mytable SET username = "${username}", email = "${email}", password = "${password}" WHERE userid = "${userid}" `,(err, result) => {
      
    if(!err){
          res.redirect("/users")
    }else{
      throw err
  }}
)
/* db.end(); */
};

// Modules
module.exports = {
  indexController: indexController,
  aboutController: aboutController,
  listUsersController: getUsers,
  userViewController: getUser,
  addUser: addUser,
  login: login,
  userEdit: userEdit,
  loged_in: loged_in,
  logout: logout,
};
