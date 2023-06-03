import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    // goerli: {
    //   url: "https://goerli.infura.io/v3/4299b69d50b54f9fafc81f91c46869de",
    //   accounts: {
    //     mnemonic: process.env.MNEMONIC,
    //   },
    // },
  },
};

export default config;
