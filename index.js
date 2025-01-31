const express = require("express");
const mariadb = require("mariadb/callback")
const dotenv = require("../node_module/dotenv/lib/main.js").config();
const app = express();
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();
const session = require("express-session")


app.use(session({
  secret: 'dezone',
  resave: true,
  saveUninitialized: true,
}))
app.use(express.json())

app.use(express.urlencoded({extended: false}))
app.set("view engine", "ejs")

// Imports
const {
  indexController,
  aboutController,
  listUsersController,
  userViewController,
  addUser,
  login,
  userEdit,
  logout,
  loged_in,
} = require("./controllers.js");

const { db } = require("./db.js");

app.set("view engine", "ejs");


// delete
app.get("/userdelete/:id", function (req, res){
  
    const userid = req.params.id;

    const db = mariadb.createConnection({
      host: "localhost",
      user: "root",
      password: "Learned22",
      database: "db",
    });
  
    db.query(`DELETE  FROM mytable WHERE userid = "${userid}" `,(err, result) => {
        
      if(!err){
            res.redirect("/users")
      }else{
        throw err;
      }
    }
  )
  /* db.end(); */
})

// post update
app.post("/edituser", userEdit)


// edit
app.get("/user/:id", function(req, res){

  
   const userid = req.params.id;
      /* console.log(userid) */


  const db = mariadb.createConnection({
    host: "localhost",
    user: "root",
    password: "Learned22",
    database: "db",
  });


db.query("SELECT username, email, password FROM  mytable WHERE userid = ?",[userid], (err, result, fields)=>{
    if(!err){
      res.render("edit", {user: result})
    } 
        else{
      console.log("can't retrive data  and edit because of some  datatbase problem")
    }
  })

  // export the userid 
  module.exports = {userid: userid}
})

// welcome page
app.get("/welcome", (req, res)=>{
  res.sendFile(__dirname + "/welcome.html")
})

// app.get("/", indexController); 
app.get("/", getForm)

app.get('/index', (req, res)=> {
  res.sendFile(__dirname + "/index.ejs")
})

app.get("/about", aboutController);

// add user
app.get("/users/add", getForm)
//app.get("/dezone/src/form.html", getForm)

// post method
app.post('/',encoder, addUser)

// get users with id
app.get("/users/:userid", userViewController);

//users list
app.get("/users", listUsersController);
//app.get("/dezone/views/users.ejs", listUsersController)

// get form
function getForm(req, res){
  res.sendFile(__dirname + "/form.html")
}

// log in 
app.get("/login", login)
app.post("/loged_in", loged_in);

// logout
app.get("/logout", logout)

// profile
app.get("/profile", function (req, res){
  const userid = req.session.userid;
  /* console.log(userid) */
  if(userid){
    
    res.render("profile", {title: 'Express', session: req.session})
  }
  else{
    res.redirect("/login")
  }
  
})


app.listen(3000);
