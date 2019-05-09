
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")
const generateRandomString = () => Math.random().toString(36).substring(2, 8);
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
app.post("/urls", (req, res) => {
  console.log(req.body);
  let random = generateRandomString();
  let longUrl = req.body.longURL;
  urlDatabase[random] = longUrl;
  console.log(urlDatabase);   
  res.redirect("/urls"); 
  });

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls"); 
  });

  //handles the login 
app.post("/login", (req, res) => {
  const stuff = req.body.username;
  res.cookie('username',stuff)
  res.redirect("/urls"); 
  });
//handles the logout
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


