import { DeployFunction } from 'hardhat-deploy/types'
import { network, getChainId } from 'hardhat'
import { networkConfig } from '../helper-hardhat-config'

const Hack: DeployFunction = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId =  await getChainId()

    log('------------')
    const hack = await deploy('Hack', {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: networkConfig[chainId].blockConfirmations,
    })
}

export default Hack
Hack.tags = ['all', 'hack']