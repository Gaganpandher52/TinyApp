//npm modules
const express = require("express");
const app = express();
const PORT = 5000; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")
app.use(cookieSession({
  name: 'session',
  keys: ["key1"],
  maxAge: 24 * 60 * 60 * 1000 
}));

//this function return a 6 chars long random string
const generateRandomString = () => Math.random().toString(36).substring(2, 8);
//helper method helps with finding email
function find(newEmail){
  for (const i in users) {
    if (newEmail === users[i].email) {
      return i;
    }
  }
}
//this function return login users own links
function urlForUsers(id){
  let empty = {};
  for(let i in urlDatabase){
    if(id === urlDatabase[i].userID){
      empty[i] = urlDatabase[i];
    }
  }  
  return empty;
}


//database stores all the shortUrls and longUrls and userID
const urlDatabase = {
  "b2xVn2": {longURL:"http://www.lighthouselabs.ca",userID:'userRandomID'},
  "9sm5xK": {longURL:"http://www.google.com",userID:'userRandomID'},
  "8am5xK": {longURL:"http://www.google.com",userID:'userRandomID'},
  "7bm5xK": {longURL:"http://www.google.com",userID:'userRandomID'}
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
  const user_id = req.session["user_id"];// new added
  let random = generateRandomString();
  let longUrl = req.body.longURL;
  if(user_id === null){
    return res.redirect("/register");
  }else{
  urlDatabase[random] = {longURL:longUrl,userID:user_id};
  return res.redirect("/urls"); 
  }
  console.log(urlDatabase);   
  });

//this route deletes the url from the database
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls"); 
  });

//this route handles the login logic
app.post("/login", (req, res) => {
  const newEmail = req.body.email;
  const newPassword = bcrypt.hashSync(req.body.password, 10);
  const userID = find(newEmail);

  if(!userID){
    res.send("PLEASE ENTER EMAIL AND PASSWORD");
  }
  else if(bcrypt.compareSync(newPassword, users[userID].password)){
    res.send("PLEASE ENTER EMAIL AND PASSWORD");
  }
  else{
    req.session.user_id = userID;
    res.redirect('/urls');
  }
  });

//this route renders the login page 
app.get("/login", (req, res) => {
  const user_id = req.session["user_id"]
  let templateVars = {
    URL: urlDatabase,
    user_id: user_id,
    email: users[user_id] 
  };
  res.render("urls_login",templateVars); 
  });

//this route handles the logout of the user and rediredts
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login"); 
  });

// this route handles the new urls
app.post("/urls/:shortURL", (req, res) => {
  const short = req.params.shortURL;
  console.log("short",short);
  const long = req.body.longURL;
  urlDatabase[short].longURL = long;
  console.log(urlDatabase);
  res.redirect("/urls/"); 
  });

//this route for registration page
app.get("/register", (req, res) => {
  const user_id = req.session.user_id;
  let templateVars = {
    user_id: user_id,
    email: users[user_id] && users[user_id].email || null
  };
  res.render("urls_registration",templateVars);
});

//this route saves the user made id to the users object
app.post("/register", (req, res) => {

  const newId = generateRandomString();
  const newEmail = req.body.email;
  const newPassword = bcrypt.hashSync(req.body.password, 10);
  let exit = false;
  for(i in users){
    if(users[i].email === newEmail){
      exit = true;
    }
  }//for
  if(!newEmail || !newPassword){
    return res.send("PLEASE ENTER EMAIL AND PASSWORD");
  }
  else if(exit){
    return res.send("CONNECTION STATUS 403")
  }
  
  req.session.user_id = newId;//cookie working stores id
  res.redirect('/urls');
  users[newId] = {id :newId, email : newEmail, password : newPassword};
  console.log(users);
  });

app.get("/u/:shortURL", (req, res) => {
  const shortLink = req.params.shortURL;
  const longUR = urlDatabase[shortLink];
  res.redirect(longUR);
});

app.get("/urls/new", (req, res) => {
  const user_id = req.session.user_id;
  let templateVars = {
    user_id: user_id,
    email: users[user_id] && users[user_id].email || null 
  };
  res.render("urls_new",templateVars);
  });

app.get("/", (req, res) => {
    return res.redirect("/register");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
  });

//this route render the main urls page
app.get("/urls", (req, res) => {
  const user_id = req.session.user_id;
  const idForUser = urlForUsers(user_id);
  let templateVars = {
    user_id: user_id,
    email: users[user_id] && users[user_id].email || null,
    idFor: idForUser
  };
  res.render("urls_index", templateVars);
});

// this route render the update url page
app.get("/urls/:shortURL", (req, res) => {
  const shortU = req.params.shortURL;
  const user_id = req.session.user_id;
  let templateVars = { shortURL: shortU,
    longURL: urlDatabase[shortU].longURL,
    user_id: req.session.user_id,
    email: users[user_id] && users[user_id].email || null};
  res.render("urls_show", templateVars);
  });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});





