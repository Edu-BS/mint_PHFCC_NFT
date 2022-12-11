import fs from "fs"

export function getContractAddressFromDeployments(contractName: string): string | null {
    let contractAddress = null
    const deployedContractPath = `./deployments/localhost/${contractName}.json`
    if (fs.existsSync(deployedContractPath)) {
        const contractFile = fs.readFileSync(deployedContractPath, "utf8")
        const contractData = JSON.parse(contractFile)
        contractAddress = contractData.address
    } else {
        console.log(`The path ${deployedContractPath} doesn't exist`)
    }
    return contractAddress
}
