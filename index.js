let express = require('express');
const routes = require('./routes/route');
let rateLimit = require('express-rate-limit');
let logger = require('morgan');
let port = 8000;

const limiter = rateLimit({
    max: 25,
    windowMs: 10000,
    message: "Too many request from this IP"
});
let app = express();
app.use(limiter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/',routes);
app.get('/', (req, res) => {
    res.status(200).json({message: "Welcome to the Survey System API"});
  })
app.listen(port, function(req,res){
  console.log(`The API is listening on http://localhost:${port}`);
})
module.exports = app;