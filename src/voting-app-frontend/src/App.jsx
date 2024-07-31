import React, { useState, useEffect } from 'react';
import { voting_app_backend } from "../../declarations/voting-app-backend";
import CreateElection from './components/CreateElection';
import RegisterVoter from './components/RegisterVoter';
import CastVote from './components/CastVote';
import ElectionResults from './components/ElectionResults';

function App() {
  const [currentElection, setCurrentElection] = useState(null);
  const [voterId, setVoterId] = useState('');

  useEffect(() => {
    fetchCurrentElection();
  }, []);

  const fetchCurrentElection = async () => {
    const election = await voting_app_backend.getCurrentElection();
    setCurrentElection(election);
  };

  return (
    <div className="App">
      <h1>Decentralized Voting Application</h1>
      {!currentElection ? (
        <CreateElection onElectionCreated={fetchCurrentElection} />
      ) : (
        <>
          <RegisterVoter 
            onVoterRegistered={(id) => setVoterId(id)} 
            currentElection={currentElection}
          />
          {voterId && (
            <CastVote 
              voterId={voterId} 
              currentElection={currentElection}
              onVoteCast={fetchCurrentElection}
            />
          )}
          <ElectionResults currentElection={currentElection} />
        </>
      )}
    </div>
  );
}

export default App;
