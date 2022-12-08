const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Giant test", function () {
  async function deployContractsFixture() {
    const Initializer = await ethers.getContractFactory("Initializer");
    const Transalor = await ethers.getContractFactory("Translator");
    const Demo = await ethers.getContractFactory("AsterismDemo");
    const [owner] = await ethers.getSigners();

    const translator = await Transalor.deploy();
    await translator.deployed();

    const initializer = await Initializer.deploy(translator.address, translator.address);
    await initializer.deployed();

    const demo = await Demo.deploy(initializer.address, initializer.address);
    await demo.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { Initializer, initializer, Transalor, translator, Demo, demo, owner};
  }

  it("Should successfuly deploy contracts", async function () {
    const { Initializer, initializer, Transalor, translator, Demo, demo, owner } = await loadFixture(deployContractsFixture);
    console.log("Initializer address: ", initializer.address);
    console.log("Translator address: ", translator.address);
    console.log("Demo address: ", demo.address);
  });

  it("Should succeffuly set endpoint for translator", async function () {
    const { Initializer, initializer, Transalor, translator, Demo, demo, owner } = await loadFixture(deployContractsFixture);
    await translator.setEndpoint(initializer.address, initializer.address);
    expect(await translator.endpoint()).to.equal(
      initializer.address
    );
  })

  it("Should fail without correct endpoint", async function () {
    const { Initializer, initializer, Transalor, translator, Demo, demo, owner } = await loadFixture(deployContractsFixture);
    await expect(demo.sendMessage(0, demo.address, "Layer Ziro sosat'")).to.be.revertedWith(
      "only endpoint"
    );
  });

  it("Should succeffuly send message", async function () {
    const { Initializer, initializer, Transalor, translator, Demo, demo, owner } = await loadFixture(deployContractsFixture);
    await translator.setEndpoint(initializer.address, initializer.address);
    await expect(demo.sendMessage(0, demo.address, "Layer Ziro sosat'")).not.to.be.reverted;

  })

  it("Should emit any event from Translator", async function () {
    let capturedValue
    const captureValue = (value) => {
      capturedValue = value
      return true
    }
    const { Initializer, initializer, Transalor, translator, Demo, demo, owner } = await loadFixture(deployContractsFixture);
    await translator.setEndpoint(initializer.address, initializer.address);
    await expect(demo.sendMessage(0, demo.address, "Layer Ziro sosat'"))
      .to.emit(translator, 'Packet')
  });

  it("Should send message from packet to Initializer", async function () {
    let capturedValue
    const captureValue = (value) => {
      capturedValue = value
      return true
    }
    const { Initializer, initializer, Transalor, translator, Demo, demo, owner } = await loadFixture(deployContractsFixture);
    await translator.setEndpoint(initializer.address, initializer.address);
    await expect(demo.sendMessage(0, demo.address, "Layer Ziro sosat'"))
      .to.emit(translator, 'Packet')
      .withArgs(captureValue)
    await translator.translateMessage(1, demo.address, 300000, capturedValue);
  });

  it("Should send message from packet to Initializer", async function () {
    let capturedValue
    const captureValue = (value) => {
      capturedValue = value
      return true
    }
    const { Initializer, initializer, Transalor, translator, Demo, demo, owner } = await loadFixture(deployContractsFixture);
    await translator.setEndpoint(initializer.address, initializer.address);
    await expect(demo.sendMessage(0, demo.address, "Layer Ziro sosat'"))
      .to.emit(translator, 'Packet')
      .withArgs(captureValue)
    const messageBefore = await demo.externalChain();
    console.log("Message before operation: ", messageBefore);
    await translator.translateMessage(1, demo.address, 300000, capturedValue);
    const message = await demo.externalChain();
    console.log("Now message is: ", message);

  });

});