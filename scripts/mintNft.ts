import { loadFixture } from "ethereum-waffle"
import { HardhatRuntimeEnvironment, NetworkConfig } from "hardhat/types"
import { deployments, ethers, getChainId, network } from "hardhat"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import { CourseCompletedNft, Hack } from "../typechain-types"
import fs from "fs"
import { getContractAddressFromDeployments } from "../utils/deploymentsUtils"

const GOERLI_HACK_ADDRESS = process.env.GOERLI_HACK_ADDRESS
const GOERLI_COURSE_COMPLETED_NFT_ADDRESS = process.env.GOERLI_COURSE_COMPLETED_NFT_ADDRESS

const ARBITRUM_HACK_ADDRESS = process.env.ARBITRUM_HACK_ADDRESS
const ARBITRUM_COURSE_COMPLETED_NFT_ADDRESS = process.env.ARBITRUM_COURSE_COMPLETED_NFT_ADDRESS

export async function main() {
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]
    console.log(network.name)

    if (developmentChains.includes(network.name)) {
        await deployments.fixture(["all"])

        const hackAddress = getContractAddressFromDeployments("Hack")
        const courseCompletedNftAddress = getContractAddressFromDeployments("CourseCompletedNft")
        if (hackAddress && courseCompletedNftAddress) {
            const hack: Hack = await ethers.getContractAt("Hack", hackAddress, deployer)
            const courseCompletedNft: CourseCompletedNft = await ethers.getContractAt(
                "CourseCompletedNft",
                courseCompletedNftAddress,
                deployer
            )
            const tokenId = await mintNft(hack, courseCompletedNft)
            console.log(`NFT minted, TokenID: ${tokenId}`)

            console.log(`Owner of token ${tokenId}: ${await courseCompletedNft.ownerOf(tokenId)}`)

            await withdrawNft(hack, courseCompletedNft, tokenId)

            console.log(`Owner of token ${tokenId}: ${await courseCompletedNft.ownerOf(tokenId)}`)
        }
    } else if (network.config.chainId == 5) {
        if (!GOERLI_HACK_ADDRESS && !GOERLI_COURSE_COMPLETED_NFT_ADDRESS) {
            throw new Error(
                `The contract addresses are not defined in the ${network.name} network`
            )
        }
        const hack: Hack = await ethers.getContractAt("Hack", GOERLI_HACK_ADDRESS!, deployer)
        const courseCompletedNft: CourseCompletedNft = await ethers.getContractAt(
            "CourseCompletedNft",
            GOERLI_COURSE_COMPLETED_NFT_ADDRESS!,
            deployer
        )
        const tokenId = await mintNft(hack, courseCompletedNft)
        console.log(`NFT minted, TokenID: ${tokenId}`)

        console.log(`Owner of token ${tokenId}: ${await courseCompletedNft.ownerOf(tokenId)}`)

        await withdrawNft(hack, courseCompletedNft, tokenId)

        console.log(`Owner of token ${tokenId}: ${await courseCompletedNft.ownerOf(tokenId)}`)
    } else if (network.config.chainId == 42161) {
        if (!ARBITRUM_HACK_ADDRESS && !ARBITRUM_COURSE_COMPLETED_NFT_ADDRESS) {
            throw new Error(
                `The contract addresses are not defined in the ${network.name} network`
            )
        }
        // TO-DO
    }
}

export async function mintNft(
    hack: Hack,
    courseCompletedNft: CourseCompletedNft
): Promise<string> {
    const chainId = await getChainId()
    const tx = await hack.callCourseCompletedNft(courseCompletedNft.address)
    await tx.wait(networkConfig[chainId].blockConfirmations)

    const tokenId = await hack.s_tokenId()
    return tokenId.toString()
}

export async function withdrawNft(
    hack: Hack,
    courseCompletedNft: CourseCompletedNft,
    tokenId: string
) {
    const chainId = await getChainId()
    const tx = await hack.withdrawNft(courseCompletedNft.address, tokenId)
    await tx.wait(networkConfig[chainId].blockConfirmations)
}

async function getNftInLocalNet(deployer: string) {
    const hack: Hack = await ethers.getContract("Hack", deployer)
    const courseCompletedNft: CourseCompletedNft = await ethers.getContract("CourseCompletedNft")
    console.log(`Contract owner: ${await hack.owner()}`)
    console.log(`Contract courseCompletedNft address: ${courseCompletedNft.address}`)

    const tokenCounter = await courseCompletedNft.getTokenCounter()
    console.log(`Token counter: ${tokenCounter}`)

    console.log(`Mining the NFT...`)
    await hack.callCourseCompletedNft(courseCompletedNft.address)
    console.log(`NFT minted`)

    const tokenId = await hack.s_tokenId()

    console.log(await courseCompletedNft.getTokenCounter())

    console.log(`Owner of token ${tokenId}: ${await courseCompletedNft.ownerOf(tokenId)}`)

    console.log(`Withdrawing the NFT...`)
    await hack.withdrawNft(courseCompletedNft.address, tokenId)
    console.log(`Owner of token ${tokenId}: ${await courseCompletedNft.ownerOf(tokenId)}`)
}

if (typeof require !== "undefined" && require.main == module) {
    main()
        .then(() => process.exit(0))
        .catch((err: any) => {
            console.error(err)
            process.exit(1)
        })
}
