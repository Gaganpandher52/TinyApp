
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")
const generateRandomString = () => Math.random().toString(36).substring(2, 8);

//database stores all the shortUrls and longUrls
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
//this objects store username and passwords
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

//this route geneates a random id for the user input url
app.post("/urls", (req, res) => {
  console.log(req.body);
  let random = generateRandomString();
  let longUrl = req.body.longURL;
  urlDatabase[random] = longUrl;
  console.log(urlDatabase);   
  res.redirect("/urls"); 
  });

//this route deletes the url from the database
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls"); 
  });

//this route handles the login of the user
app.post("/login", (req, res) => {
  const stuff = req.body.username;
  res.cookie('username',stuff)
  res.redirect("/urls"); 
  });

//this route handles the logout of the user and rediredts
app.post("/logout", (req, res) => {
  //const stuff = req.body.username;
  res.clearCookie('username');
  res.redirect("/urls"); 
  });

app.post("/urls/:shortURL", (req, res) => {
  let short = req.params.shortURL;
  let long = req.body.longURL;
  urlDatabase[short] = long;
  res.redirect("/urls"); 
  });

//this route for registration page
app.get("/register", (req, res) => {
  res.render("urls_registration");
});

//this route saves the user made id to the users object
app.post("/register", (req, res) => {
  console.log(req.body);
  const newId = generateRandomString();
  const newEmail = req.body.email;
  const newPassword = req.body.password;
  users[newId] = {id :newId,email : newEmail,password : newPassword};
  console.log(users);
  });


app.get("/u/:shortURL", (req, res) => {
  const shortLink = req.params.shortURL;
  const longUR = urlDatabase[shortLink];
  res.redirect(longUR);
});
app.get("/urls/new", (req, res) => {
  let templateVars = {
  username: req.cookies["username"],};
  res.render("urls_new",templateVars);
  });

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
  });

app.get("/urls", (req, res) => {
  let templateVars = {URL: urlDatabase,
    username: req.cookies["username"],};
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortU = req.params.shortURL;
  let templateVars = { shortURL: shortU, longURL: urlDatabase[shortU], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
  });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


