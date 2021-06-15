let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const db = require("./api/db");

io.on('connection', function(socket) {
 
  socket.on('set-nickname', (nickname) => {
    console.log(nickname);
    socket.nickname = nickname;
    io.emit('users-changed', {user: nickname, event: 'joined'});    
  });
  socket.on('add-message', (message) => {
      console.log("new msg adde");
      db.executeSql("INSERT INTO `chat`(`sender`, `receiver`,`receiver2`,`message`, `createddate`) VALUES ("+message.sender+","+message.receiver+",1,'"+message.message+"',CURRENT_TIMESTAMP);" , function(data , err){
        if(err){
            console.log("Error in store.js" ,err);
        }
        else{
          db.executeSql("SELECT * FROM chat ORDER BY createddate DESC LIMIT 1" , function(data1 , err){
            if(err){
                console.log("Error in store.js" ,err);
            }
            else{
             
              io.emit('message', {data: data1[0]});  
              return data1;

            }
          });
           
        }
    });
  });
});
var port = process.env.PORT || 3001;
 
http.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});