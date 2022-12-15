const hre = require("hardhat");

const TOKEN_ADDRESS = "0x1679467004A2C0CD2FCF07580fE483E20bc9E7ac"
const CLAIMER_ADDRESS = "0x5B732fE1565775a1404186f9F57A8b8F5fabDd64"


async function main() {

  const [owner] = await ethers.getSigners();

  const Token = await ethers.getContractFactory("MultichainToken");
  const token = await Token.attach(TOKEN_ADDRESS);
  console.log("Token address: :", token.address);

  const Claimer = await ethers.getContractFactory("MultiChainDemo");
  const claimer = await Claimer.attach(CLAIMER_ADDRESS);
  console.log("Claimer address: :", claimer.address);

  await token.transfer(claimer.address, ethers.utils.parseEther("100000"));
  console.log("Claimer balance: ", await token.balanceOf(claimer.address));
  console.log("Claimer balance: ", await token.balanceOf(owner.address));

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
