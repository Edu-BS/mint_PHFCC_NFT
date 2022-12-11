import "@typechain/hardhat"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-ethers"
import "hardhat-gas-reporter"
import "dotenv/config"
import "solidity-coverage"
import "hardhat-deploy"
import "solidity-coverage"
import { HardhatUserConfig } from "hardhat/config"

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || " "
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ARBITRUM_ONE_RPC_URL = process.env.ARBITRUM_ONE_RPC_URL || ""

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            allowUnlimitedContractSize: true,
            blockGasLimit: 22450000,
        },
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [GOERLI_PRIVATE_KEY],
            chainId: 5,
        },
        arbitrumOne: {
            url: ARBITRUM_ONE_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 42161,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.9",
            },
            {
                version: "0.8.7",
            },
            {
                version: "0.6.6",
            },
        ],
    },
    etherscan: {
        apiKey: {
            goerli: ETHERSCAN_API_KEY,
        },
        customChains: [
            {
                chainId: 5,
                network: "goerli",
                urls: {
                    apiURL: "https://api-goerli.etherscan.io/api",
                    browserURL: "https://goerli.etherscan.io",
                },
            },
        ],
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0,
            1: 0,
        },
        user1: {
            default: 1,
        },
    },
    mocha: {
        timeout: 200000,
    },
}

export default config
