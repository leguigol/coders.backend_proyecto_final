const express=require('express')
const handlebars=require('express-handlebars');
const displayRoutes=require('express-routemap');
const viewRoutes=require('./routes/views.router');
const productsRoutes=require('./routes/products.routes');
const cartsRoutes=require('./routes/carts.routes');

const { mongoDBconnection } = require('./db/mongo.config');
const { Server } = require("socket.io");
const path = require('path');


const API_VERSION='v1';
const API_PREFIX='api';
const viewsPath = path.resolve(__dirname, '../views');
// const staticPath=path.resolve(__dirname,'public');

class App {

    constructor(routes){
        this.app=express();
        this.env="development";
        this.port=5000;

        this.connectToDataBase();
        this.initHandlebars();
        this.initializeMiddleWares();
        this.initializeRoutes(routes);

    }

    getServer(){
        return this.app;
    }

    closeServer(){
        this.server=this.app.listen(this.port,()=>{
            done();
        })
    }

    async connectToDataBase(){
        await mongoDBconnection();
    }

    initializeRoutes(routes){
        routes.forEach((route) => {
            this.app.use(`/${API_PREFIX}/${API_VERSION}`,route.router);
        });
    }

    initHandlebars(){
        this.app.engine("handlebars",handlebars.engine());
        this.app.set("views", viewsPath);
        this.app.set("view engine", "handlebars");

    }

    initializeMiddleWares(){
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use('/public', express.static(path.join(__dirname, '../public')));
    }
     
    listen(){
        const server=this.app.listen(this.port,()=>{
            displayRoutes(this.app);
            console.log('=============================');
            console.log(`==== ENV: ${this.env}`);
            console.log(`==== PORT: ${this.port}`);
            console.log('=============================');

        });
        
        const io=require('socket.io')(server);

        const messages=[];

        io.on('connection', (socket) =>{
            console.log('Un usuario esta conectado',socket.id);

            socket.emit('messageLogs',messages);

            socket.on("new-user",(data)=>{
                socket.broadcast.emit('new-user',data);
            })

            socket.on("message",(data)=>{
                messages.unshift(data);
                io.emit("messageLogs",messages);
            });
        });
    }
}

module.exports=App;