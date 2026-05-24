const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const URL = require("./models/url.model.js");

const urlRoute = require("./routes/url.route.js");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user.route.js");

const app = express();
const PORT = 8001;

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
    }
  );
  if (!entry) return res.status(404).send("URL not found");
  res.redirect(entry.redirectURL);
});

// 1. Changed localhost to 127.0.0.1
// 2. Moved app.listen inside the .then() block
// connectToMongoDB(process.env.MONGODB ?? "mongodb://127.0.0.1:27017/short-url")
//   .then(() => {
//     console.log("Mongodb connected");
//     app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
//   })
//   .catch((err) => {
//     console.error("Failed to connect to MongoDB", err);
//   });


  mongoose.connect("mongodb+srv://aqeeb05:aqeeb005@backend-db.10dc9ek.mongodb.net/?appName=backend-DB")
      .then(() => {
          console.log("connected to database");
          app.listen(PORT, () => {
              console.log(`Server running at http://localhost:${PORT}`);
          })
      })
      .catch((error) => {
          console.log("connection failed", error);
      });
  