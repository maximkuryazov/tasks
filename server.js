var express = require('express');
var app = express();

app.use(express.static(__dirname));
app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(process.env.PORT || 3000);
console.log("Server running at port: 3000");