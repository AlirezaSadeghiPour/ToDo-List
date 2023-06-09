const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
app.use(express.json());

app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "todoapp",
});

//sign in and sign up

app.post("/signup", (req, res) => {
  const sql = "Select * FROM user WHERE `email`= ?";
  const values = [req.body.email];
  db.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    if (data.length > 0) return res.json("failed");
    else {
      const sql = "INSERT INTO user (`name`,`email`,`password`) VALUES (?)";
      const values = [req.body.name, req.body.email, req.body.password];
      db.query(sql, [values], (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
      });
    }
  });
});

app.post("/signin", (req, res) => {
  const sql = "Select * FROM user WHERE `email`= ? AND `password` = ?";
  const values = [req.body.email, req.body.password];
  db.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    if (data.length > 0) return res.json({ status: "success", id: data[0].id });
    else {
      const sql = "Select * FROM user WHERE `email`= ? ";
      const values = [req.body.email];
      db.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        if (data.length > 0) return res.json({ status: "wrongpassword" });
        else return res.json({ status: "failed" });
      });
    }
  });
});

//todo

app.get("/user/:user_id", (req, res) => {
  const sql = "SELECT * FROM task  WHERE `user_id` = ?";
  db.query(sql, req.params.user_id, (err, data) => {
    if (err) return console.log(err);
    return res.json(data);
  });
});
app.post("/create", (req, res) => {
  const sql = "INSERT INTO task (`description`,`done`,`user_id`) VALUES (?)";
  const values = [req.body.description, false, req.body.user_id];
  db.query(sql, [values], (err, data) => {
    if (err) return console.log(err);
    return res.json(data);
  });
});

app.put("/edit", (req, res) => {
  const sql = "UPDATE task SET `description` = ? WHERE `task_id` = ?";

  db.query(sql, [req.body.description, req.body.task_id], (err, data) => {
    if (err) return console.log(err);
    return res.json(data);
  });
});

app.delete("/delete/:task_id", (req, res) => {
  const sql = "Delete FROM task WHERE `task_id` = ?";
  db.query(sql, [req.params.task_id], (err, data) => {
    if (err) return res.json("Error");
    return res.json(data);
  });
});

app.put("/editdone", (req, res) => {
  const sql = "UPDATE task SET `done` = ? WHERE `task_id` = ?";

  db.query(sql, [req.body.done, req.body.task_id], (err, data) => {
    if (err) return console.log(err);
    return res.json(data);
  });
});
app.listen(8081, () => console.log("listening"));
