# ChildValidatorSet

## Methods

### ACTIVE_VALIDATOR_SET_SIZE

```solidity
function ACTIVE_VALIDATOR_SET_SIZE() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### MAX_COMMISSION

```solidity
function MAX_COMMISSION() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### MAX_VALIDATOR_SET_SIZE

```solidity
function MAX_VALIDATOR_SET_SIZE() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### NATIVE_TOKEN_CONTRACT

```solidity
function NATIVE_TOKEN_CONTRACT() external view returns (address)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### NATIVE_TRANSFER_PRECOMPILE

```solidity
function NATIVE_TRANSFER_PRECOMPILE() external view returns (address)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### NATIVE_TRANSFER_PRECOMPILE_GAS

```solidity
function NATIVE_TRANSFER_PRECOMPILE_GAS() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### NEW_VALIDATOR_SIG

```solidity
function NEW_VALIDATOR_SIG() external view returns (bytes32)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | bytes32 | undefined   |

### REWARD_PRECISION

```solidity
function REWARD_PRECISION() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### SPRINT

```solidity
function SPRINT() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### SYSTEM

```solidity
function SYSTEM() external view returns (address)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### VALIDATOR_PKCHECK_PRECOMPILE

```solidity
function VALIDATOR_PKCHECK_PRECOMPILE() external view returns (address)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### VALIDATOR_PKCHECK_PRECOMPILE_GAS

```solidity
function VALIDATOR_PKCHECK_PRECOMPILE_GAS() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### WITHDRAWAL_WAIT_PERIOD

```solidity
function WITHDRAWAL_WAIT_PERIOD() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### addToWhitelist

```solidity
function addToWhitelist(address[] whitelistAddreses) external nonpayable
```

Adds addresses that are allowed to register as validators.

#### Parameters

| Name              | Type      | Description                   |
| ----------------- | --------- | ----------------------------- |
| whitelistAddreses | address[] | Array of address to whitelist |

### bls

```solidity
function bls() external view returns (contract IBLS)
```

#### Returns

| Name | Type          | Description |
| ---- | ------------- | ----------- |
| \_0  | contract IBLS | undefined   |

### claimDelegatorReward

```solidity
function claimDelegatorReward(address validator, bool restake) external nonpayable
```

Claims delegator rewards for sender.

#### Parameters

| Name      | Type    | Description                               |
| --------- | ------- | ----------------------------------------- |
| validator | address | Validator to claim from                   |
| restake   | bool    | Whether to redelegate the claimed rewards |

### claimOwnership

```solidity
function claimOwnership() external nonpayable
```

allows proposed owner to claim ownership (step 2 of transferring ownership)

_can only be called by the new proposed owner_

### claimValidatorReward

```solidity
function claimValidatorReward() external nonpayable
```

Claims validator rewards for sender.

### commitEpoch

```solidity
function commitEpoch(uint256 id, Epoch epoch, Uptime uptime) external nonpayable
```

#### Parameters

| Name   | Type    | Description |
| ------ | ------- | ----------- |
| id     | uint256 | undefined   |
| epoch  | Epoch   | undefined   |
| uptime | Uptime  | undefined   |

### currentEpochId

```solidity
function currentEpochId() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### delegate

```solidity
function delegate(address validator, bool restake) external payable
```

Delegates sent amount to validator. Claims rewards beforehand.

#### Parameters

| Name      | Type    | Description                               |
| --------- | ------- | ----------------------------------------- |
| validator | address | Validator to delegate to                  |
| restake   | bool    | Whether to redelegate the claimed rewards |

### delegationOf

```solidity
function delegationOf(address validator, address delegator) external view returns (uint256)
```

Gets amount delegated by delegator to validator.

#### Parameters

| Name      | Type    | Description          |
| --------- | ------- | -------------------- |
| validator | address | Address of validator |
| delegator | address | Address of delegator |

#### Returns

| Name | Type    | Description                     |
| ---- | ------- | ------------------------------- |
| \_0  | uint256 | Amount delegated (in MATIC wei) |

### epochEndBlocks

```solidity
function epochEndBlocks(uint256) external view returns (uint256)
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### epochReward

```solidity
function epochReward() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### epochs

```solidity
function epochs(uint256) external view returns (uint256 startBlock, uint256 endBlock, bytes32 epochRoot)
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

#### Returns

| Name       | Type    | Description |
| ---------- | ------- | ----------- |
| startBlock | uint256 | undefined   |
| endBlock   | uint256 | undefined   |
| epochRoot  | bytes32 | undefined   |

### getCurrentValidatorSet

```solidity
function getCurrentValidatorSet() external view returns (address[])
```

Gets addresses of active validators in this epoch, sorted by total stake (self-stake + delegation)

#### Returns

| Name | Type      | Description                                                                  |
| ---- | --------- | ---------------------------------------------------------------------------- |
| \_0  | address[] | Array of addresses of active validators in this epoch, sorted by total stake |

### getDelegatorReward

```solidity
function getDelegatorReward(address validator, address delegator) external view returns (uint256)
```

Gets delegators&#39;s claimable rewards from validator.

#### Parameters

| Name      | Type    | Description          |
| --------- | ------- | -------------------- |
| validator | address | Address of validator |
| delegator | address | Address of delegator |

#### Returns

| Name | Type    | Description                                                        |
| ---- | ------- | ------------------------------------------------------------------ |
| \_0  | uint256 | Delegator&#39;s withdrawable rewards from validator (in MATIC wei) |

### getEpochByBlock

```solidity
function getEpochByBlock(uint256 blockNumber) external view returns (struct Epoch)
```

Look up an epoch by block number. Searches in O(log n) time.

#### Parameters

| Name        | Type    | Description                 |
| ----------- | ------- | --------------------------- |
| blockNumber | uint256 | ID of epoch to be committed |

#### Returns

| Name | Type  | Description                                           |
| ---- | ----- | ----------------------------------------------------- |
| \_0  | Epoch | Epoch Returns epoch if found, or else, the last epoch |

### getValidator

```solidity
function getValidator(address validator) external view returns (struct Validator)
```

Gets validator by address.

#### Parameters

| Name      | Type    | Description |
| --------- | ------- | ----------- |
| validator | address | undefined   |

#### Returns

| Name | Type      | Description                                                                                            |
| ---- | --------- | ------------------------------------------------------------------------------------------------------ |
| \_0  | Validator | Validator (BLS public key, self-stake, total stake, commission, withdrawable rewards, activity status) |

### getValidatorReward

```solidity
function getValidatorReward(address validator) external view returns (uint256)
```

Gets validator&#39;s withdrawable rewards.

#### Parameters

| Name      | Type    | Description          |
| --------- | ------- | -------------------- |
| validator | address | Address of validator |

#### Returns

| Name | Type    | Description                                         |
| ---- | ------- | --------------------------------------------------- |
| \_0  | uint256 | Validator&#39;s withdrawable rewards (in MATIC wei) |

### initialize

```solidity
function initialize(uint256 newEpochReward, uint256 newMinStake, uint256 newMinDelegation, address[] validatorAddresses, uint256[4][] validatorPubkeys, uint256[] validatorStakes, contract IBLS newBls, uint256[2] newMessage, address governance) external nonpayable
```

Initializer function for genesis contract, called by v3 client at genesis to set up the initial set.

_only callable by client, can only be called once_

#### Parameters

| Name               | Type          | Description                                        |
| ------------------ | ------------- | -------------------------------------------------- |
| newEpochReward     | uint256       | reward for a proposed epoch                        |
| newMinStake        | uint256       | minimum stake to become a validator                |
| newMinDelegation   | uint256       | minimum amount to delegate to a validator          |
| validatorAddresses | address[]     | addresses of initial validators                    |
| validatorPubkeys   | uint256[4][]  | uint256[4] BLS public keys of initial validators   |
| validatorStakes    | uint256[]     | amount staked per initial validator                |
| newBls             | contract IBLS | address pf BLS contract/precompile                 |
| newMessage         | uint256[2]    | message for BLS signing                            |
| governance         | address       | Governance address to set as owner of the contract |

### message

```solidity
function message(uint256) external view returns (uint256)
```

Message to sign for registration

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### minDelegation

```solidity
function minDelegation() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### minStake

```solidity
function minStake() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### owner

```solidity
function owner() external view returns (address)
```

the address of the owner

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### pendingWithdrawals

```solidity
function pendingWithdrawals(address account) external view returns (uint256)
```

Calculates how much is yet to become withdrawable for account.

#### Parameters

| Name    | Type    | Description                         |
| ------- | ------- | ----------------------------------- |
| account | address | The account to calculate amount for |

#### Returns

| Name | Type    | Description                                |
| ---- | ------- | ------------------------------------------ |
| \_0  | uint256 | Amount not yet withdrawable (in MATIC wei) |

### proposeOwner

```solidity
function proposeOwner(address payable newOwner) external nonpayable
```

proposes a new owner (step 1 of transferring ownership)

_can only be called by the current owner_

#### Parameters

| Name     | Type            | Description |
| -------- | --------------- | ----------- |
| newOwner | address payable | undefined   |

### proposedOwner

```solidity
function proposedOwner() external view returns (address)
```

the address of a proposed owner

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### register

```solidity
function register(uint256[2] signature, uint256[4] pubkey) external nonpayable
```

Validates BLS signature with the provided pubkey and registers validators into the set.

#### Parameters

| Name      | Type       | Description                           |
| --------- | ---------- | ------------------------------------- |
| signature | uint256[2] | Signature to validate message against |
| pubkey    | uint256[4] | BLS public key of validator           |

### removeFromWhitelist

```solidity
function removeFromWhitelist(address[] whitelistAddreses) external nonpayable
```

Deletes addresses that are allowed to register as validators.

#### Parameters

| Name              | Type      | Description                               |
| ----------------- | --------- | ----------------------------------------- |
| whitelistAddreses | address[] | Array of address to remove from whitelist |

### setCommission

```solidity
function setCommission(uint256 newCommission) external nonpayable
```

Sets commission for validator.

#### Parameters

| Name          | Type    | Description                 |
| ------------- | ------- | --------------------------- |
| newCommission | uint256 | New commission (100 = 100%) |

### sortedValidators

```solidity
function sortedValidators(uint256 n) external view returns (address[])
```

Gets first n active validators sorted by total stake.

#### Parameters

| Name | Type    | Description                            |
| ---- | ------- | -------------------------------------- |
| n    | uint256 | Desired number of validators to return |

#### Returns

| Name | Type      | Description                                                                                                                       |
| ---- | --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| \_0  | address[] | Returns array of addresses of first n active validators sorted by total stake, or fewer if there are not enough active validators |

### stake

```solidity
function stake() external payable
```

Stakes sent amount. Claims rewards beforehand.

### totalActiveStake

```solidity
function totalActiveStake() external view returns (uint256 activeStake)
```

Calculates total stake of active validators (self-stake + delegation).

#### Returns

| Name        | Type    | Description                                     |
| ----------- | ------- | ----------------------------------------------- |
| activeStake | uint256 | Total stake of active validators (in MATIC wei) |

### totalStake

```solidity
function totalStake() external view returns (uint256)
```

Calculates total stake in the network (self-stake + delegation).

#### Returns

| Name | Type    | Description                |
| ---- | ------- | -------------------------- |
| \_0  | uint256 | Total stake (in MATIC wei) |

### undelegate

```solidity
function undelegate(address validator, uint256 amount) external nonpayable
```

Undelegates amount from validator for sender. Claims rewards beforehand.

#### Parameters

| Name      | Type    | Description                  |
| --------- | ------- | ---------------------------- |
| validator | address | Validator to undelegate from |
| amount    | uint256 | The amount to undelegate     |

### unstake

```solidity
function unstake(uint256 amount) external nonpayable
```

Unstakes amount for sender. Claims rewards beforehand.

#### Parameters

| Name   | Type    | Description       |
| ------ | ------- | ----------------- |
| amount | uint256 | Amount to unstake |

### whitelist

```solidity
function whitelist(address) external view returns (bool)
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### withdraw

```solidity
function withdraw(address to) external nonpayable
```

Withdraws sender&#39;s withdrawable amount to specified address.

#### Parameters

| Name | Type    | Description            |
| ---- | ------- | ---------------------- |
| to   | address | Address to withdraw to |

### withdrawable

```solidity
function withdrawable(address account) external view returns (uint256 amount)
```

Calculates how much can be withdrawn for account in this epoch.

#### Parameters

| Name    | Type    | Description                         |
| ------- | ------- | ----------------------------------- |
| account | address | The account to calculate amount for |

#### Returns

| Name   | Type    | Description                        |
| ------ | ------- | ---------------------------------- |
| amount | uint256 | Amount withdrawable (in MATIC wei) |

## Events

### AddedToWhitelist

```solidity
event AddedToWhitelist(address indexed validator)
```

#### Parameters

| Name                | Type    | Description |
| ------------------- | ------- | ----------- |
| validator `indexed` | address | undefined   |

### Delegated

```solidity
event Delegated(address indexed delegator, address indexed validator, uint256 amount)
```

#### Parameters

| Name                | Type    | Description |
| ------------------- | ------- | ----------- |
| delegator `indexed` | address | undefined   |
| validator `indexed` | address | undefined   |
| amount              | uint256 | undefined   |

### DelegatorRewardClaimed

```solidity
event DelegatorRewardClaimed(address indexed delegator, address indexed validator, bool indexed restake, uint256 amount)
```

#### Parameters

| Name                | Type    | Description |
| ------------------- | ------- | ----------- |
| delegator `indexed` | address | undefined   |
| validator `indexed` | address | undefined   |
| restake `indexed`   | bool    | undefined   |
| amount              | uint256 | undefined   |

### DelegatorRewardDistributed

```solidity
event DelegatorRewardDistributed(address indexed validator, uint256 amount)
```

#### Parameters

| Name                | Type    | Description |
| ------------------- | ------- | ----------- |
| validator `indexed` | address | undefined   |
| amount              | uint256 | undefined   |

### Initialized

```solidity
event Initialized(uint8 version)
```

#### Parameters

| Name    | Type  | Description |
| ------- | ----- | ----------- |
| version | uint8 | undefined   |

### NewEpoch

```solidity
event NewEpoch(uint256 indexed id, uint256 indexed startBlock, uint256 indexed endBlock, bytes32 epochRoot)
```

#### Parameters

| Name                 | Type    | Description |
| -------------------- | ------- | ----------- |
| id `indexed`         | uint256 | undefined   |
| startBlock `indexed` | uint256 | undefined   |
| endBlock `indexed`   | uint256 | undefined   |
| epochRoot            | bytes32 | undefined   |

### NewValidator

```solidity
event NewValidator(address indexed validator, uint256[4] blsKey)
```

#### Parameters

| Name                | Type       | Description |
| ------------------- | ---------- | ----------- |
| validator `indexed` | address    | undefined   |
| blsKey              | uint256[4] | undefined   |

### OwnershipProposed

```solidity
event OwnershipProposed(address indexed proposedOwner)
```

#### Parameters

| Name                    | Type    | Description |
| ----------------------- | ------- | ----------- |
| proposedOwner `indexed` | address | undefined   |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```

#### Parameters

| Name                    | Type    | Description |
| ----------------------- | ------- | ----------- |
| previousOwner `indexed` | address | undefined   |
| newOwner `indexed`      | address | undefined   |

### RemovedFromWhitelist

```solidity
event RemovedFromWhitelist(address indexed validator)
```

#### Parameters

| Name                | Type    | Description |
| ------------------- | ------- | ----------- |
| validator `indexed` | address | undefined   |

### Staked

```solidity
event Staked(address indexed validator, uint256 amount)
```

#### Parameters

| Name                | Type    | Description |
| ------------------- | ------- | ----------- |
| validator `indexed` | address | undefined   |
| amount              | uint256 | undefined   |

### Undelegated

```solidity
event Undelegated(address indexed delegator, address indexed validator, uint256 amount)
```

#### Parameters

| Name                | Type    | Description |
| ------------------- | ------- | ----------- |
| delegator `indexed` | address | undefined   |
| validator `indexed` | address | undefined   |
| amount              | uint256 | undefined   |

### Unstaked

```solidity
event Unstaked(address indexed validator, uint256 amount)
```

#### Parameters

| Name                | Type    | Description |
| ------------------- | ------- | ----------- |
| validator `indexed` | address | undefined   |
| amount              | uint256 | undefined   |

### ValidatorRewardClaimed

```solidity
event ValidatorRewardClaimed(address indexed validator, uint256 amount)
```

#### Parameters

| Name                | Type    | Description |
| ------------------- | ------- | ----------- |
| validator `indexed` | address | undefined   |
| amount              | uint256 | undefined   |

### ValidatorRewardDistributed

```solidity
event ValidatorRewardDistributed(address indexed validator, uint256 amount)
```

#### Parameters

| Name                | Type    | Description |
| ------------------- | ------- | ----------- |
| validator `indexed` | address | undefined   |
| amount              | uint256 | undefined   |

### Withdrawal

```solidity
event Withdrawal(address indexed account, address indexed to, uint256 amount)
```

#### Parameters

| Name              | Type    | Description |
| ----------------- | ------- | ----------- |
| account `indexed` | address | undefined   |
| to `indexed`      | address | undefined   |
| amount            | uint256 | undefined   |

### WithdrawalRegistered

```solidity
event WithdrawalRegistered(address indexed account, uint256 amount)
```

#### Parameters

| Name              | Type    | Description |
| ----------------- | ------- | ----------- |
| account `indexed` | address | undefined   |
| amount            | uint256 | undefined   |

## Errors

### AmountZero

```solidity
error AmountZero()
```

### Exists

```solidity
error Exists(address validator)
```

#### Parameters

| Name      | Type    | Description |
| --------- | ------- | ----------- |
| validator | address | undefined   |

### NoTokensDelegated

```solidity
error NoTokensDelegated(address validator)
```

#### Parameters

| Name      | Type    | Description |
| --------- | ------- | ----------- |
| validator | address | undefined   |

### NotFound

```solidity
error NotFound(address validator)
```

#### Parameters

| Name      | Type    | Description |
| --------- | ------- | ----------- |
| validator | address | undefined   |

### StakeRequirement

```solidity
error StakeRequirement(string src, string msg)
```

#### Parameters

| Name | Type   | Description |
| ---- | ------ | ----------- |
| src  | string | undefined   |
| msg  | string | undefined   |

### Unauthorized

```solidity
error Unauthorized(string only)
```

#### Parameters

| Name | Type   | Description |
| ---- | ------ | ----------- |
| only | string | undefined   |
