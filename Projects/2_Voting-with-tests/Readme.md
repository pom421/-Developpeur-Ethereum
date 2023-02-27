# Tests pour Voting

## Périmètre des tests

Nous allons tester les fonctions du contrat suivant 4 thèmes, chacun répartis dans un describe, pous plus de lisibilité :

1. vérification des getters
1. vérification des fonctionnalités du owner, en dehors des changement de statut
1. vérification des changements de status
1. vérification des fonctions des voteurs

À chaque fois, nous testerons d'abord le cas passant, quand toutes les conditions sont réunies et son émission d'évènement associé.
Puis pour nous ferons un cas de test pour chacune des conditions qui déclenchent une erreur et font un revert.

1. describe("Check getters")

   - function getVoter(address \_addr) external view onlyVoters returns (Voter memory) {

     - [x] should get voter if user in whitelist
     - [x] should throw an error on get voter if user not in whitelist

   - function getOneProposal(uint256 \_id) external view onlyVoters returns (Proposal memory) {

     - [x] should get proposal for user in whitelist
     - [x] should throw an error on get proposal for user not in whitelist

2. describe("Check owner features (except workflow status)")

   - function addVoter(address \_addr) external onlyOwner {

     - [x] should be able to add voter and emit VoterRegistered
     - [x] should not be able to add voter if not owner => "Ownable: caller is not the owner."
     - [x] should not be able to add voter if not workflow status not in registering phase => "Voters registration is not open yet"
     - [x] should not be able to add voter if voter already in whitelist => "Already registered"

   - function tallyVotes() external onlyOwner {

     - [x] should be able to tally vote & emit WorkflowStatusChange event
     - [x] should not be able to tally vote if not owner => "Ownable: caller is not the owner."
     - [x] should not be able to tally vote if not in end voting phase => "Current status is not voting session ended"

3. describe("Check voters features")

   - function addProposal(string calldata \_desc) external onlyVoters {

     - [x] should be able to add proposal if user in whitelist & emit ProposalRegistered event
     - [x] should not be able to add proposal if user not in whitelist => "You're not a voter"
     - [x] should not be able to add proposal if workflow status not in proposal registration phase => "Proposals are not allowed yet"
     - [x] should not be able to add proposal if proposal is empty => "Vous ne pouvez pas ne rien proposer"

   - function setVote(uint256 \_id) external onlyVoters {

     - [x] should be able to vote & emit Voted event
     - [x] should not be able to vote if user not in whitelist => "You're not a voter"
     - [x] should not be able to vote if not in start voting phase => "Voting session havent started yet"
     - [x] should not be able to vote if voter has already voted => "You have already voted"
     - [x] should not be able to vote if for an unfound proposal => "Proposal not found"

4. describe("Check workflow status")

   - function startProposalsRegistering() external onlyOwner {

     - [x] should be able to start registering proposal phase & emit WorkflowStatusChange
     - [x] should not be able to start registering proposal phase if not owner => "Ownable: caller is not the owner."
     - [x] should not be able to start registering proposal phase if not in registering voters phase => "Registering proposals cant be started now"

   - function endProposalsRegistering() external onlyOwner {

     - [x] should be able to end registering proposal phase & emit WorkflowStatusChange
     - [x] should not be able to end registering proposal phase if not owner => "Ownable: caller is not the owner."
     - [x] should not be able to end registering proposal phase if not in start registering proposal phase => "Registering proposals havent started yet"

   - function startVotingSession() external onlyOwner {

     - [x] should be able to start voting session & emit WorkflowStatusChange event
     - [x] should not be able to start voting phase if not owner => "Ownable: caller is not the owner."
     - [x] should not be able to start voting phase if not in end registering proposal phase => "Registering proposals phase is not finished"

   - function endVotingSession() external onlyOwner {

     - [x] should be able to end voting phase & emit WorkflowStatusChange event
     - [x] should not be able to end voting phase if not owner => "Ownable: caller is not the owner."
     - [x] should not be able to end voting phase if not in start voting phase => "Voting session havent started yet"
