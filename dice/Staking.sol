// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract TitanGMStaking {
    IERC20 public token;
    uint256 public totalStaked;
    uint256 public lastPayTime;
    uint256 public payInterval = 1 days;

    uint256 public stakeFee = 5; // 5% fee on staking
    uint256 public unstakeFee = 5; // 5% fee on unstaking

    mapping(address => uint256) public userStakes;
    mapping(address => uint256) public userRewards;

    address[] public stakers;
    mapping(address => bool) public hasStaked;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardsUpdated(address indexed user, uint256 reward);

    constructor(address _token) {
        token = IERC20(_token);
        lastPayTime = block.timestamp;
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake zero tokens");

        uint256 fee = (amount * stakeFee) / 100;
        uint256 amountAfterFee = amount - fee;

        token.transferFrom(msg.sender, address(this), amount);
        totalStaked += amountAfterFee;
        userStakes[msg.sender] += amountAfterFee;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
            hasStaked[msg.sender] = true;
        }

        uint256 contractBalance = token.balanceOf(address(this));
        uint256 rewardPool = contractBalance - totalStaked;
        if ((block.timestamp >= lastPayTime + payInterval) && totalStaked > 0 && rewardPool > 0) pay();

        emit Staked(msg.sender, amountAfterFee);
    }

    function unstake(uint256 amount) external {
        require(amount > 0, "Cannot unstake zero tokens");
        require(userStakes[msg.sender] >= amount, "Insufficient staked balance");

        uint256 fee = (amount * unstakeFee) / 100;
        uint256 amountAfterFee = amount - fee;

        totalStaked -= amount;
        userStakes[msg.sender] -= amount;

        if (userStakes[msg.sender] == 0) {
            hasStaked[msg.sender] = false;
        }

        token.transfer(msg.sender, amountAfterFee);

        emit Unstaked(msg.sender, amountAfterFee);
    }

    function pay() internal {
        uint256 contractBalance = token.balanceOf(address(this));
        uint256 rewardPool = contractBalance - totalStaked;

        // Distribute rewards proportionally based on the user's staked balance.
        for (uint256 i = 0; i < stakers.length; i++) {
            address account = stakers[i];
            if (userStakes[account] > 0) {
                uint256 reward = (userStakes[account] * rewardPool) / totalStaked;
                userRewards[account] += reward;
                emit RewardsUpdated(account, reward);
            }
        }

        lastPayTime = block.timestamp;
    }

    function claimRewards() external {
        uint256 reward = userRewards[msg.sender];
        require(reward > 0, "No rewards to claim");

        userRewards[msg.sender] = 0;
        token.transfer(msg.sender, reward);

        emit RewardPaid(msg.sender, reward);
    }

    function getStakers() external view returns (address[] memory) {
        return stakers;
    }
}
