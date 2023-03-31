import { ethers } from "hardhat";

async function main() {
  // We get the contract to deploy
  const ERC948 = await ethers.getContractFactory("ERC948");
  const erc948 = await ERC948.deploy();

  await erc948.deployed();

  console.log("Greeter deployed to:", erc948.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
