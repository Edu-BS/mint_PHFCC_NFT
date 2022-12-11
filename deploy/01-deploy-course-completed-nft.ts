import { DeployFunction } from "hardhat-deploy/types"
import { network, getChainId, ethers } from "hardhat"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import { VulnerableContract } from "../typechain-types"
import verify from "../utils/verify"

const deployCourseCompletedNft: DeployFunction = async function ({
    getNamedAccounts,
    deployments,
}) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()

    log("------------")

    const vulnerableContractDeploy = await deploy("VulnerableContract", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: networkConfig[chainId].blockConfirmations,
    })

    const courseCompletedNftDeploy = await deploy("CourseCompletedNft", {
        from: deployer,
        log: true,
        args: [vulnerableContractDeploy.address],
        waitConfirmations: networkConfig[chainId].blockConfirmations,
    })

    if (!developmentChains.includes(network.name)) {
        log("Verifying...")
        await verify(courseCompletedNftDeploy.address, [vulnerableContractDeploy.address])
    }
}

export default deployCourseCompletedNft
deployCourseCompletedNft.tags = ["all", "courseCompletedNft"]
