const express=require('express')
const handlebars=require('express-handlebars');
const mongoose = require("mongoose");
const displayRoutes=require('express-routemap');
const session=require("express-session");
const passport=require("passport");
const cookieParser=require('cookie-parser');
const mongoStore=require('connect-mongo');
const initializePassport=require('./config/passport.config');

const viewsRoutes=require('./routes/views.router');
const sessionRoutes=require('./routes/sessions.routes');
const productsRoutes=require('./routes/products.routes');
const cartRoutes=require('./routes/carts.routes');
const authRoutes=require('./routes/auth.routes');
const cookiesRoutes=require('./routes/cookies.routes');

const { mongoDBconnection } = require('./db/mongo.config');
const { Server } = require("socket.io");
const path = require('path');

const PORT=5000;
//const DB_HOST='localhost';
const DB_PORT=27017
const DB_NAME='ecommerce'

const MONGO_URL=`mongodb+srv://leguigol:Lancelot1014@cluster0.pz68o51.mongodb.net/`;
const API_VERSION='v1';
const API_PREFIX='api';
const viewsPath = path.resolve(__dirname, '../views');
// const staticPath=path.resolve(__dirname,'public');

const app=express();

const SECRET_SESSION="pochipola";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(
    session({
        store: mongoStore.create({
            mongoUrl: MONGO_URL,
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true},
            ttl: 60*3600, //una hora
        }),
        secret: SECRET_SESSION,
        resave: false,
        saveUninitialized: false,
    })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

mongoDBconnection()
    .then((conn)=>{
        console.log('CONNECTION MONGO OK !')
    })
    .catch((err)=>{
        console.log('ERROR EN LA CONECCION A MONGO!');
    })



app.engine("handlebars", handlebars.engine());
app.set("views", viewsPath);
app.set("view engine", "handlebars");

app.use(`/static`, express.static(__dirname + "/public"));
// this.app.use('/public', express.static(path.join(__dirname, '../public')));

app.use(`/${API_PREFIX}/${API_VERSION}/views`, viewsRoutes);
app.use(`/${API_PREFIX}/${API_VERSION}/cart`, cartRoutes);
app.use(`/${API_PREFIX}/${API_VERSION}/products`, productsRoutes);
app.use(`/${API_PREFIX}/${API_VERSION}/sessions`, sessionRoutes);
app.use(`/${API_PREFIX}/${API_VERSION}/auth`, authRoutes);
app.use(`/${API_PREFIX}/${API_VERSION}/cookies`, cookiesRoutes);


app.listen(PORT, () => {
    displayRoutes(app);
    console.log(`Listening on ${PORT}`);
});


