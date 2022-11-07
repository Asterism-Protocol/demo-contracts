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
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
