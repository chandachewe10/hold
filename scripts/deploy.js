const hre = require("hardhat");

async function main() {
    console.log("Deploying SavingsLock...");

    const SavingsLock = await hre.ethers.getContractFactory("SavingsLock");
    const savingsLock = await SavingsLock.deploy();

    await savingsLock.waitForDeployment();

    const address = await savingsLock.getAddress();

    console.log(`SavingsLock deployed to: ${address}`);

    // Save address to file for easy retrieval
    const fs = require('fs');
    fs.writeFileSync('deployed_address.txt', address);

    console.log("Don't forget to update SAVINGS_LOCK_ADDRESS in app/components/SavingsABI.ts");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
