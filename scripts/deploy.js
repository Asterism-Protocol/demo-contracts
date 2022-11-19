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

  const token = await Token.deploy(initializer.address, initializer.address, 1000000*10^18);
  await token.deployed();

  console.log("Token address: :", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
