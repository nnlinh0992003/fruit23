const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser=require("cookie-parser");
const session=require("express-session");

require("dotenv").config();

const routeAdmin = require("./router/admin/index.route");
const route = require("./router/client/index.route");

const database = require("./config/database");

const systemconfig =require("./config/system");

database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({extended: false }));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Flash
app.use(cookieParser('huy110303'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End Flash


app.locals.prefixAdmin = systemconfig.prefixAdmin;


app.use(express.static(`${__dirname}/public`));


//routes
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});