const hre = require("hardhat");

async function main() {

  const [owner] = await ethers.getSigners();

  const Initializer = await ethers.getContractFactory("Initializer");
  const Transalor = await ethers.getContractFactory("Translator");

  console.log("Deploying translator...");
  const translator = await Transalor.deploy();
  await translator.deployed();
  console.log("Translator was deployed with address: ", translator.address);

  console.log("Deploying initialzier...");
  const initializer = await Initializer.deploy(translator.address, translator.address);
  await initializer.deployed();
  console.log("Initializer was deployed with address: ", initializer.address);

  console.log("Setting endpoint for translator contract...");
  await translator.setEndpoint(initializer.address, initializer.address);
  console.log("Initializer has been set: ", initializer.address);

  console.log("Deployig multichain token...");
  const Token = await ethers.getContractFactory("MultichainToken");
  const token = await Token.deploy(initializer.address, initializer.address, ethers.utils.parseEther("1000000"));
  await token.deployed();
  console.log("Token was deployed with address: :", token.address);

  console.log("Deployig claimer contract...");
  const Claimer = await ethers.getContractFactory("MultiChainDemo");
  const claimer = await Claimer.deploy(token.address, token.address);
  await claimer.deployed();
  console.log("Claimer was deployed with address: :", claimer.address);

  console.log("Providing claimer contract with funds...");
  await token.transfer(claimer.address, ethers.utils.parseEther("100000"));
  console.log("Funds has been sent to", claimer.address);
  console.log("Claimer balance: ", await token.balanceOf(claimer.address));
  console.log("Deployer balance: ", await token.balanceOf(owner.address));

  console.log("Deployment was done. Wrap up...");

  console.log("Owner address: ", owner.address);
  console.log("Translator address:", translator.address);
  console.log("Initializer address:", initializer.address);
  console.log("Token address: :", token.address);
  console.log("Claimer address: :", claimer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
