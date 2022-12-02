const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

const TOKEN_AMOUNT = 1000000*10^18;

describe("Token contract", function () {
  async function deployContractsFixture() {
    const Initializer = await ethers.getContractFactory("Initializer");
    const Transalor = await ethers.getContractFactory("Translator");
    const Token = await ethers.getContractFactory("MultichainToken");
    const Gas = await ethers.getContractFactory("GasSender");
    const [owner] = await ethers.getSigners();

    const translator = await Transalor.deploy();
    await translator.deployed();

    const initializer = await Initializer.deploy(translator.address, translator.address);
    await initializer.deployed();

    const token = await Token.deploy(initializer.address, initializer.address, TOKEN_AMOUNT);
    await token.deployed();

    const gas_sender = await Gas.deploy(initializer.address, initializer.address);
    await gas_sender.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { Initializer, initializer, Transalor, translator, Token, token, owner};
  }

  it("Should successfuly deploy contracts", async function () {
    const { Initializer, initializer, Transalor, translator, Token, token, owner } = await loadFixture(deployContractsFixture);
    console.log("Initializer address: ", initializer.address);
    console.log("Translator address: ", translator.address);
    console.log("Demo address: ", token.address);
  });
  it("Check address balances", async function () {
    const { Initializer, initializer, Transalor, translator, Token, token, owner } = await loadFixture(deployContractsFixture);
    let balance = await(token.balanceOf(owner.address));
    console.log(balance);
    expect(await token.balanceOf(owner.address)).to.equal(
      TOKEN_AMOUNT
    );
  });
  it("Check address balances", async function () {
    const { Initializer, initializer, Transalor, translator, Token, token, owner } = await loadFixture(deployContractsFixture);
    let balance = await(token.balanceOf(owner.address));
    console.log(balance);
    expect(await token.balanceOf(owner.address)).to.equal(
      TOKEN_AMOUNT
    );
  });
  it("Should emit event from Translator", async function () {
    let capturedValue
    const captureValue = (value) => {
      capturedValue = value
      return true
    }
    const { Initializer, initializer, Transalor, translator, Token, token, owner } = await loadFixture(deployContractsFixture);
    await translator.setEndpoint(initializer.address, initializer.address);
    await expect(token.crossChainTransfer(10, owner.address, "0x89F5C7d4580065fd9135Eff13493AaA5ad10A168", 100, token.address))
      .to.emit(translator, 'Packet')
  });
  it("Should burn token", async function () {
    let capturedValue
    const captureValue = (value) => {
      capturedValue = value
      return true
    }
    const { Initializer, initializer, Transalor, translator, Token, token, owner } = await loadFixture(deployContractsFixture);
    await translator.setEndpoint(initializer.address, initializer.address);
    await expect(token.crossChainTransfer(10, owner.address, "0x89F5C7d4580065fd9135Eff13493AaA5ad10A168", 100, token.address))
      .to.emit(translator, 'Packet');
    expect(await token.balanceOf(owner.address)).to.equal(
      (TOKEN_AMOUNT - 100)
    );
    expect(await token.totalSupply()).to.equal(
      (TOKEN_AMOUNT - 100)
    );
  });
  it("Should burn and then mint token", async function () {
    let capturedValue
    const captureValue = (value) => {
      capturedValue = value
      return true
    }
    const { Initializer, initializer, Transalor, translator, Token, token, owner } = await loadFixture(deployContractsFixture);
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
  });
});