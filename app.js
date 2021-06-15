const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const chat=require("./index");
const chat2=require("./chat2");

app.use((req, res, next) =>{
    // res.header('Access-Control-Allow-Origin' , 'http://localhost:8100 ');
    // res.header('Access-Control-Allow-Origin' , 'http://localhost:4200 ');
    res.header('Access-Control-Allow-Origin' , '*');
    res.header('Access-Control-Allow-Credentials' , 'false');
    res.header('Access-Control-Allow-Headers' , 'Origin , X-Requested-With, Content-Type, Accept, Authorization');
    if( res.method === 'OPTIONS')
    {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});




const directorRoutes =  require("./api/routes/director");
const loginRoutes = require("./api/routes/login");
const adminRoutes = require('./api/routes/admin');

app.use(bodyParser.urlencoded({extended :true}));
app.use(bodyParser.json());
app.use(express.static('public'));

//Serves all the request which includes /images in the url from Images folder
app.use('/upload', express.static(__dirname + '/upload'));


//const DbConnectionString = 'mssql://'+ process.env.SQL_USER +':'+ process.env.SQL_PASSWORD +'@192.168.1.112:54161/'+process.env.SQL_DATABASE;



// API Routes
app.use( "/director" , directorRoutes);
app.use( "/admin" , adminRoutes);
app.use("/login", loginRoutes);
//app.use("/store/getCategory" , storeRoutes);

app.use(( req, res, next) =>{
    const error = new Error('Not Found');
    error.status(404);
    next(error);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error:{
            massage: error.message
        }
    });
});

module.exports = app;