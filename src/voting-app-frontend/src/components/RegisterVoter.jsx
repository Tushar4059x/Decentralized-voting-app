import React, { useState } from 'react';
import { voting_app_backend } from "../../../declarations/voting-app-backend";

function RegisterVoter({ onVoterRegistered, currentElection }) {
  const [voterId, setVoterId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await voting_app_backend.registerVoter(voterId);
    if (success) {
      onVoterRegistered(voterId);
    } else {
      alert('Voter registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={voterId}
        onChange={(e) => setVoterId(e.target.value)}
        placeholder="Enter Voter ID"
        required
      />
      <button type="submit">Register to Vote</button>
    </form>
  );
}

export default RegisterVoter;