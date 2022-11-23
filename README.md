# Survey API TaskList

### Deadline : 23 Nov 15:00 IST

## Problem Statement

Consider a survey system where the admin can create multiple surveys with **questions and options** and other registered users can respond.

- Whenever a user completes a survey he’ll get a predefined amount set by the admin in his wallet. - *use setCredit() method to set the credit. When a user submits the survey obtain the credit using getCredit() and adds up with existing user credits. Hardcode basic credit value*
- There shouldn’t be duplicate submissions of responses to surveys. - *by survey_id, select all surveys and check if any of the survey is containing the user_id. If yes, then return stating that the survey is submitted*
- There should be an analytics board to get details about each survey. - *by survey_id, gather all the questions and collect all the answers given by users and display results in json. - TBD*
- Include rate-limiting for APIs to avoid an infinite number of calls in a minute from the same IP. - *used express-rate-limit*

write rest APIs for this scenario using Express and any preferred Database of your choice.

We give bonus points :) for creativity on top of being functional, feel free to add your bells and whistles to stand out.

Once the task is completed, Deploy it in netlify and share the URL. Also, upload the code to GitHub and share the link.

Tasks to Work On:

1. Auth - Use APIs to authenticate users [Optional, but necessary] 
2. Core Logic [Important]
3. API related changes defined in point 4 [Important]
4. Deploy [Important]

## **Requirements**

1. Node.js for creating the APIs
2. Mongoose + MongoDB for the database
3. Morgan and other Tools

## Collection Schemas

1. Users 
    1. username
    2. password (hashed)
    3. user_id
    4. credit
2. User Submitted Surveys
    1. survey_id
    2. user_submitted_id
    3. questions with answers 
3. Survey
    1. survey_id
    2. question arrays with options

### Notes:

For Survey Validation compare the question array from **“Survey”** and compare the keys and values from questions with answers in **“User Submitted Surveys”**. Validate the options and check if they exist, if not then return an error stating that the form is **invalid**.

Check if survey_id exists, if not throw an error stating that the survey **“Does Not Exist”**

Survey Example:

```json
{
  "survey_title" : "Product Review",
  "date_of_submission" : <timestamp>,
  "questions" :
 {
   "How would you rate the product" : ["Poor", "Average", "Good", "Excellent"],
   "How much would you recommend this product to your friend for": [1,2,3,4,5],
	}
}
```

User Submitted Survey Example: 

```json
{

	"survey_id" : 1,
  "user_id" : 1,
  "date_of_response" : <timestamp>,
  "questions" :
 {
   "How would you rate the product" : "Good",
   "How much would you recommend this product to your friend for": 3,
	}
}
```

## API Routes
1. [GET] **/api/survey/all** - view all surveys ✅

Sample Response:

```
    [
    {
        "_id": "637c86552493a49fe9ed2a06",
        "survey_title": "General Product Questions",
        "submission_date": "2022-11-22T08:20:37.984Z",
        "questions": [
            {
                "Have You Ever Purchased a Product or Service From Our Website": [
                    "Yes",
                    "No"
                ]
            },
            {
                "What Product Have You Purchased?": [
                    "ABC",
                    "CDE",
                    "DEF"
                ]
            }
        ],
        "__v": 0
    }
] 
```
2. [POST] **/api/survey/add** - add survey ✅

Sample Body:

```
  {
    "survey_title" : "General Product Questions",
    "questions" : [
        {"Have You Ever Purchased a Product or Service From Our Website" : ["Yes", "No"]},
        {"What Product Have You Purchased?": ["ABC","CDE","DEF"]}
    ]
  }
```

Sample Response:

```
{
    "message": "Survey Item Added Successfully",
    "result": {
        "survey_title": "General Product Questions",
        "submission_date": "2022-11-22T08:20:37.984Z",
        "questions": [
            {
                "Have You Ever Purchased a Product or Service From Our Website": [
                    "Yes",
                    "No"
                ]
            },
            {
                "What Product Have You Purchased?": [
                    "ABC",
                    "CDE",
                    "DEF"
                ]
            }
        ],
        "_id": "637c86552493a49fe9ed2a06",
        "__v": 0
    }
}
```
3. [POST] **/api/survey/response/submit** - add user survey ✅ 

Sample Body:

```
  {
    "survey_id" : "637c86552493a49fe9ed2a06",
    "user_id" : "637ccebd964dc0d9e1025933",
    "questions" : [
        {"Have You Ever Purchased a Product or Service From Our Website" : "Yes"},
        {"What Product Have You Purchased?": "CDE"}
    ]
  }
```

Sample Response:

```
{
    "message": "Survey Response Added Successfully",
    "result": {
        "survey_id": "637c86552493a49fe9ed2a06",
        "user_id": "637ce6520de21d14278799ae",
        "response_date": "2022-11-22T15:10:40.838Z",
        "questions": [
            {
                "Have You Ever Purchased a Product or Service From Our Website": "Yes"
            },
            {
                "What Product Have You Purchased?": "DEF"
            }
        ],
        "_id": "637ce6700de21d14278799b2",
        "__v": 0
    }
}
```
4. [POST] **/api/credit/set** - sets credit value ✅

Sample Body:

```
  {
    "credits" : 150
  }
```
Sample Response:

```
  {
    "message": "Credit Has Been Updated to 150"
  }
```
5. [POST] **/api/create/user** - to create user ✅ [BETA]

Sample Body :

```
  {
      "username" : "tlynx538",
      "password" : "abc123"
  }
```

Sample Response :

```
  {
      "message": "User Created Successfully",
      "response": {
          "username": "tlynx538",
          "password": "abc123",
          "credits": 0,
          "_id": "637ce6520de21d14278799ae",
          "__v": 0
      }
  }
```
6. [GET] **/api/analytics/survey/:survey_id** [BETA] - to display the questions and options along with responses from users ✅

Sample URL:  `/api/analytics/survey/637c86552493a49fe9ed2a06`

Sample Response :
```
  {
    "response_data": [
        {
            "question": {
                "Have You Ever Purchased a Product or Service From Our Website": [
                    "Yes",
                    "No"
                ]
            },
            "responses": [
                "Yes",
                "Yes",
                "Yes"
            ]
        },
        {
            "question": {
                "What Product Have You Purchased?": [
                    "ABC",
                    "CDE",
                    "DEF"
                ]
            },
            "responses": [
                "ABC",
                "CDE",
                "DEF"
            ]
        }
    ]
}
```
## [Deployment Link](https://survey-system-production.up.railway.app/) 
Note: 
1. There is a bug - especially on the checkIfUserExists function, especially if the result is null.
2. The limiter, limits requests if there are 25 calls and will allow to accept requests only after 10 seconds  
