pragma solidity ^ 0.5.0;

contract bookie{
   
    address payable public  owner;
    
    uint public minimumBet;
    //uint maxBet;
    uint public totalBetsOne;
    uint public totalBetsTwo;
    //uint public maxAmountOfBets = 1000;
    
        address payable[] public  players;
    //teamSelected either 1 or 2
    struct Player{
    
        uint amountBet;
        uint teamSelected;
    } 
    
    mapping(address => Player) public playerInfo;
    
     function() external payable {}
   
    
   constructor() public {
      owner = msg.sender;
      minimumBet = 100000000000000;
    }
function kill() public {
      if(msg.sender == owner) selfdestruct(owner);
    }
    
    
    //@param - to check if player already played or not?
    
    function playerExist(address checkPlayer) view public  returns(bool){
         for(uint256 i = 0; i < players.length; i++){
         if(players[i] == checkPlayer) return true;
      }
      return false;
    } 
    
    function Bet (uint _teamSelected) public payable{
        require(!playerExist(msg.sender));
        require(msg.value >= minimumBet);
        playerInfo[msg.sender].amountBet = msg.value;
        playerInfo[msg.sender].teamSelected = _teamSelected;
        
        players.push(msg.sender);
        
        if(_teamSelected == 1)
        {
            totalBetsOne += msg.value;
        }
        
        else if(_teamSelected == 2)
        {
            totalBetsTwo += msg.value;
        }
        
    }

//@dev creating a temporary array in memory for limited no. of winners
  
    function distributePrizes (uint teamWinner) public{
        address payable[1000] memory winners;
        
        uint count = 0;
        
        uint256 LoserBet = 0;
        
        uint256 WinnerBet = 0;
        
        address add;
        uint256 bet;
        address payable playerAddress;
        
        for(uint i = 0; i < players.length; i++){
        playerAddress = players[i];
        if(playerInfo[playerAddress].teamSelected == teamWinner){
        winners[count] = playerAddress;
        count++;
     }
    }
     if ( teamWinner == 1){
         LoserBet = totalBetsTwo;
         WinnerBet = totalBetsOne;
      }
      else{
          LoserBet = totalBetsOne;
          WinnerBet = totalBetsTwo;
      }
      
      for(uint j = 0; j < count; j++){
          // Check that the address in this fixed array is not empty
         if(winners[j] != address(0))
            add = winners[j];
            bet = playerInfo[add].amountBet;
            //Transfer the money to the user
            winners[j].transfer((bet*(10000+(LoserBet*10000/WinnerBet)))/10000);
      }
       delete playerInfo[playerAddress]; // Delete all the players
      players.length = 0; // Delete all the players array
      LoserBet = 0; //reinitialize the bets
      WinnerBet = 0;
      totalBetsOne = 0;
      totalBetsTwo = 0;
    }
    
    function AmountOne() public view returns(uint256){
       return totalBetsOne;
   }
   
   function AmountTwo() public view returns(uint256){
       return totalBetsTwo;
   }
    
        
    

}