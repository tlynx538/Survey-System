const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SurveySchema = new Schema ({
    survey_title: String, 
    survey_id: Number,
    submission_date: Date, 
    questions : {type: Array}
})

let UserSubmittedSurveySchema = new Schema ({
    survey_id: Schema.Types.ObjectId,
    user_id: Schema.Types.ObjectId, 
    response_date: Date, 
    questions : {type: Array}
})

let UserSchema = new Schema ({
    username: String,
    password: String,
    credits: Number 
})

let SurveyModel = mongoose.model('Survey',SurveySchema);
let UserSubmittedSurveyModel = mongoose.model('UserSubmittedResponses', UserSubmittedSurveySchema);
let UsersModel = mongoose.model('Users',UserSchema);

try 
{
    mongoose.connect('mongodb://localhost:27017/survey-db');
    console.log("Connection to MongoDB Successful");
    module.exports = {SurveyModel, UserSubmittedSurveyModel, UsersModel}
}
catch(error)
{
    console.log(error);
}