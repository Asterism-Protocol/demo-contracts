const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

const TOKEN_AMOUNT = 1000000*(10^18);

describe("Token contract", function () {
  async function deployContractsFixture() {
    const Initializer = await ethers.getContractFactory("Initializer");
    const Transalor = await ethers.getContractFactory("Translator");
    const Token = await ethers.getContractFactory("MultichainToken");
    const Claimer = await ethers.getContractFactory("MultiChainDemo");
    const [owner] = await ethers.getSigners();

    const translator = await Transalor.deploy();
    await translator.deployed();

    const initializer = await Initializer.deploy(translator.address, translator.address);
    await initializer.deployed();

    const token = await Token.deploy(initializer.address, initializer.address, TOKEN_AMOUNT);
    await token.deployed();

    const claimer = await Claimer.deploy(token.address, token.address);
    await claimer.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { Initializer, initializer, Transalor, translator, Token, token, Claimer, claimer, owner};
  }

  it("Should claim token", async function () {
    let capturedValue
    const captureValue = (value) => {
      capturedValue = value
      return true
    }
    const { Initializer, initializer, Transalor, translator, Token, token, Claimer, claimer, owner } = await loadFixture(deployContractsFixture);
    await translator.setEndpoint(initializer.address, initializer.address);
    await expect(token.crossChainTransfer(10, owner.address, "0x89F5C7d4580065fd9135Eff13493AaA5ad10A168", 100, token.address))
      .to.emit(translator, 'Packet')
      .withArgs(captureValue)
    expect(await token.balanceOf(owner.address)).to.equal(
      (TOKEN_AMOUNT - 100)
    );
    await translator.translateMessage(1, token.address, 300000, capturedValue);
    expect(await token.balanceOf(owner.address)).to.equal(
      (TOKEN_AMOUNT - 100)
    );
    expect(await token.balanceOf("0x89F5C7d4580065fd9135Eff13493AaA5ad10A168")).to.equal(
      100
    );
    expect(await token.totalSupply()).to.equal(TOKEN_AMOUNT);
    await token.transfer(claimer.address, await token.balanceOf(owner.address));
    const chainIds = [0,1,2];
    const amounts = [10,20,30];
    const addresses = [token.address, token.address, token.address];
    await expect(claimer.claim(chainIds, amounts, addresses, 3))
      .to.emit(translator, 'Packet')
      .withArgs(captureValue);
  });

  it("Should claim and send token", async function () {
    let capturedValue
    const captureValue = (value) => {
      capturedValue = value
      return true
    }
    const { Initializer, initializer, Transalor, translator, Token, token, Claimer, claimer, owner } = await loadFixture(deployContractsFixture);
    await translator.setEndpoint(initializer.address, initializer.address);
    await expect(token.crossChainTransfer(10, owner.address, "0x89F5C7d4580065fd9135Eff13493AaA5ad10A168", 100, token.address))
      .to.emit(translator, 'Packet')
      .withArgs(captureValue)
    expect(await token.balanceOf(owner.address)).to.equal(
      (TOKEN_AMOUNT - 100)
    );
    await translator.translateMessage(1, token.address, 300000, capturedValue);
    expect(await token.balanceOf(owner.address)).to.equal(
      (TOKEN_AMOUNT - 100)
    );
    expect(await token.balanceOf("0x89F5C7d4580065fd9135Eff13493AaA5ad10A168")).to.equal(
      100
    );
    expect(await token.totalSupply()).to.equal(TOKEN_AMOUNT);
    await token.transfer(claimer.address, await token.balanceOf(owner.address));


    const chainIds = [10];
    const amounts = [10];
    const addresses = [token.address];
    await expect(await claimer.claim(chainIds, amounts, addresses, 1))
      .to.emit(translator, 'Packet')
      .withArgs(captureValue)
    console.log("capturedValue");
    console.log(capturedValue);
    await translator.translateMessage(1, token.address, 300000, capturedValue);
    expect(await token.totalSupply()).to.equal(TOKEN_AMOUNT);
    expect(await token.balanceOf(owner.address)).to.equal(
      (10)
    );
  });

});