import React, { useState } from 'react';
import { voting_app_backend } from "../../../declarations/voting-app-backend";

function CastVote({ voterId, currentElection, onVoteCast }) {
  const [selectedCandidate, setSelectedCandidate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await voting_app_backend.castVote(voterId, selectedCandidate);
    if (success) {
      alert('Vote cast successfully');
      onVoteCast();
    } else {
      alert('Voting failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={selectedCandidate}
        onChange={(e) => setSelectedCandidate(e.target.value)}
        required
      >
        <option value="">Select a candidate</option>
        {currentElection.candidates.map((candidate) => (
          <option key={candidate.id} value={candidate.id}>
            {candidate.name}
          </option>
        ))}
      </select>
      <button type="submit">Cast Vote</button>
    </form>
  );
}

export default CastVote;