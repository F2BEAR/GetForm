const path = require("path");

const MongoClient = require("mongodb").MongoClient;

const bodyParser = require("body-parser");

const crypto = require("crypto");

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
const mongoUsr = process.env.MONGOUSR;
const mongoCluster = process.env.MONGOCLUSTER;

const uri = `mongodb+srv://${mongoUsr}:${mongoKey}@${mongoCluster}`;
const client = new MongoClient(uri, { useNewUrlParser: true });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "styles.css"));
});

app.post("/new", (req, res) => {
  const password = req.body.usrPassword;

  const hashPassword = password => {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
      .toString(`hex`);

    var hash = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
      .toString(`hex`);

    return hash;
  };

  let hashedPassword = hashPassword(password);

  let myObj = {
    name: req.body.usrName,
    email: req.body.usrMail,
    age: req.body.usrAge,
    password: hashedPassword,
    salt: this.salt
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
