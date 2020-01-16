const path = require("path");

const MongoClient = require("mongodb").MongoClient;

const bodyParser = require("body-parser");

const express = require("express");

const app = express();

require("dotenv").config();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const port = 8080;

const mongoKey = process.env.MONGOKEY;
console.log("key:");
console.log(mongoKey);

const uri = `mongodb+srv://f2bear:${mongoKey}@firstcluster-sw9w7.mongodb.net/GetForm`;
const client = new MongoClient(uri, { useNewUrlParser: true });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/new", (req, res) => {
  let myObj = {
    name: req.body.usrName,
    email: req.body.usrMail,
    age: req.body.usrAge,
    password: req.body.usrPassword
  };
  client.connect((err, db) => {
    if (err) {
      console.log("cannot connect db" + err);
      return;
    }
    console.log("DataBase connection made successfully");
    const collection = db.db().collection("UserData");

    collection.insertOne(myObj, function(err, r) {
      if (err) {
        console.log("cannot add obj");
        return;
      }

      console.log("Added a user");
      res.redirect("/");
    });
    client.close();
  });
});

app.listen(port, () => {
  console.log(`Server Runing On Port ${port}`);
});
