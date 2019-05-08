
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")
const generateRandomString = () => Math.random().toString(36).substring(2, 8);
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
app.post("/urls", (req, res) => {
    console.log(req.body);  // Log the POST request body to the console
    res.send("Ok");         // Respond with 'Ok' (we will replace this)
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


