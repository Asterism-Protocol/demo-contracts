const hre = require("hardhat");

const TRANSLATOR_ADDRESS = "0xbaC74a21952Cc4BB94fa80a33A09189FAc405b57"
const INITIALIZER_ADDRESS = "0x0533818a12Bb6b28a919720bF6385F114feE90B2"
const TOKEN_ADDRESS = "0xCae40C1Ad0A401cc3Fc20cE3e28ac768FA422161"
const CLAIMER_ADDRESS = "0x2dd7D0a530BC2cBD5d404aA77dda81F8f38c9A6A"


async function main() {

  const Initializer = await ethers.getContractFactory("Initializer");
  const Transalor = await ethers.getContractFactory("Translator");

  const translator = await Transalor.attach(TRANSLATOR_ADDRESS);
  const initializer = await Initializer.attach(INITIALIZER_ADDRESS);

  console.log("Translator address:", translator.address);
  console.log("Initializer address:", initializer.address);
  console.log("Endpoint address:", await translator.endpoint());

  const Token = await ethers.getContractFactory("MultichainToken");
  const token = await Token.attach(TOKEN_ADDRESS);
  console.log("Token address: :", token.address);

  const Claimer = await ethers.getContractFactory("MultiChainDemo");
  const claimer = await Claimer.attach(CLAIMER_ADDRESS);
  console.log("Claimer address: :", claimer.address);

  const chainIds = [420, 8001, 4002];
  const amounts = [400, 400, 400]
  const addresses = ['0xCae40C1Ad0A401cc3Fc20cE3e28ac768FA422161', '0x1679467004A2C0CD2FCF07580fE483E20bc9E7ac', '0x5B732fE1565775a1404186f9F57A8b8F5fabDd64'];
  await claimer.claim(chainIds, amounts, addresses, 3);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
