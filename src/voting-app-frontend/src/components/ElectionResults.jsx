import React, { useState, useEffect } from 'react';
import { voting_app_backend } from "../../../declarations/voting-app-backend";

function ElectionResults({ currentElection }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, [currentElection]);

  const fetchResults = async () => {
    const electionResults = await voting_app_backend.getElectionResults();
    setResults(electionResults);
  };

  return (
    <div>
      <h2>Election Results</h2>
      <ul>
        {results.map((candidate) => (
          <li key={candidate.id}>
            {candidate.name}: {candidate.voteCount} votes
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ElectionResults;