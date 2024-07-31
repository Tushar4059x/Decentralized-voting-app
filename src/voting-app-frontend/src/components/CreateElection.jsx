import React, { useState } from 'react';
import { voting_app_backend } from "../../../declarations/voting-app-backend";

function CreateElection({ onElectionCreated }) {
  const [name, setName] = useState('');
  const [candidates, setCandidates] = useState('');
  const [duration, setDuration] = useState(24);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const candidateList = candidates.split(',').map(c => c.trim());
    await voting_app_backend.createElection(name, candidateList, duration);
    onElectionCreated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Election Name"
        required
      />
      <input
        type="text"
        value={candidates}
        onChange={(e) => setCandidates(e.target.value)}
        placeholder="Candidates (comma-separated)"
        required
      />
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        placeholder="Duration (hours)"
        required
      />
      <button type="submit">Create Election</button>
    </form>
  );
}

export default CreateElection;