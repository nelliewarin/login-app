const express = require("express");
const expressHandlebars = require("express-handlebars");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Handlebars setup
app.engine("handlebars", expressHandlebars.engine());
app.set("view engine", "handlebars");

// Routes
app.get("/", (req, res) => {
  res.render("home", { title: "Home Page" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
