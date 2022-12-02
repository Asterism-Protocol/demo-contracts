const hre = require("hardhat");

async function main() {

  const Initializer = await ethers.getContractFactory("Initializer");
  const Transalor = await ethers.getContractFactory("Translator");

  const translator = await Transalor.deploy();
  await translator.deployed();

  const initializer = await Initializer.deploy(translator.address, translator.address);
  await initializer.deployed();

  console.log("Translator address:", translator.address);
  console.log("Initializer address:", initializer.address);

  const Token = await ethers.getContractFactory("MultichainToken");

  const token = await Token.deploy(initializer.address, initializer.address, ethers.utils.parseEther("1000000"));
  await token.deployed();
  console.log("Token address: :", token.address);

  const Claimer = await ethers.getContractFactory("MultiChainDemo");
  const claimer = await Claimer.deploy(token.address, token.address);
  await claimer.deployed();
  console.log("Claimer address: :", claimer.address);

  const Gas = await ethers.getContractFactory("GasSender");
  const gas_sender = await Gas.deploy(initializer.address, initializer.address);
  await gas_sender.deployed();
  console.log("Gas sender address: :", gas_sender.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
