import { 
    query, 
    update, 
    Record as AzleRecord, 
    StableBTreeMap, 
    Vec, 
    Result, 
    nat64, 
    ic 
} from 'azle';
import { v4 as uuidv4 } from 'uuid';

// Type definitions
type Voter = {
    id: string;
    hasVoted: boolean;
};

type Candidate = {
    id: string;
    name: string;
    voteCount: number;
};

type Election = {
    id: string;
    name: string;
    candidates: Vec<Candidate>;
    voters: Vec<Voter>;
    startTime: nat64;
    endTime: nat64;
};

// Storage
const electionStorage = new StableBTreeMap<string, Election>(0n, 44, 1024);

// Helper function
function generateId(): string {
    return uuidv4();
}

// Update calls
update
export function createElection(name: string, candidateNames: Vec<string>, durationInHours: number): Result<string, string> {
    const id = generateId();
    const startTime = ic.time();
    const endTime = startTime + BigInt(durationInHours * 3600 * 1000000000);
    
    const candidates: Vec<Candidate> = candidateNames.map(name => ({
        id: generateId(),
        name,
        voteCount: 0
    }));

    const newElection: Election = {
        id,
        name,
        candidates,
        voters: [],
        startTime,
        endTime
    };

    electionStorage.insert(id, newElection);
    return Result.Ok(id);
}

update
export function registerVoter(electionId: string, voterId: string): Result<boolean, string> {
    const electionOpt = electionStorage.get(electionId);
    if (electionOpt === undefined) {
        return Result.Err('Election not found');
    }
    const election = electionOpt;
    if (election.voters.some(v => v.id === voterId)) {
        return Result.Err('Voter already registered');
    }
    election.voters.push({ id: voterId, hasVoted: false });
    electionStorage.insert(electionId, election);
    return Result.Ok(true);
}

update
export function castVote(electionId: string, voterId: string, candidateId: string): Result<boolean, string> {
    const electionOpt = electionStorage.get(electionId);
    if (electionOpt === undefined) {
        return Result.Err('Election not found');
    }
    const election = electionOpt;
    if (!isElectionActive(election)) {
        return Result.Err('Election is not active');
    }
    const voter = election.voters.find(v => v.id === voterId);
    if (voter === undefined) {
        return Result.Err('Voter not registered');
    }
    if (voter.hasVoted) {
        return Result.Err('Voter has already voted');
    }
    const candidate = election.candidates.find(c => c.id === candidateId);
    if (candidate === undefined) {
        return Result.Err('Candidate not found');
    }
    candidate.voteCount++;
    voter.hasVoted = true;
    electionStorage.insert(electionId, election);
    return Result.Ok(true);
}

// Query calls
query
export function getElectionResults(electionId: string): Result<Vec<Candidate>, string> {
    const electionOpt = electionStorage.get(electionId);
    if (electionOpt === undefined) {
        return Result.Err('Election not found');
    }
    const election = electionOpt;
    return Result.Ok(election.candidates.sort((a, b) => b.voteCount - a.voteCount));
}

query
export function getCurrentElection(electionId: string): Result<Election, string> {
    const electionOpt = electionStorage.get(electionId);
    if (electionOpt === undefined) {
        return Result.Err('Election not found');
    }
    return Result.Ok(electionOpt);
}

query
export function getVoterStatus(electionId: string, voterId: string): Result<boolean, string> {
    const electionOpt = electionStorage.get(electionId);
    if (electionOpt === undefined) {
        return Result.Err('Election not found');
    }
    const election = electionOpt;
    const voter = election.voters.find(v => v.id === voterId);
    if (voter === undefined) {
        return Result.Err('Voter not found');
    }
    return Result.Ok(voter.hasVoted);
}

query
export function getCandidates(electionId: string): Result<Vec<Candidate>, string> {
    const electionOpt = electionStorage.get(electionId);
    if (electionOpt === undefined) {
        return Result.Err('Election not found');
    }
    const election = electionOpt;
    return Result.Ok(election.candidates);
}

// Helper function
function isElectionActive(election: Election): boolean {
    const now = ic.time();
    return now >= election.startTime && now <= election.endTime;
}
