let router = require('express').Router()
let controller = require('../controllers/controller')

router.get('/survey/all', controller.retrieveAllSurveys);
router.post('/survey/add',controller.submitSurvey);
//router.get('/survey/response/find/:survey_id', controller.retrieveSurveyById);
router.post('/survey/response/submit',controller.submitSurveyResponse);
router.post('/create/user', controller.CreateUser);
router.post('/credit/set',controller.setCredit);
router.post('/analytics/survey/:survey_id',controller.analyticsData);
module.exports = router;