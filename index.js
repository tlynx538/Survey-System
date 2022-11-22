let express = require('express');
const routes = require('./routes/route');
let logger = require('morgan');
let port = 8000;

let app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/',routes);
// app.use(function(err, req, res, next) {
//   res.status(500).json({message: "An Error has Occured", exception_message: err})
// });
app.listen(port, function(req,res){
  console.log(`The API is listening on http://localhost:${port}`);
})
module.exports = app;