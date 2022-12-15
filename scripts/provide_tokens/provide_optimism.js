const hre = require("hardhat");

const TOKEN_ADDRESS = "0xCae40C1Ad0A401cc3Fc20cE3e28ac768FA422161"
const CLAIMER_ADDRESS = "0x2dd7D0a530BC2cBD5d404aA77dda81F8f38c9A6A"


async function main() {

  const Token = await ethers.getContractFactory("MultichainToken");
  const token = await Token.attach(TOKEN_ADDRESS);
  console.log("Token address: :", token.address);

  const Claimer = await ethers.getContractFactory("MultiChainDemo");
  const claimer = await Claimer.attach(CLAIMER_ADDRESS);
  console.log("Claimer address: :", claimer.address);

  await token.transfer(claimer.address, ethers.utils.parseEther("100000"));
  console.log("Claimer balance: ", await token.balanceOf(claimer.address));

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
