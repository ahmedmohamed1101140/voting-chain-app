pragma solidity ^0.4.18;

contract Vote {

    struct Voter {
        uint userNationalID;
        uint userMSISDN;
        uint candidateNationalID;
    }

    struct Candidate {
        string candidateName;
        bool exist;
        bool winner; 
    }

    mapping (uint => Candidate) candidates;
    mapping (uint => Voter) voters;

    uint numCandidates = 3; 
    uint numVoters = 0;
    bool voteEnded = false;

    // Functions //
    function fillCandidates () public {
        // adding candidates for now
        candidates[12345678912345] = Candidate("John", true, false);
        candidates[12345678912346] = Candidate("Alex", true, false);
        candidates[12345678912347] = Candidate("Peter", true, false);
    }
    
    function vote(uint userNationalID, uint userMSISDN, uint candidateNationalID) public {
        // checks if the struct exists for that candidate
        if (candidates[candidateNationalID].exist == true) {
            uint voterID = numVoters;
            voters[voterID] = Voter(userNationalID, userMSISDN, candidateNationalID);
            numVoters = numVoters + 1 ;
        }
    }

    function voteResults(uint candidateNationalID) view public returns (uint) {
        uint numOfVotes = 0; // total number of votes for candidate national ID
        for (uint i = 0; i < numVoters; i++) {
            if (voters[i].candidateNationalID == candidateNationalID) {
                numOfVotes = numOfVotes + 1;
            }
        }
        return numOfVotes; 
    }

    function getNumOfCandidates() public view returns(uint) {
        return numCandidates;
    }

    function getNumOfVoters() public view returns(uint) {
        return numVoters;
    }
    
    function getCandidate(uint candidateNationalID) public view returns (uint,string) {
        return (candidateNationalID,candidates[candidateNationalID].candidateName);
    }
}