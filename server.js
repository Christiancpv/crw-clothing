const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const compression = require("compression");
const enforce = require("express-sslify");

if (process.env.NODE_ENV != "production") require("dotenv").config(); // Loads .env into envinroment through dotenv

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express(); //instantiate a new express application
const port = process.env.PORT || 5000;

app.use(compression());
app.use(bodyParser.json()); //Any of the requests coming in I need to get the get the body and convert to json
app.use(bodyParser.urlencoded({ extended: true })); //Make sure that url string passed contains no spaces or symbols are escaped
app.use(enforce.HTTPS({trustProtoHeader: true}))
app.use(cors()); //Cross Origin Request : Check if the request comes from the same origin server configured

if (process.env.NODE_ENV === "production") {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, (error) => {
  if (error) throw error;
  console.log("Server running on port" + port);
});

app.get("./service-worker.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "build", "service-worker.js"));
});
app.post("/payment", (req, res) => {
  // request contais all information we're sending from our frontend to our backend
  const body = {
    source: req.body.token.id,
    amount: req.body.amount,
    currency: "usd",
  };

  stripe.charges.create(body, (stripeErr, stripeRes) => {
    if (stripeErr) {
      res.status(500).send({ error: stripeErr });
    } else {
      res.status(200).send({ sucess: stripeRes });
    }
  });
});
