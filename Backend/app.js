const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
var compression = require('compression')
var cors = require("cors");

const app = express();
app.use(compression())
app.use(express.json());
app.disable("x-powered-by");
app.use(morgan("dev"));
const WEB =
  process.env.NODE_ENV === "production"
    ? "https://codejoyfe.me"
    : "http://localhost:8000";
app.use(cors({ credentials: true, origin: WEB }));
app.use(cookieParser());
// const csrfProtection = csrf({
//     cookie: true
//   });
const auth = require("./middleware/authDeveloper.mdw");

app.get("/", function (req, res) {
  res.json("Running....");
});

app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/token", auth, require("./routes/token.route"));
app.use("/api/creator", auth, require("./routes/creator.route"));
app.use("/api/practice", auth, require("./routes/practice.route"));
app.use("/api/test", auth, require("./routes/test.route"));
app.use("/api/submissions", auth, require("./routes/submissions.route"));
app.use("/api/search", auth, require("./routes/search.route"));
app.use("/api/developer", auth, require("./routes/developer.route"));
app.use("/api/session", auth, require("./routes/session.route"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(`Backend is runnning at ${WEB}:${PORT}`);
});
