import { DeployFunction } from 'hardhat-deploy/types'
import { network, getChainId } from 'hardhat'
import { networkConfig } from '../helper-hardhat-config'

const deployCourseCompletedNft: DeployFunction = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId =  await getChainId()

    log('------------')
    const courseCompletedNft = await deploy('CourseCompletedNft', {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: networkConfig[chainId].blockConfirmations,
    })
}

export default deployCourseCompletedNft
deployCourseCompletedNft.tags = ['all', 'courseCompletedNft']