const hre = require("hardhat");

const TRANSLATOR_ADDRESS = "0x6A49F7aE2f49858EBAeDA1da88D302CC652d07dD"
const INITIALIZER_ADDRESS = "0x1679467004A2C0CD2FCF07580fE483E20bc9E7ac"

async function main() {

  const Initializer = await ethers.getContractFactory("Initializer");
  const Transalor = await ethers.getContractFactory("Translator");

  const translator = await Transalor.attach(TRANSLATOR_ADDRESS);
  const initializer = await Initializer.attach(INITIALIZER_ADDRESS);

  console.log("Translator address:", translator.address);
  console.log("Initializer address:", initializer.address);

  await translator.setEndpoint(initializer.address, initializer.address);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
