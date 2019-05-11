
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
  const user_id = req.cookies["user_id"];// new added
  let random = generateRandomString();
  let longUrl = req.body.longURL;
  if(!user_id){
    return res.send('Please sign in to create urls');
  }else{
  urlDatabase[random] = {longURL:longUrl,userID:user_id};
  res.redirect("/urls"); 
  }
  console.log(urlDatabase);   
  //res.redirect("/urls"); 
  });

//this route deletes the url from the database
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls"); 
  });

app.post("/login", (req, res) => {
  
  const newEmail = req.body.email;
  const newPassword = req.body.password;
  const userID = find(newEmail);

  function find(newEmail){
    for (const i in users) {
      if (newEmail === users[i].email) {
        return i;
      }
    }
  }
  if(!userID){
    res.send("PLEASE ENTER EMAIL AND PASSWORD");
  }
  else if(newPassword !== users[userID].password){
    res.send("PLEASE ENTER EMAIL AND PASSWORD");
  }
  else{
    res.cookie('user_id',users[userID].id);
    res.redirect('/urls');
  }
  // if(!newEmail || !newPassword){
  //   return res.send("PLEASE ENTER EMAIL AND PASSWORD");
  // }  
  // for(i in users){
  //   if(users[i].email === newEmail && users[i].password === newPassword){
  //     res.cookie('user_id',i);//cookie working stores id
  //     return res.redirect('/urls');
  //   }
  //   else{
  //     return res.send('ENTER CORRECT EMAIL AND PASSWORD CONNECTION ERROR 403');
  //   }
  // }//for
  });

app.get("/login", (req, res) => {
  const user_id = req.cookies["user_id"]
  let templateVars = {
    URL: urlDatabase,
    user_id: user_id,
    email: users[user_id] 
  };
  //res.cookie('new_id',new_id)
  res.render("urls_login",templateVars); 
  });

//this route handles the logout of the user and rediredts
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/login"); 
  });

app.post("/urls/:shortURL", (req, res) => {
  let short = req.params.shortURL;
  let long = req.body.longURL;
  urlDatabase[short] = long;
  res.redirect("/urls"); 
  });

//this route for registration page
app.get("/register", (req, res) => {
  const user_id = req.cookies["user_id"];
  let templateVars = {
    user_id: user_id,
    email: users[user_id] && users[user_id].email || null
  };
  res.render("urls_registration",templateVars);
});

//this route saves the user made id to the users object
app.post("/register", (req, res) => {
  //console.log(req.body);
  const newId = generateRandomString();
  const newEmail = req.body.email;
  const newPassword = req.body.password;
  let exit = false;
  for(i in users){
    if(users[i].email === newEmail){
      exit = true;
    }
  }//for
  if(!newEmail || !newPassword){
    return res.send("PLEASE ENTER EMAIL AND PASSWORD");
    //res.redirect("/register")
  }
  else if(exit){
    return res.send("CONNECTION STATUS 403")
  }
  //users[newId] = {id :newId, email : newEmail, password : newPassword};
  res.cookie('user_id',newId);//cookie working stores id
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
  const user_id = req.cookies["user_id"];
  let templateVars = {
    user_id: user_id,
    email: users[user_id] && users[user_id].email || null 
  };
  res.render("urls_new",templateVars);
  });

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
  });

app.get("/urls", (req, res) => {
  const user_id = req.cookies.user_id;
  const idForUser = urlForUsers(user_id);
  let templateVars = {
    //URL: urlDatabase,
    user_id: user_id,
    email: users[user_id] && users[user_id].email || null,
    idFor: idForUser
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortU = req.params.shortURL;
  const user_id = req.cookies["user_id"];
  let templateVars = { shortURL: shortU,
    longURL: urlDatabase[shortU].longURL,
    user_id: req.cookies["user_id"],
    email: users[user_id] && users[user_id].email || null };
  res.render("urls_show", templateVars);
  });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function urlForUsers(id){
  let empty = {};
  for(let i in urlDatabase){
    if(id === urlDatabase[i].userID){
      empty[i] = urlDatabase[i];
    }
  }  
  return empty;
}

// function urlsForUser(userID){
//   let userURLs = {};
//   for (let urlId in urlDatabase){
//     let url = urlDatabase[urlId];
//     if (url.userID === userID){
//       userURLs[urlId] = url;
//     }
//   }
//   return userURLs;
//  }


