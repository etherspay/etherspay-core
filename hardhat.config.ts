import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    // sepolia: {
    //   url: "https://sepolia.infura.io/v3/4299b69d50b54f9fafc81f91c46869de",
    //   accounts: [process.env.PRIVATE_KEY as string],
    // },
  },
};

export default config;
