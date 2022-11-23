let _ = require('lodash');
const mongoose = require('mongoose');
let Models = require('../db/db')
let Credit = 0
let SurveyModel = Models.SurveyModel
let UserSubmittedSurveyModel = Models.UserSubmittedSurveyModel
let UsersModel = Models.UsersModel;

// retrieves all surveys
const retrieveAllSurveys = (req,res) => {
    SurveyModel.find({}, (err,surveys) => {
        if(err)
            return res.status(500).json(throwErrorMessage(err));
        res.json(surveys);
    }) 
}

//submit survey with questions and options
const submitSurvey = (req,res) => {
    // check if survey with same name exists
    let Survey = new SurveyModel({
        survey_title: req.body.survey_title,
        submission_date : getTimeStamp(),
        questions : req.body.questions 
    })
    Survey.save((err, survey) => {
        if(err)
            return res.status(500).json(throwErrorMessage(err));
        return res.status(200).json({message: "Survey Item Added Successfully", result: survey});
    })
}

const submitSurveyResponse = async(req,res) => {
    let check =  await checkIfUserHasSubmittedResponse(req.body.user_id, req.body.survey_id);
    if(!check)
    {
        const survey = await retrieveSurveyById(req.body.survey_id);
        if(survey == null)
            return res.status(404).json({message: "No Such Survey Available"})
        else 
        {
            const validation_result = surveyFormValidation(survey["questions"],req.body.questions);
            if(validation_result)
            {
                let Survey = new UserSubmittedSurveyModel({
                    response_date: getTimeStamp(),
                    user_id : mongoose.Types.ObjectId(req.body.user_id),
                    survey_id : mongoose.Types.ObjectId(req.body.survey_id),
                    questions : req.body.questions 
                })
                Survey.save(async (err, survey) => {
                    if(err)
                        return res.status(500).json(throwErrorMessage(err));
                    else 
                    {
                        await UpdateCreditbyUserId(req.body.user_id);
                        return res.status(200).json({message: "Survey Response Added Successfully", result: survey});
                    }
                })
            }
            else 
            {
                return res.status(400).json({message: "Please Check if the Options are Correct or not"})
            }
        }
    }
    else 
    {
        return res.status(400).json({message: "User Has Already Submitted Response"})
    }       
}

const CreateUser = (req,res) => {
    let User = new UsersModel({
        username: req.body.username,
        password: req.body.password,
        credits: 0
    });
    User.save((err,user) => {
        if(err)
        {
            console.log(err);
            return res.status(500).json({message: "An Error has Occured", error_message: err});
        }
        else 
            return res.status(200).json({message: "User Created Successfully", response: user});
    })
}

const setCredit = (req,res) => {
    Credit = req.body.credits;
    return res.status(200).json({message: "Credit Has Been Updated to "+Credit});
}


const analyticsData = async(req,res) => {
    let response_arr = []
    const survey = await retrieveSurveyById(req.params.survey_id);
    const responses = await retrieveSurveyResponsesBySurveyId(req.params.survey_id);
    let questions = survey["questions"];
    for(let i=0; i<questions.length; i++ )
    {
        let response_list = [];
        for(let j=0; j<responses.length; j++)
        {
            response_list.push(responses[j][i]);
        }
        let question_answer = {question: questions[i], responses: response_list}
        response_arr.push(question_answer);
    }
    return res.status(200).json({response_data: response_arr});
}

// Additional Functions
const UpdateCreditbyUserId = async(user_id) => {
    try 
    {
        let user = await UsersModel.findById(mongoose.Types.ObjectId(user_id)).exec();
        let newCredit = parseInt(Credit) + parseInt(user["credits"]);
        await UsersModel.findOneAndUpdate({user_id : mongoose.Types.ObjectId(user_id)},{$set: {credits: newCredit}}).exec()
    }
    catch(err)
    {
        console.log(err);
    }
}


const throwErrorMessage = (err) => {
    return {"message": "An Error has Occured", "Exception Message": err}
}

const getTimeStamp = () => {
    return new Date().toISOString()
}

const retrieveSurveyById = async(survey_id) => {
    return await SurveyModel.findById(survey_id).exec()
}

const retrieveSurveyResponsesBySurveyId = async(survey_id) => {
    let questionsSet = []
    let responses = await UserSubmittedSurveyModel.find({survey_id: mongoose.Types.ObjectId(survey_id)}).exec()
    responses.forEach(element => {
        let questions = []
        element["questions"].forEach(element2 => {
            questions.push(Object.values(element2)[0]);
        })
        questionsSet.push(questions);
    });
    return questionsSet;
}

const surveyFormValidation = (survey, response) => {
    // Need Optimization
    survey_keys = []
    survey_values = []
    response_keys = []
    response_value = []
    survey_index = 0
    response_index = 0

    survey.forEach(element => {
        survey_keys[survey_index] = Object.keys(element);
        survey_values[survey_index] = Object.values(element);
        survey_index += 1;
    });

    response.forEach(element => {
        response_keys[response_index] = Object.keys(element);
        response_value[response_index] = Object.values(element);
        response_index += 1;
    });

    survey_keys.sort()
    response_keys.sort()

    if(_.isEqual(survey_keys, response_keys))
    {
        for(let i=0; i<survey_index; i++)
        {
            if(!checkIfElementExistsInArray(survey_values[i][0], response_value[i]))
            {
                return false;
            }
        }
        return true;
    }
    else 
        return false;
}

const checkIfElementExistsInArray = (array, value) =>
{
    flag = false;
    for(let i=0; i<array.length; i++)
    {
        console.log(array[i]+' '+array[i].localeCompare(value)+' '+value)
        if(array[i].localeCompare(value) == 0)
        {
            flag = true;
            break
        }
    }
    return flag; 
}

const checkIfUserHasSubmittedResponse = async (user_id, survey_id) => {
    let results = await UserSubmittedSurveyModel.find({user_id: mongoose.Types.ObjectId(user_id), survey_id: mongoose.Types.ObjectId(survey_id)}).exec()
    console.log(results);
    if(results.length > 0)
        return true;
    else 
        return false;
}

module.exports = {retrieveAllSurveys, submitSurvey, submitSurveyResponse, CreateUser, setCredit, analyticsData};
