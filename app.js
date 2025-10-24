const express = require("express");
const expressHandlebars = require("express-handlebars");
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const ADMIN_USER = {
  username: "admin",
  passwordHash: bcrypt.hashSync("password123", 10),
};

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "superSecretKey",
    resave: false,
    saveUninitialized: false,
  })
);

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

// Handlebars setup
app.engine("handlebars", expressHandlebars.engine());
app.set("view engine", "handlebars");

// Routes
app.get("/", (req, res) => {
  res.render("home", { title: "Home Page" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (
    username === ADMIN_USER.username &&
    (await bcrypt.compare(password, ADMIN_USER.passwordHash))
  ) {
    req.session.user = username;
    return res.redirect("/admin");
  }
  res.render("login", { title: "Login", error: "Invalid credentials" });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.get("/admin", isAuthenticated, (req, res) => {
  res.render("admin", { title: "Admin Dashboard", user: req.session.user });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
