import express from "express";
import bodyParser from "body-parser";
import { engine } from "express-handlebars";
import { router } from "./routes.js";

//handles environmental variables
import dotenv from "dotenv"; 
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use("/", router);

const listener = app.listen(process.env.PORT || 4000, function () {
  console.log(
    `DoughIoT started on http://localhost:${listener.address().port}`
  );
});
