pragma solidity ^0.4.18;

contract Vote {

    struct Voter {
        uint userID;
        uint candidateID;
    }

    struct Candidate {
        string candidateName;
        bool exist;
        bool winner; 
    }

    mapping (uint => Candidate) candidates;
    mapping (uint => Voter) voters;

    uint numCandidates = 0; 
    uint numVoters = 0;
    bool voteEnded = false;

    // Functions //
    function addCandidate (uint candidateID, string name) public {
        // adding candidates for now
        candidates[candidateID] = Candidate(name, true, false);
        numCandidates = numCandidates + 1;
    }
    
    function vote(uint userID, uint candidateID) public {
        // checks if the struct exists for that candidate
        if (candidates[candidateID].exist == true) {
            uint voterID = numVoters;
            voters[voterID] = Voter(userID, candidateID);
            numVoters = numVoters + 1 ;
        }
    }

    function voteResults(uint candidateID) view public returns (uint) {
        uint numOfVotes = 0; // total number of votes for candidate national ID
        for (uint i = 0; i < numVoters; i++) {
            if (voters[i].candidateID == candidateID) {
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
    
    function getCandidate(uint candidateID) public view returns (uint,string) {
        return (candidateID,candidates[candidateID].candidateName);
    }
}