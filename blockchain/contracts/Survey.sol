pragma solidity ^0.4.18;

contract Survey {

    mapping (uint => Answer) answers;
    mapping (uint => User) surveyTakers;
    mapping (uint => Question) questions;
    bool surveyEnded = false;
    uint answersCount = 0;
    uint usersNumOfAnswers = 0;

    struct User {
        uint userMSISDN;
        uint answerID;
    }

    struct Question {
        uint id;
        string content;
    }

    struct Answer {
        uint answerID;
        string answer;
        bool exist;
    }

    // Functions //
    function createAnswer (uint answerID, string text) public {
        //adding answers for now
        answers[answerID] = Answer(answerID, text, questionID, true);
        answersCount = answersCount + 1;
    }

    function createQuestions (uint questionID, string text) public {
        //adding answers for now
        questions[questionID] = Question(questionID, text);
    }
    
    function answer(uint userID, uint answerID) public {
        // checks if the struct exists for that candidate
        if (answers[answerID].exist == true && surveyEnded == false) {
            surveyTakers[userID] = User(userID, answerID);
            usersNumOfAnswers = usersNumOfAnswers + 1;
        }
    }

    function answerResult(uint answerID) view public returns (uint) {
        uint answerCount = 0; // total number of votes for candidate national ID
        for (uint i = 0; i < answersCount; i++) {
            if (surveyTakers[i].answerID == answerID) {
                answerCount = answerCount + 1;
            }
        }
        return answerCount; 
    }

    //number of answers that this survey has
    function getNumOfAnswers() public view returns(uint) {
        return answersCount;
    }

    //the number of times people answered a question
    function getNumOfSurveyTakers() public view returns(uint) {
        return usersNumOfAnswers;
    }
}