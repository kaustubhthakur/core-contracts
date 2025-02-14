import { expect } from "chai";
import * as hre from "hardhat";
import { ethers, upgrades } from "hardhat";
import { Signer, BigNumber } from "ethers";
import * as mcl from "../../ts/mcl";
import { expandMsg } from "../../ts/hashToField";
// import { alwaysTrueBytecode, alwaysFalseBytecode } from "../constants";
import { BLS, ChildValidatorSet } from "../../typechain";
import { customError } from "../util";
import { setBalance } from "@nomicfoundation/hardhat-network-helpers";

const DOMAIN = ethers.utils.arrayify(ethers.utils.hexlify(ethers.utils.randomBytes(32)));

const MAX_COMMISSION = 100;

describe("ChildValidatorSet", () => {
  let bls: BLS,
    rootValidatorSetAddress: string,
    governance: string,
    childValidatorSet: ChildValidatorSet,
    systemChildValidatorSet: ChildValidatorSet,
    childValidatorSetValidatorSet: ChildValidatorSet,
    stateSyncChildValidatorSet: ChildValidatorSet,
    validatorSetSize: number,
    validatorStake: BigNumber,
    epochReward: BigNumber,
    minStake: number,
    minDelegation: number,
    id: number,
    epoch: any,
    uptime: any,
    childValidatorSetBalance: BigNumber,
    accounts: any[]; // we use any so we can access address directly from object
  before(async () => {
    await mcl.init();
    accounts = await ethers.getSigners();

    rootValidatorSetAddress = ethers.Wallet.createRandom().address;

    governance = accounts[0].address;
    epochReward = ethers.utils.parseEther("0.0000001");
    minStake = 10000;
    minDelegation = 10000;

    const ChildValidatorSet = await ethers.getContractFactory("ChildValidatorSet");
    childValidatorSet = await ChildValidatorSet.deploy();

    await childValidatorSet.deployed();

    bls = await (await ethers.getContractFactory("BLS")).deploy();
    await bls.deployed();

    await hre.network.provider.send("hardhat_setBalance", [
      "0xffffFFFfFFffffffffffffffFfFFFfffFFFfFFfE",
      "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
    ]);
    await hre.network.provider.send("hardhat_setBalance", [
      "0x0000000000000000000000000000000000001001",
      "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
    ]);
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0xffffFFFfFFffffffffffffffFfFFFfffFFFfFFfE"],
    });
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x0000000000000000000000000000000000001001"],
    });
    const systemSigner = await ethers.getSigner("0xffffFFFfFFffffffffffffffFfFFFfffFFFfFFfE");
    const stateSyncSigner = await ethers.getSigner("0x0000000000000000000000000000000000001001");
    // await hre.network.provider.send("hardhat_setCode", [
    //   "0x0000000000000000000000000000000000002030",
    //   alwaysTrueBytecode,
    // ]);
    systemChildValidatorSet = childValidatorSet.connect(systemSigner);
    stateSyncChildValidatorSet = childValidatorSet.connect(stateSyncSigner);
  });
  it("Initialize without system call", async () => {
    await expect(
      childValidatorSet.initialize(
        epochReward,
        minStake,
        minDelegation,
        [accounts[0].address],
        [[0, 0, 0, 0]],
        [minStake * 2],
        bls.address,
        [0, 0],
        governance
      )
    ).to.be.revertedWith('Unauthorized("SYSTEMCALL")');
  });
  it("Initialize and validate initialization", async () => {
    validatorSetSize = Math.floor(Math.random() * (5 - 1) + 5); // Randomly pick 5-9
    validatorStake = ethers.utils.parseEther(String(Math.floor(Math.random() * (10000 - 1000) + 1000)));
    const epochValidatorSet = [];

    for (let i = 0; i < validatorSetSize; i++) {
      epochValidatorSet.push(accounts[i].address);
    }

    const messagePoint = mcl.g1ToHex(
      mcl.hashToPoint(ethers.utils.hexlify(ethers.utils.toUtf8Bytes("polygon-v3-validator")), DOMAIN)
    );

    expect(await childValidatorSet.totalActiveStake()).to.equal(0);

    await systemChildValidatorSet.initialize(
      epochReward,
      minStake,
      minDelegation,
      [accounts[0].address],
      [[0, 0, 0, 0]],
      [minStake * 2],
      bls.address,
      messagePoint,
      governance
    );

    expect(await childValidatorSet.epochReward()).to.equal(epochReward);
    expect(await childValidatorSet.minStake()).to.equal(minStake);
    expect(await childValidatorSet.minDelegation()).to.equal(minDelegation);
    expect(await childValidatorSet.currentEpochId()).to.equal(1);
    expect(await childValidatorSet.owner()).to.equal(accounts[0].address);

    const currentEpochId = await childValidatorSet.currentEpochId();
    expect(currentEpochId).to.equal(1);

    expect(await childValidatorSet.whitelist(accounts[0].address)).to.equal(true);
    const validator = await childValidatorSet.getValidator(accounts[0].address);
    expect(validator.blsKey.toString()).to.equal("0,0,0,0");
    expect(validator.stake).to.equal(minStake * 2);
    expect(validator.totalStake).to.equal(minStake * 2);
    expect(validator.commission).to.equal(0);
    expect(await childValidatorSet.bls()).to.equal(bls.address);
    expect(await childValidatorSet.message(0)).to.equal(messagePoint[0]);
    expect(await childValidatorSet.message(1)).to.equal(messagePoint[1]);
    expect(await childValidatorSet.totalActiveStake()).to.equal(minStake * 2);
  });
  it("Attempt reinitialization", async () => {
    await expect(
      systemChildValidatorSet.initialize(
        epochReward,
        minStake,
        minDelegation,
        [accounts[0].address],
        [[0, 0, 0, 0]],
        [minStake * 2],
        bls.address,
        [0, 0],
        governance
      )
    ).to.be.revertedWith("Initializable: contract is already initialized");
  });
  it("Commit epoch without system call", async () => {
    id = 0;
    epoch = {
      startBlock: 0,
      endBlock: 0,
      epochRoot: ethers.utils.randomBytes(32),
      validatorSet: [],
    };

    uptime = {
      epochId: 0,
      uptimeData: [{ validator: accounts[0].address, signedBlocks: 0 }],
      totalBlocks: 0,
    };

    await expect(childValidatorSet.commitEpoch(id, epoch, uptime)).to.be.revertedWith('Unauthorized("SYSTEMCALL")');
  });
  it("Commit epoch with unexpected id", async () => {
    id = 0;
    epoch = {
      startBlock: 0,
      endBlock: 0,
      epochRoot: ethers.utils.randomBytes(32),
      validatorSet: [],
    };

    uptime = {
      epochId: 0,
      uptimeData: [{ validator: accounts[0].address, signedBlocks: 0 }],
      totalBlocks: 0,
    };

    await expect(systemChildValidatorSet.commitEpoch(id, epoch, uptime)).to.be.revertedWith("UNEXPECTED_EPOCH_ID");
  });
  it("Commit epoch with no blocks committed", async () => {
    id = 1;
    epoch = {
      startBlock: 0,
      endBlock: 0,
      epochRoot: ethers.utils.randomBytes(32),
      validatorSet: [],
    };

    uptime = {
      epochId: 0,
      uptimeData: [{ validator: accounts[0].address, signedBlocks: 0 }],
      totalBlocks: 0,
    };

    await expect(systemChildValidatorSet.commitEpoch(id, epoch, uptime)).to.be.revertedWith("NO_BLOCKS_COMMITTED");
  });
  it("Commit epoch with incomplete sprint", async () => {
    id = 1;
    epoch = {
      startBlock: 1,
      endBlock: 63,
      epochRoot: ethers.utils.randomBytes(32),
      validatorSet: [],
    };

    uptime = {
      epochId: 0,
      uptimeData: [{ validator: accounts[0].address, signedBlocks: 0 }],
      totalBlocks: 0,
    };

    await expect(systemChildValidatorSet.commitEpoch(id, epoch, uptime)).to.be.revertedWith(
      "EPOCH_MUST_BE_DIVISIBLE_BY_64"
    );
  });
  it("Commit epoch with not committed epoch", async () => {
    id = 1;
    epoch = {
      startBlock: 1,
      endBlock: 64,
      epochRoot: ethers.utils.randomBytes(32),
      validatorSet: [],
    };

    uptime = {
      epochId: 2,
      uptimeData: [{ validator: accounts[0].address, signedBlocks: 0 }],
      totalBlocks: 0,
    };

    await expect(systemChildValidatorSet.commitEpoch(id, epoch, uptime)).to.be.revertedWith("EPOCH_NOT_COMMITTED");
  });
  it("Commit epoch with invalid length", async () => {
    id = 1;
    epoch = {
      startBlock: 1,
      endBlock: 64,
      epochRoot: ethers.utils.randomBytes(32),
      validatorSet: [],
    };

    const currentEpochId = await childValidatorSet.currentEpochId();
    uptime = {
      epochId: currentEpochId,
      uptimeData: [
        { validator: accounts[0].address, signedBlocks: 0 },
        { validator: accounts[0].address, signedBlocks: 0 },
      ],
      totalBlocks: 0,
    };

    await expect(systemChildValidatorSet.commitEpoch(id, epoch, uptime)).to.be.revertedWith("INVALID_LENGTH");
  });
  it("Commit epoch", async () => {
    id = 1;
    epoch = {
      startBlock: BigNumber.from(1),
      endBlock: BigNumber.from(64),
      epochRoot: ethers.utils.randomBytes(32),
      validatorSet: [accounts[0].address],
    };

    const currentEpochId = await childValidatorSet.currentEpochId();
    const currentValidatorId = await childValidatorSet.currentEpochId();

    uptime = {
      epochId: currentEpochId,
      uptimeData: [{ validator: accounts[0].address, signedBlocks: 1000000000000 }],
      totalBlocks: 1,
    };

    await systemChildValidatorSet.commitEpoch(id, epoch, uptime);
    const storedEpoch: any = await childValidatorSet.epochs(1);
    expect(storedEpoch.startBlock).to.equal(epoch.startBlock);
    expect(storedEpoch.endBlock).to.equal(epoch.endBlock);
    expect(storedEpoch.epochRoot).to.equal(ethers.utils.hexlify(epoch.epochRoot));
  });

  it("Commit epoch with old block", async () => {
    const epoch = {
      startBlock: 64,
      endBlock: 127,
      epochRoot: ethers.utils.randomBytes(32),
      validatorSet: [],
    };

    uptime = {
      epochId: 0,
      uptimeData: [{ validator: accounts[0].address, signedBlocks: 0 }],
      totalBlocks: 1,
    };

    await expect(systemChildValidatorSet.commitEpoch(2, epoch, uptime)).to.be.revertedWith("INVALID_START_BLOCK");
  });

  it("Get current validators", async () => {
    expect(await childValidatorSet.getCurrentValidatorSet()).to.deep.equal([accounts[0].address]);
  });
  it("Get epoch by block", async () => {
    const storedEpoch = await childValidatorSet.getEpochByBlock(64);
    expect(storedEpoch.startBlock).to.equal(epoch.startBlock);
    expect(storedEpoch.endBlock).to.equal(epoch.endBlock);
    expect(storedEpoch.epochRoot).to.equal(ethers.utils.hexlify(epoch.epochRoot));
  });
  it("Get non-existent epoch by block", async () => {
    const storedEpoch = await childValidatorSet.getEpochByBlock(65);
    expect(storedEpoch.startBlock).to.equal(ethers.constants.Zero);
    expect(storedEpoch.endBlock).to.equal(ethers.constants.Zero);
    expect(storedEpoch.epochRoot).to.equal(ethers.constants.HashZero);
  });

  it("Commit epoch for validator without staking", async () => {
    id = 2;
    epoch = {
      startBlock: 65,
      endBlock: 128,
      epochRoot: ethers.utils.randomBytes(32),
      validatorSet: [accounts[1].address],
    };

    const currentEpochId = await childValidatorSet.currentEpochId();
    const currentValidatorId = await childValidatorSet.currentEpochId();

    uptime = {
      epochId: currentEpochId,
      uptimeData: [{ validator: accounts[1].address, signedBlocks: 1000000000000 }],
      totalBlocks: 1,
    };

    await systemChildValidatorSet.commitEpoch(id, epoch, uptime);
    const storedEpoch: any = await childValidatorSet.epochs(2);
    expect(storedEpoch.startBlock).to.equal(epoch.startBlock);
    expect(storedEpoch.endBlock).to.equal(epoch.endBlock);
    expect(storedEpoch.epochRoot).to.equal(ethers.utils.hexlify(epoch.epochRoot));
  });

  // it("Get and set current validators when exceeds active validator set size", async () => {
  //   const currentValidatorId = await childValidatorSet.currentEpochId();

  //   epoch = {
  //     startBlock: 129,
  //     endBlock: 192,
  //     epochRoot: ethers.utils.randomBytes(32),
  //     validatorSet: [],
  //   };

  //   const currentEpochId = await childValidatorSet.currentEpochId();

  //   uptime = {
  //     epochId: currentEpochId,
  //     uptimeData: [{ validator: accounts[0].address, signedBlocks: 1000000000000 }],
  //     totalBlocks: 1,
  //   };

  //   await systemChildValidatorSet.commitEpoch(3, epoch, uptime); // commit epoch to update validator set
  // });

  describe("whitelist", async () => {
    it("only owner should be able to modify whitelist", async () => {
      await expect(childValidatorSet.connect(accounts[1]).addToWhitelist([accounts[1].address])).to.be.revertedWith(
        customError("Unauthorized", "OWNER")
      );
      await expect(
        childValidatorSet.connect(accounts[1]).removeFromWhitelist([accounts[1].address])
      ).to.be.revertedWith(customError("Unauthorized", "OWNER"));
    });
    it("should be able to add to whitelist", async () => {
      await expect(childValidatorSet.addToWhitelist([accounts[1].address, accounts[2].address])).to.not.be.reverted;
      expect(await childValidatorSet.whitelist(accounts[1].address)).to.be.true;
      expect(await childValidatorSet.whitelist(accounts[2].address)).to.be.true;
    });
    it("should be able to remove from whitelist", async () => {
      await expect(childValidatorSet.removeFromWhitelist([accounts[1].address])).to.not.be.reverted;
      expect(await childValidatorSet.whitelist(accounts[1].address)).to.be.false;
    });
  });

  describe("register", async () => {
    it("only whitelisted should be able to register", async () => {
      const message = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("polygon-v3-validator"));
      const { pubkey, secret } = mcl.newKeyPair();

      const signatures: mcl.Signature[] = [];

      const { signature, messagePoint } = mcl.sign(message, secret, ethers.utils.arrayify(DOMAIN));
      signatures.push(signature);

      const aggMessagePoint: mcl.MessagePoint = mcl.g1ToHex(mcl.aggregateRaw(signatures));

      await expect(
        childValidatorSet.connect(accounts[1]).register(aggMessagePoint, mcl.g2ToHex(pubkey))
      ).to.be.revertedWith(customError("Unauthorized", "WHITELIST"));
    });
    it("invalid signature", async () => {
      const { pubkey, secret } = mcl.newKeyPair();
      const message = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(""));
      const signatures: mcl.Signature[] = [];

      const { signature, messagePoint } = mcl.sign(message, secret, ethers.utils.arrayify(DOMAIN));
      signatures.push(signature);

      const aggMessagePoint: mcl.MessagePoint = mcl.g1ToHex(mcl.aggregateRaw(signatures));

      await expect(
        childValidatorSet.connect(accounts[2]).register(aggMessagePoint, mcl.g2ToHex(pubkey))
      ).to.be.revertedWith("INVALID_SIGNATURE");
    });
    it("Register", async () => {
      const message = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("polygon-v3-validator"));
      const { pubkey, secret } = mcl.newKeyPair();
      const { signature, messagePoint } = mcl.sign(message, secret, DOMAIN);
      const parsedPubkey = mcl.g2ToHex(pubkey);
      const tx = await childValidatorSet.connect(accounts[2]).register(mcl.g1ToHex(signature), parsedPubkey);
      const receipt = await tx.wait();
      const event = receipt.events?.find((log) => log.event === "NewValidator");
      expect(event?.args?.validator).to.equal(accounts[2].address);
      const parsedEventBlsKey = event?.args?.blsKey.map((elem: BigNumber) => ethers.utils.hexValue(elem.toHexString()));
      const strippedParsedPubkey = parsedPubkey.map((elem) => ethers.utils.hexValue(elem));
      expect(parsedEventBlsKey).to.deep.equal(strippedParsedPubkey);
      expect(await childValidatorSet.whitelist(accounts[2].address)).to.be.false;
      const validator = await childValidatorSet.getValidator(accounts[2].address);
      expect(validator.stake).to.equal(0);
      expect(validator.totalStake).to.equal(0);
      expect(validator.commission).to.equal(0);
      expect(validator.active).to.equal(true);
      const parsedValidatorBlsKey = validator.blsKey.map((elem: BigNumber) =>
        ethers.utils.hexValue(elem.toHexString())
      );
      expect(parsedValidatorBlsKey).to.deep.equal(strippedParsedPubkey);
    });
  });

  describe("stake", async () => {
    it("only whitelisted validators should be able to stake", async () => {
      await expect(childValidatorSet.connect(accounts[1]).stake({ value: minStake })).to.be.revertedWith(
        customError("Unauthorized", "VALIDATOR")
      );
    });

    it("should revert if min amount not reached", async () => {
      await expect(childValidatorSet.connect(accounts[2]).stake({ value: minStake - 1 })).to.be.revertedWith(
        customError("StakeRequirement", "stake", "STAKE_TOO_LOW")
      );
    });

    it("should be able to stake", async () => {
      await expect(childValidatorSet.connect(accounts[2]).stake({ value: minStake * 2 })).to.not.be.reverted;
      expect(await childValidatorSet.totalActiveStake()).to.equal(minStake * 2);
    });

    it("Get 0 sortedValidators", async () => {
      const validatorAddresses = await childValidatorSet.sortedValidators(0);
      expect(validatorAddresses).to.deep.equal([]);
    });
  });

  describe("queue processing", async () => {
    it("should be able to process queue", async () => {
      let validator = await childValidatorSet.getValidator(accounts[2].address);
      expect(validator.stake).to.equal(0);
      await expect(
        systemChildValidatorSet.commitEpoch(
          3,
          { startBlock: 129, endBlock: 192, epochRoot: ethers.constants.HashZero },
          { epochId: 3, uptimeData: [{ validator: accounts[0].address, signedBlocks: 1 }], totalBlocks: 1 }
        )
      ).to.not.be.reverted;
      validator = await childValidatorSet.getValidator(accounts[2].address);
      expect(validator.stake).to.equal(minStake * 2);
    });

    it("Get 2 sortedValidators ", async () => {
      const validatorAddresses = await childValidatorSet.sortedValidators(3);
      expect(validatorAddresses).to.deep.equal([accounts[2].address, accounts[0].address]);
    });
  });

  describe("unstake", async () => {
    it("non validators should not be able to unstake due to insufficient balance", async () => {
      await expect(childValidatorSet.connect(accounts[1]).unstake(1)).to.be.revertedWith(
        customError("StakeRequirement", "unstake", "INSUFFICIENT_BALANCE")
      );
    });

    it("should not be able to exploit int overflow", async () => {
      await expect(childValidatorSet.connect(accounts[1]).unstake(ethers.constants.MaxInt256.add(1))).to.be.reverted;
    });

    it("should not be able to unstake more than staked", async () => {
      await expect(childValidatorSet.unstake(minStake * 2 + 1)).to.be.revertedWith(
        customError("StakeRequirement", "unstake", "INSUFFICIENT_BALANCE")
      );
    });

    it("should not be able to unstake so that less than minstake is left", async () => {
      await expect(childValidatorSet.unstake(minStake + 1)).to.be.revertedWith(
        customError("StakeRequirement", "unstake", "STAKE_TOO_LOW")
      );
    });

    it("should be able to partially unstake", async () => {
      // await expect(childValidatorSet.connect(accounts[2]).unstake(minStake)).to.not.be.reverted;
      await childValidatorSet.connect(accounts[2]).unstake(minStake);
    });

    it("should take pending unstakes into account", async () => {
      await expect(childValidatorSet.connect(accounts[2]).unstake(minStake + 1)).to.be.revertedWith(
        customError("StakeRequirement", "unstake", "INSUFFICIENT_BALANCE")
      );
      await expect(childValidatorSet.connect(accounts[2]).unstake(1)).to.be.revertedWith(
        customError("StakeRequirement", "unstake", "STAKE_TOO_LOW")
      );
    });

    it("should be able to completely unstake", async () => {
      await expect(childValidatorSet.connect(accounts[2]).unstake(minStake)).to.not.be.reverted;
    });

    it("should place in withdrawal queue", async () => {
      expect(await childValidatorSet.pendingWithdrawals(accounts[2].address)).to.equal(minStake * 2);
      expect(await childValidatorSet.withdrawable(accounts[2].address)).to.equal(0);
    });

    it("should reflect balance after queue processing", async () => {
      let validator = await childValidatorSet.getValidator(accounts[2].address);
      expect(validator.stake).to.equal(minStake * 2);
      await expect(
        systemChildValidatorSet.commitEpoch(
          4,
          { startBlock: 193, endBlock: 256, epochRoot: ethers.constants.HashZero },
          {
            epochId: 4,
            uptimeData: [
              { validator: accounts[0].address, signedBlocks: 1 },
              { validator: accounts[2].address, signedBlocks: 1 },
            ],
            totalBlocks: 2,
          }
        )
      ).to.not.be.reverted;

      validator = await childValidatorSet.getValidator(accounts[2].address);
      expect(validator.stake).to.equal(0);

      expect(await childValidatorSet.pendingWithdrawals(accounts[2].address)).to.equal(0);
      expect(await childValidatorSet.withdrawable(accounts[2].address)).to.equal(minStake * 2);
    });
  });

  describe("Withdraw", async () => {
    it("withdrawal failed", async () => {
      childValidatorSetBalance = await ethers.provider.getBalance(childValidatorSet.address);
      await setBalance(childValidatorSet.address, 0);

      await expect(childValidatorSet.connect(accounts[2]).withdraw(accounts[0].address)).to.be.revertedWith(
        "WITHDRAWAL_FAILED"
      );
    });

    it("withdraw", async () => {
      await setBalance(childValidatorSet.address, childValidatorSetBalance);
      const tx = await childValidatorSet.connect(accounts[2]).withdraw(accounts[2].address);
      expect(await childValidatorSet.pendingWithdrawals(accounts[2].address)).to.equal(0);
      expect(await childValidatorSet.withdrawable(accounts[2].address)).to.equal(0);

      await expect(tx)
        .to.emit(childValidatorSet, "Withdrawal")
        .withArgs(accounts[2].address, accounts[2].address, minStake * 2);
    });
  });

  describe("delegate", async () => {
    it("should only be able to delegate to validators", async () => {
      const restake = false;

      await expect(
        childValidatorSet.delegate(accounts[1].address, restake, { value: minDelegation })
      ).to.be.revertedWith(customError("Unauthorized", "INVALID_VALIDATOR"));
    });

    it("Delegate less amount than minDelegation", async () => {
      const restake = false;

      await expect(childValidatorSet.delegate(accounts[0].address, restake, { value: 100 })).to.be.revertedWith(
        "DELEGATION_TOO_LOW"
      );
    });

    it("Delegate for the first time", async () => {
      const delegateAmount = minDelegation + 1;
      const restake = false;

      //Register accounts[2] as validator
      await childValidatorSet.addToWhitelist([accounts[2].address]);
      const message = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("polygon-v3-validator"));
      const { pubkey, secret } = mcl.newKeyPair();
      const { signature, messagePoint } = mcl.sign(message, secret, DOMAIN);
      const parsedPubkey = mcl.g2ToHex(pubkey);
      await childValidatorSet.connect(accounts[2]).register(mcl.g1ToHex(signature), parsedPubkey);
      await childValidatorSet.connect(accounts[2]).stake({ value: minStake });
      const tx = await childValidatorSet.connect(accounts[3]).delegate(accounts[2].address, restake, {
        value: delegateAmount,
      });

      await expect(tx)
        .to.emit(childValidatorSet, "Delegated")
        .withArgs(accounts[3].address, accounts[2].address, delegateAmount);

      const delegation = await childValidatorSet.delegationOf(accounts[2].address, accounts[3].address);
      expect(delegation).to.equal(delegateAmount);
    });

    it("Delegate again without restake", async () => {
      const delegateAmount = minDelegation + 1;
      const restake = false;

      const tx = await childValidatorSet.connect(accounts[3]).delegate(accounts[2].address, restake, {
        value: delegateAmount,
      });

      await expect(tx)
        .to.emit(childValidatorSet, "Delegated")
        .withArgs(accounts[3].address, accounts[2].address, delegateAmount);
    });

    it("Delegate again with restake", async () => {
      const delegateAmount = minDelegation + 1;
      const restake = true;

      const tx = await childValidatorSet.connect(accounts[3]).delegate(accounts[2].address, restake, {
        value: delegateAmount,
      });

      await expect(tx)
        .to.emit(childValidatorSet, "Delegated")
        .withArgs(accounts[3].address, accounts[2].address, delegateAmount);
    });
  });

  describe("Claim", async () => {
    it("Claim validator reward", async () => {
      const reward = await childValidatorSet.getValidatorReward(accounts[0].address);
      const tx = await childValidatorSet.claimValidatorReward();

      const receipt = await tx.wait();
      const event = receipt.events?.find((log) => log.event === "ValidatorRewardClaimed");
      expect(event?.args?.validator).to.equal(accounts[0].address);
      expect(event?.args?.amount).to.equal(reward);

      await expect(tx).to.emit(childValidatorSet, "WithdrawalRegistered").withArgs(accounts[0].address, reward);
    });

    it("Claim delegatorReward with restake", async () => {
      await expect(
        systemChildValidatorSet.commitEpoch(
          5,
          { startBlock: 257, endBlock: 320, epochRoot: ethers.constants.HashZero },
          {
            epochId: 5,
            uptimeData: [{ validator: accounts[2].address, signedBlocks: 1 }],
            totalBlocks: 2,
          }
        )
      ).to.not.be.reverted;

      await expect(
        systemChildValidatorSet.commitEpoch(
          6,
          { startBlock: 321, endBlock: 384, epochRoot: ethers.constants.HashZero },
          {
            epochId: 6,
            uptimeData: [{ validator: accounts[2].address, signedBlocks: 1 }],
            totalBlocks: 2,
          }
        )
      ).to.not.be.reverted;

      const reward = await childValidatorSet.getDelegatorReward(accounts[2].address, accounts[3].address);

      //Claim with restake
      const tx = await childValidatorSet.connect(accounts[3]).claimDelegatorReward(accounts[2].address, true);

      const receipt = await tx.wait();
      const event = receipt.events?.find((log) => log.event === "DelegatorRewardClaimed");
      expect(event?.args?.delegator).to.equal(accounts[3].address);
      expect(event?.args?.validator).to.equal(accounts[2].address);
      expect(event?.args?.restake).to.equal(true);
      expect(event?.args?.amount).to.equal(reward);

      await expect(tx)
        .to.emit(childValidatorSet, "Delegated")
        .withArgs(accounts[3].address, accounts[2].address, reward);
    });

    it("Claim delegatorReward without restake", async () => {
      await expect(
        systemChildValidatorSet.commitEpoch(
          7,
          { startBlock: 385, endBlock: 448, epochRoot: ethers.constants.HashZero },
          {
            epochId: 7,
            uptimeData: [{ validator: accounts[2].address, signedBlocks: 1 }],
            totalBlocks: 2,
          }
        )
      ).to.not.be.reverted;

      await expect(
        systemChildValidatorSet.commitEpoch(
          8,
          { startBlock: 449, endBlock: 512, epochRoot: ethers.constants.HashZero },
          {
            epochId: 8,
            uptimeData: [{ validator: accounts[2].address, signedBlocks: 1 }],
            totalBlocks: 2,
          }
        )
      ).to.not.be.reverted;

      const reward = await childValidatorSet.getDelegatorReward(accounts[2].address, accounts[3].address);
      //Claim without restake
      const tx = await childValidatorSet.connect(accounts[3]).claimDelegatorReward(accounts[2].address, false);

      const receipt = await tx.wait();
      const event = receipt.events?.find((log) => log.event === "DelegatorRewardClaimed");
      expect(event?.args?.delegator).to.equal(accounts[3].address);
      expect(event?.args?.validator).to.equal(accounts[2].address);
      expect(event?.args?.restake).to.equal(false);
      expect(event?.args?.amount).to.equal(reward);

      await expect(tx).to.emit(childValidatorSet, "WithdrawalRegistered").withArgs(accounts[3].address, reward);
    });
  });

  describe("undelegate", async () => {
    it("undelegate insufficient amount", async () => {
      const delegatedAmount = await childValidatorSet.delegationOf(accounts[2].address, accounts[3].address);
      await expect(
        childValidatorSet.connect(accounts[3]).undelegate(accounts[2].address, delegatedAmount.add(1))
      ).to.be.revertedWith(customError("StakeRequirement", "undelegate", "INSUFFICIENT_BALANCE"));
    });

    it("undelegate low amount", async () => {
      const delegatedAmount = await childValidatorSet.delegationOf(accounts[2].address, accounts[3].address);
      await expect(
        childValidatorSet.connect(accounts[3]).undelegate(accounts[2].address, delegatedAmount.sub(1))
      ).to.be.revertedWith(customError("StakeRequirement", "undelegate", "DELEGATION_TOO_LOW"));
    });

    it("should not be able to exploit int overflow", async () => {
      await expect(
        childValidatorSet.connect(accounts[3]).undelegate(accounts[2].address, ethers.constants.MaxInt256.add(1))
      ).to.be.reverted;
    });

    it("undelegate", async () => {
      await childValidatorSet.connect(accounts[3]).undelegate(accounts[2].address, minDelegation * 3 + 3);
    });
  });

  describe("Set Commision", async () => {
    it("only validator should set", async () => {
      await expect(childValidatorSet.connect(accounts[1]).setCommission(MAX_COMMISSION - 1)).to.be.revertedWith(
        'Unauthorized("VALIDATOR")'
      );
    });

    it("only less than max commision is valid", async () => {
      await expect(childValidatorSet.connect(accounts[2]).setCommission(MAX_COMMISSION + 1)).to.be.revertedWith(
        "INVALID_COMMISSION"
      );
    });

    it("set commission", async () => {
      await childValidatorSet.connect(accounts[2]).setCommission(MAX_COMMISSION - 1);

      const validator = await childValidatorSet.getValidator(accounts[2].address);
      expect(validator.commission).to.equal(MAX_COMMISSION - 1);
    });
  });

  it("Get total stake", async () => {
    const totalStake = await childValidatorSet.totalStake();
    expect(totalStake).to.equal(minStake * 2);
  });
});
