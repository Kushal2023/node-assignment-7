const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const studentArr = require("./InitialData");
const port = 8081;
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// your code goes here

let idCounter = studentArr.length + 1;

app.get("/api/student", async (req, res, next) => {
  res.json(studentArr);
});

app.get("/api/student/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  const student = studentArr.find((student) => student.id === id);
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ message: "Student not found" });
  }
});

app.post("/api/student", async (req, res, next) => {
  const student = req.body;
  const numProperties = Object.keys(student).length;
  if (numProperties < 3) {
    res.status(400).json({ message: "Please provide all required fields" });
  } else if (
    typeof student.name !== "string" ||
    typeof student.currentClass !== "number" ||
    typeof student.division !== "string"
  ) {
    res.status(400).json({ message: "Please provide all required fields" });
  } else {
    student.id = idCounter++;
    studentArr.push({ id: student.id, ...student });
    res.json(student.id);
  }
});

app.put("/api/student/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  const studentIndex = studentArr.findIndex((s) => s.id === id);
  if (studentIndex === -1) {
    res.sendStatus(400);
  } else if (!name) {
    res.sendStatus(400);
  } else {
    studentArr[studentIndex].name = name;
    res.sendStatus(200);
  }
});

app.delete("/api/student/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const studentIndex = studentArr.findIndex((s) => s.id === id);
  if (studentIndex === -1) {
    res.sendStatus(404);
  } else {
    studentArr.splice(studentIndex, 1);
    res.sendStatus(200);
  }
});

// console.log(studentArr);

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
