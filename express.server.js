
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
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
    console.log(urlDatabase);    // Log the POST request body to the console 
    res.redirect("/urls"); // Respond with 'Ok' (we will replace this)
  });
app.get("/u/:shortURL", (req, res) => {
  const longURL = "/urls"
  res.redirect(longURL);
});
app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  });

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

app.get("/urls", (req, res) => {
    let templateVars = {URL: urlDatabase};
    res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
    const shortU = req.params.shortURL;
    let templateVars = { shortURL: shortU, longURL: urlDatabase[shortU] };
    res.render("urls_show", templateVars);
  });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


