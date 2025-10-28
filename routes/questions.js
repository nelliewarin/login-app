const express = require("express");
const router = express.Router();
const db = require("../db");

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

// Route to display answered questions
router.get("/questions", (req, res) => {
  db.all("SELECT * FROM questions WHERE answered = 1", (err, rows) => {
    if (err) return res.status(500).send("Database error");
    res.render("questions", { questions: rows, user: req.session.user });
  });
});

// Route to display unanswered questions (admin only)
router.get("/questions/unanswered", isAuthenticated, (req, res) => {
  db.all("SELECT * FROM questions WHERE answered = 0", (err, rows) => {
    if (err) return res.status(500).send("Database error");
    res.render("unanswered_questions", {
      questions: rows,
      user: req.session.user,
    });
  });
});

// Handle asking a new question
router.post("/questions/ask", (req, res) => {
  const { question } = req.body;
  db.run(
    "INSERT INTO questions (question, answer, answered) VALUES (?, '', 0)",
    [question],
    (err) => {
      if (err) console.error(err);
      res.redirect("/questions");
    }
  );
});

// Handle answering a question
router.post("/questions/answer/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;
  db.run(
    "UPDATE questions SET answer = ? WHERE id = ?",
    [answer, id],
    (err) => {
      if (err) console.error(err);
      res.redirect("/questions/unanswered");
    }
  );
});

// Handle editing an answer
router.patch("/questions/answer/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;
  db.run(
    "UPDATE questions SET answer = ? WHERE id = ?",
    [answer, id],
    (err) => {
      if (err) console.error(err);
      res.redirect("/questions");
    }
  );
});

// Handle deleting a question
router.post("/questions/delete/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM questions WHERE id = ?", [id], (err) => {
    if (err) console.error(err);
    res.redirect("/questions");
  });
});

module.exports = router;
