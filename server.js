import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { engine } from "express-handlebars";
import { router } from "./routes.js";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "process.env.fbAPI",
  authDomain: "process.env.fbAuthDomain",
  databaseURL: "process.env.FBDBURL",
  projectId: "senseard-a6364",
  storageBucket: "senseard-a6364.appspot.com",
  messagingSenderId: "598746851213",
  appId: "process.env.fbID"
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(fileUpload());
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use("/", router);

const listener = app.listen(process.env.PORT || 4000, function () {
  console.log(
    `DoughIoT started on http://localhost:${listener.address().port}`
  );
});
