// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract DiceGame {
    string public name = "Titan Games";
    string public symbol = "TitanGM";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    uint256 public totalBurned;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // Mapping to track user's rewards (earned through betting)
    mapping(address => uint256) public reward;

    // Mapping to track user's credits from deposits
    mapping(address => uint256) public creditsBalance;

    // Mapping to track the total number of bets per user (this was missing)
    mapping(address => uint256) public totalBets;

    // Mapping to track the total amount of burned tokens per user
    mapping(address => uint256) public userBurned;

    // Mapping to track the last round per user
    mapping(address => uint256) public lastRoundAt;

    address public owner;
    address public stakeAddress;
    uint256 public nonce;
    address public feeRecipient = 0x5555555555555555555555555555555555555555;
    IERC20 public depositToken;

    uint256 public constant REWARD_TO_TOKEN_CONVERSION = 10 ** 16; // 1 Reward = 0.01 Tokens

    uint256 public GLOBALPOOL;
    uint256 public LIQ;
    uint256 public STAKE;

    // New leaderboard payout pool
    uint256 public leaderboardPayoutPool;

    // Track last 50 bets per user
    struct Bet {
        uint256 blockNumber;
        uint256 betAmount;
        uint256 payout;
    }
    mapping(address => Bet[50]) public userBets;
    mapping(address => uint256) public betIndex; // Circular index for each user's bets

    struct UserStats {
        uint256 totalBets; // Total number of bets
        uint256 creditsSpent; // Total credits (tokens) spent
        uint256 totalWon; // Total amount won
        uint256 lastRound; // The last round this user placed a bet
    }

    struct LeaderboardEntry {
        address bettor;
        uint256 totalBets;
        uint256 creditsSpent; // Credits spent used for leaderboard sorting
        uint256 totalWon;
    }

    mapping(address => UserStats) public userStats;
    LeaderboardEntry[8] public leaderboard;

    uint256 public leaderboardStartBlock;
    uint256 public constant BLOCKS_PER_ROUND = 50000;

    event DiceRolled(address indexed user, uint256 betAmount, uint256 randomResult, uint256 rewardAmount);
    event TotalBetUpdated(address indexed user, uint256 totalBets);
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event Mint(address indexed to, uint256 value);
    event Burn(address indexed from, uint256 value);
    event NewPlayer(address indexed user);
    event StakeClaimed(address indexed stakeAddress, uint256 amount);
    event StakeAddressUpdated(address indexed newStakeAddress);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event LeaderboardUpdated();

    constructor(address _depositTokenAddress) {
        owner = msg.sender;
        nonce = 0;
        totalSupply = 0;
        depositToken = IERC20(_depositTokenAddress);
        leaderboardStartBlock = block.number;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can execute this");
        _;
    }

    // Owner Functions
    function updateStakeAddress(address newStakeAddress) public onlyOwner {
        stakeAddress = newStakeAddress;
    }

    function transferToStake() public onlyOwner {
        require(STAKE > 0, "Amount must be greater than zero");

        _mint(stakeAddress, STAKE);
        emit StakeClaimed(stakeAddress, STAKE);
    }

    // Function to deposit tokens and update leaderboard payout pool
    function deposit(uint256 amount) public {
        require(amount > 0, "Amount must be greater than zero");

        // Calculate the tax (8%)
        uint256 fee = (amount * 8) / 100;

        // Out of the 8%, 2% goes to the leaderboard payout pool
        uint256 leaderboardShare = (fee * 2) / 8; // 2% of the total deposit amount
        leaderboardPayoutPool += leaderboardShare;

        // Remaining goes to the pool
        uint256 remainingAmount = amount - fee;

        // Transfer tokens
        require(depositToken.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        require(depositToken.transfer(feeRecipient, fee - leaderboardShare), "Fee transfer failed");

        // Add the remaining amount to the global pool
        GLOBALPOOL += remainingAmount;

        // Grant credits to the user based on the full deposited amount (not the fee-adjusted amount)
        creditsBalance[msg.sender] += amount / 10 ** 18; // 1 credit per token deposited

        emit Deposit(msg.sender, amount);
    }

    // Function to get a user's remaining credits
    function getRemainingCredits(address user) public view returns (uint256) {
        return creditsBalance[user];
    }

    // Function to payout leaderboard at the end of a round
    function payoutLeaderboard() internal {
        // Payout distribution based on leaderboard ranking
        uint256 totalPayout = leaderboardPayoutPool;

        // Pay out based on the leaderboard position
        if (totalPayout > 0) {
            uint256[8] memory percentages = [
                uint256(25),
                uint256(20),
                uint256(15),
                uint256(10),
                uint256(9),
                uint256(8),
                uint256(7),
                uint256(6)
            ]; // Payout percentages

            for (uint256 i = 0; i < 8; i++) {
                if (leaderboard[i].bettor != address(0)) {
                    uint256 payout = (totalPayout * percentages[i]) / 100;
                    require(depositToken.transfer(leaderboard[i].bettor, payout), "Leaderboard payout failed");
                }
            }
        }

        // Reset the leaderboard payout pool for the next round
        leaderboardPayoutPool = 0;
        leaderboardStartBlock = block.number;

        resetLeaderboard();
    }

    // Function to calculate the current round based on block number
    function getCurrentRound() public view returns (uint256) {
        return block.number / BLOCKS_PER_ROUND;
    }

    // Function to calculate the amount won based on a bet (customize this as needed)
    function calculateWin(uint256 betAmount) internal view returns (uint256) {
        uint256 randomWin = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))) % 100;
        return (betAmount * randomWin) / 100; // Random win amount (0-100%)
    }

    // Update leaderboard logic to rank by credits spent
    function updateLeaderboard(address bettor, uint256 userTotalBets, uint256 creditsSpent, uint256 totalWon) internal {
        // Check if the bettor qualifies for the leaderboard based on credits spent
        for (uint i = 0; i < 8; i++) {
            if (leaderboard[i].bettor == address(0) || creditsSpent > leaderboard[i].creditsSpent) {
                // Shift others down and insert the bettor
                for (uint j = 7; j > i; j--) {
                    leaderboard[j] = leaderboard[j - 1];
                }
                leaderboard[i] = LeaderboardEntry(bettor, userTotalBets, creditsSpent, totalWon);
                break;
            }
        }
    }

    // Reset Leaderboard in a new round
    function resetLeaderboard() internal {
        for (uint256 i = 0; i < leaderboard.length; i++) {
            leaderboard[i] = LeaderboardEntry({bettor: address(0), totalBets: 0, creditsSpent: 0, totalWon: 0});
        }
    }

    // Multi-bet function to place multiple bets
    function multiBet(uint256 numberOfBets, uint256 totalBetAmount) public {
        require(numberOfBets > 0, "Number of bets must be greater than zero");

        if (block.number >= (leaderboardStartBlock + BLOCKS_PER_ROUND)) payoutLeaderboard();
        if ((block.number / BLOCKS_PER_ROUND) > lastRoundAt[msg.sender]) resetUserCreditsSpent();

        // Calculate the bet amount for each individual bet
        uint256 betAmount = totalBetAmount / numberOfBets;

        for (uint256 i = 0; i < numberOfBets; i++) {
            // Generate a random result for each bet
            uint256 randomResult = uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        blockhash(block.number - 1),
                        tx.gasprice,
                        msg.sender,
                        nonce + i
                    )
                )
            ) % 93;

            // Calculate the percentage of the max win that the user won
            uint256 userRewardPercent = (randomResult * 10000) / 92;

            // Calculate how much of the bet goes to LIQ and STAKE using the scaled bet amount
            uint256 amountToLIQ = (betAmount * userRewardPercent) / 10000;
            uint256 amountToSTAKE = betAmount - amountToLIQ;

            // Update LIQ and STAKE with scaled amounts
            LIQ += amountToLIQ;
            STAKE += amountToSTAKE;

            // Credit the user's reward in scaled points
            reward[msg.sender] += betAmount * randomResult * 10000; // Scale reward to points

            // Track each individual bet using scaled values
            _trackBet(msg.sender, betAmount * 10000, randomResult * 10000);

            emit DiceRolled(msg.sender, betAmount * 10000, randomResult * 10000, reward[msg.sender]);

            // Increment totalBets for this user
            totalBets[msg.sender] += 1;

            // Update user's all stats during multiBet
            userStats[msg.sender].creditsSpent += betAmount;
            userStats[msg.sender].totalBets += 1;
            userStats[msg.sender].totalWon += betAmount * randomResult * 10000;
        }

        // Increment the nonce after all bets are placed
        nonce += numberOfBets;

        // Grant credits to the user based on the full deposited amount (not the fee-adjusted amount)
        creditsBalance[msg.sender] -= totalBetAmount; // 1 credit per token deposited

        // Update leaderboard after all bets are placed
        updateLeaderboard(
            msg.sender,
            userStats[msg.sender].totalBets,
            userStats[msg.sender].creditsSpent,
            userStats[msg.sender].totalWon
        );

        lastRoundAt[msg.sender] = block.number / BLOCKS_PER_ROUND;

        emit TotalBetUpdated(msg.sender, totalBets[msg.sender]);
    }

    function resetUserCreditsSpent() internal {
        userStats[msg.sender].creditsSpent = 0;
    }

    function claimTokens() public {
        require(reward[msg.sender] >= 1, "Not enough Reward to claim tokens");

        // Convert reward points back to actual tokens (divide by 10000)
        uint256 tokenAmount = (reward[msg.sender] * REWARD_TO_TOKEN_CONVERSION) / 10000;

        // Distribute 95% to the user and 5% as a fee
        uint256 userShare = (tokenAmount * 95) / 100;
        uint256 feeAmount = (tokenAmount * 5) / 100;

        _mint(msg.sender, userShare);
        _mint(feeRecipient, feeAmount);

        // Reset the user's reward
        reward[msg.sender] = 0;
    }

    function burnTokens(uint256 amount) public {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance to burn");

        _burn(msg.sender, amount);
        require(depositToken.transfer(msg.sender, amount), "Token transfer failed");

        // Update Burned Stats
        totalBurned += amount;
        userBurned[msg.sender] += amount;

        emit Withdraw(msg.sender, amount);
    }

    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Mint(to, amount);
        emit Transfer(address(0), to, amount);
    }

    function _burn(address from, uint256 amount) internal {
        balanceOf[from] -= amount;
        totalSupply -= amount;
        emit Burn(from, amount);
        emit Transfer(from, address(0), amount);
    }

    function transfer(address recipient, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        require(allowance[sender][msg.sender] >= amount, "Allowance exceeded");
        require(balanceOf[sender] >= amount, "Insufficient balance");

        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        allowance[sender][msg.sender] -= amount;

        emit Transfer(sender, recipient, amount);
        return true;
    }

    function getUserStats(address user) public view returns (uint256 totalUserBets, uint256 totalUserRewards) {
        return (totalBets[user], reward[user]);
    }

    // New function to track bets
    function _trackBet(address user, uint256 betAmount, uint256 payout) internal {
        uint256 index = betIndex[user] % 50; // Circular index
        userBets[user][index] = Bet(block.number, betAmount, payout);
        betIndex[user] += 1; // Increment index
    }

    // Function to get a user's bet history (last 50 bets)
    function getUserBets(address user) public view returns (Bet[50] memory) {
        Bet[50] memory bets; // Initialize an in-memory array to hold the last 50 bets
        uint256 currentIndex = betIndex[user] % 50;

        for (uint256 i = 0; i < 50; i++) {
            uint256 index = (currentIndex + i) % 50;
            bets[i] = userBets[user][index];
        }

        return bets;
    }
}
