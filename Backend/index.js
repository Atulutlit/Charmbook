const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const routes = require("./src/routes");
const app = express();
const { error404,globalError } = require('./src/middlewares/index.js');
app.set('trust proxy', true);
app.use(express.json());
const { PORT } = require('./src/constant')
require("./src/db").connectDB();
require("./src/utils/crone")
app.use(cors());

app.use(morgan('combined'));
app.use(helmet());


app.use('/api', routes);

app.use(error404);

app.use(globalError);

app.use("/", (_req, res) => {
  res.send({status: false, statusCode: 404, message: "Path Not Found" });
});

app.listen(PORT, () => {
  console.log("Server listening on PORT:", PORT);
});