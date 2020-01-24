const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const hbs = require("express-handlebars");
const express = require("express");

const app = express();

app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/",
    defaultLayout: "index"
  })
);

app.set("views", __dirname + "/views");

app.set("view engine", "hbs");

require("dotenv").config();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const port = 8080;

app.listen(port, () => {
  console.log(`Server Runing On Port ${port}`);
});

const mongoKey = process.env.MONGOKEY;
const mongoUsr = process.env.MONGOUSR;
const mongoCluster = process.env.MONGOCLUSTER;

const uri = `mongodb+srv://${mongoUsr}:${mongoKey}@${mongoCluster}`;
const client = new MongoClient(uri, { useNewUrlParser: true });

app.get("/", (req, res) => {
  res.render("main", { layout: "index" });
  res.statusCode = 200;
});

app.get("/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "styles.css"));
  res.statusCode = 200;
});

app.get("/login", (req, res) => {
  res.render("login", { layout: "index" });
  res.statusCode = 200;
});

app.get("/signin", (req, res) => {
  res.render("signin", { layout: "index" });
  res.statusCode = 200;
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
    userName: req.body.usrName,
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
        res.statusMessage = "Insert Error";
        res.statusCode = 400;
        return;
      }

      console.log("Added a user");
      res.redirect("/");
      res.statusCode = 200;
    });
    client.close();
  });
});

app.post("/log", (req, res) => {
  client.connect((err, db) => {
    if (err) {
      console.log("cannot connect db" + err);
      res.statusMessage = "Insert Error";
      res.statusCode = 400;
      return;
    }
    console.log("DataBase connection made successfully");

    const collection = db.db().collection("UserData");

    const mail = req.body.usrMail;
    const password = req.body.usrPassword;

    collection.findOne({ email: mail }, (err, doc) => {
      if (err) {
        console.log("cannot make query" + err);
        res.statusMessage = "Insert Error";
        res.statusCode = 400;
        return;
      }
      let savedPass = doc.password;
      let savedSalt = doc.salt;

      const hashPassword = password => {
        this.hash = crypto
          .pbkdf2Sync(password, savedSalt, 1000, 64, `sha512`)
          .toString(`hex`);

        var hash = crypto
          .pbkdf2Sync(password, savedSalt, 1000, 64, `sha512`)
          .toString(`hex`);

        return hash;
      };

      let hashedPassword = hashPassword(password);

      if (hashedPassword === savedPass) {
        console.log("LogIn made successfully!");
        const payload = {
          check: true
        };
        const jwtPass = process.env.JWTPASSWORD;
        const token = jwt.sign(payload, jwtPass, {
          expiresIn: 1440
        });

        console.log({
          token: token
        });
        res.redirect("/");
        res.statusCode = 200;
      }
    });
    client.close();
  });
});

const protectedRoutes = express.Router();
protectedRoutes.use((req, res, next) => {
  const token = req.headers["access-token"];
  const jwtPass = process.env.JWTPASSWORD;
  if (token) {
    jwt.verify(token, jwtPass, (err, decoded) => {
      if (err) {
        return res.json({ message: "Invalid Token" });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.send({
      message: "There is no Token."
    });
  }
});
/*
app.get("/data", protectedRoutes, (req, res) => {
  const data = [
    { id: 1, nombre: "Asfo" },
    { id: 2, nombre: "Denisse" },
    { id: 3, nombre: "Carlos" }
  ];

  res.json(data);
});
*/

app.post("/search", (req, res) => {
  const user = req.body.userName;
  client.connect((err, db) => {
    if (err) {
      console.log("cannot connect db" + err);
      return;
    }
    console.log("DataBase connection made successfully");
    const collection = db.db().collection("UserData");

    const printSearch = user => {
      res.render("main", {
        layout: "index",
        users: user
      });
    };

    const search = user => {
      collection
        .find(
          { userName: { $regex: `.*${user}.*`, $options: "i" } },
          { userName: 1 }
        )
        .toArray((err, docs) => {
          if (!err) printSearch(docs);
        });
    };

    search(user);
  });
});
