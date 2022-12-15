const hre = require("hardhat");

const TRANSLATOR_ADDRESS = "0xbaC74a21952Cc4BB94fa80a33A09189FAc405b57"
const INITIALIZER_ADDRESS = "0x0533818a12Bb6b28a919720bF6385F114feE90B2"

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
