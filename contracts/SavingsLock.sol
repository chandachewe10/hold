// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title SavingsLock
 * @notice A self-custodial savings contract where funds are locked until specific conditions are met.
 * @dev Funds can be locked based on time, a target amount, or both. 
 *      There is NO admin override and NO emergency withdraw. 
 *      The contract is fully immutable and trustless.
 */
contract SavingsLock {
    
    struct Lock {
        uint256 amount;           // Amount currently in the lock
        uint256 unlockTime;       // Timestamp when funds can be withdrawn (0 if no time lock)
        uint256 targetAmount;     // Target amount required to withdraw (0 if no target amount)
        bool withdrawn;           // Flag to prevent double withdrawal
        address owner;            // Owner of the funds
    }

    // Mapping from lock ID to Lock details
    mapping(uint256 => Lock) public locks;
    
    // Mapping from user to their lock IDs
    mapping(address => uint256[]) public userLocks;

    // Counter for lock IDs
    uint256 public nextLockId;

    // Events
    event LockCreated(uint256 indexed lockId, address indexed owner, uint256 unlockTime, uint256 targetAmount, uint256 initialAmount);
    event Deposited(uint256 indexed lockId, uint256 amount, uint256 totalAmount);
    event Withdrawn(uint256 indexed lockId, uint256 amount);

    /**
     * @notice Create a new savings lock.
     * @param _unlockTime The timestamp after which funds can be withdrawn. Set to 0 for no time lock.
     * @param _targetAmount The amount that must be reached before withdrawal. Set to 0 for no target amount.
     * @dev Pass msg.value to deposit initial funds.
     */
    function createLock(uint256 _unlockTime, uint256 _targetAmount) external payable {
        // Ensure at least one condition is set to avoid accidental indefinite locking if logic were different,
        // but here 0/0 just means "withdraw anytime", which is essentially a regular wallet.
        // We allow 0/0 for flexibility, though it defeats the purpose of "saving".
        
        uint256 lockId = nextLockId;
        nextLockId++;

        locks[lockId] = Lock({
            amount: msg.value,
            unlockTime: _unlockTime,
            targetAmount: _targetAmount,
            withdrawn: false,
            owner: msg.sender
        });
        
        userLocks[msg.sender].push(lockId);

        emit LockCreated(lockId, msg.sender, _unlockTime, _targetAmount, msg.value);
    }

    /**
     * @notice Deposit more funds into an existing lock.
     * @param _lockId The ID of the lock to deposit into.
     */
    function deposit(uint256 _lockId) external payable {
        Lock storage userLock = locks[_lockId];
        
        // Although anyone *could* deposit, it's usually the owner. 
        // We don't restrict deposits, but we do check the lock exists.
        require(userLock.owner != address(0), "Lock does not exist");
        require(!userLock.withdrawn, "Lock already withdrawn");

        userLock.amount += msg.value;

        emit Deposited(_lockId, msg.value, userLock.amount);
    }

    /**
     * @notice Withdraw funds from a lock if conditions are met.
     * @param _lockId The ID of the lock to withdraw from.
     */
    function withdraw(uint256 _lockId) external {
        Lock storage userLock = locks[_lockId];

        require(msg.sender == userLock.owner, "Not the owner");
        require(!userLock.withdrawn, "Already withdrawn");
        
        // Check Time Condition
        if (userLock.unlockTime > 0) {
            require(block.timestamp >= userLock.unlockTime, "Time condition not met");
        }

        // Check Target Amount Condition
        if (userLock.targetAmount > 0) {
            require(userLock.amount >= userLock.targetAmount, "Target amount not reached");
        }

        // Mark as withdrawn BEFORE transfer to prevent reentrancy
        userLock.withdrawn = true;
        uint256 amountToTransfer = userLock.amount;
        userLock.amount = 0; // Clear amount just in case

        // Transfer funds
        (bool sent, ) = msg.sender.call{value: amountToTransfer}("");
        require(sent, "Failed to send Ether");

        emit Withdrawn(_lockId, amountToTransfer);
    }

    /**
     * @notice Get details of a specific lock.
     */
    function getLock(uint256 _lockId) external view returns (Lock memory) {
        return locks[_lockId];
    }

    /**
     * @notice Get all lock IDs for a specific user.
     */
    function getUserLocks(address _user) external view returns (uint256[] memory) {
        return userLocks[_user];
    }
}
