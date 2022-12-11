import { DeployFunction } from "hardhat-deploy/types"
import { network, getChainId } from "hardhat"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import verify from "../utils/verify"

const deployHack: DeployFunction = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()

    log("------------")
    const hack = await deploy("Hack", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: networkConfig[chainId].blockConfirmations,
    })
    log(hack.address)

    if (!developmentChains.includes(network.name)) {
        log("Verifying...")
        await verify(hack.address, [])
    }
}

export default deployHack
deployHack.tags = ["all", "hack"]
