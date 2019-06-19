const express = require('express');
const path = require('path');
const app = express();

const PORT  = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, '../build')));


app.get('/*', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log("Listening at port : " + PORT)
});