const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const dns = require('node:dns/promises');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();

const { connectToMongoDB } = require("./connect");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const URL = require("./models/url.model.js");
const mongoose = require('mongoose');

const urlRoute = require("./routes/url.route.js");
const staticRoute = require("./routes/staticRouter.js");
const userRoute = require("./routes/user.route.js");

const app = express();
const PORT = 3000;


connectToMongoDB(process.env.MONGODB ?? "mongodb+srv://aqeeb05:aqeeb005@backend-db.10dc9ek.mongodb.net/?appName=backend-DB").then(() =>
  console.log("Mongodb connected"))
  .catch((err) => console.log("Database Connection Error:", err))
  ;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    },
    { new: true }
  );
  if (!entry) return res.status(404).send("URL not found");
res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));