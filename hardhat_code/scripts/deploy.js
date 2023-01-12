const {ethers} = require("hardhat");

async function main(){

  //contract deployment
  const verifyIdentity = await ethers.getContractFactory("LinkIdentity");

  const deployedVerifyIdentityContract = await verifyIdentity.deploy();

  //for reference
  //VerifyJWT contract address is 0xe8B9b939C4ca9BeD28EbEbce0f989a082c9be1a9

  await deployedVerifyIdentityContract.deployed();

  console.log("Address for verified contract", deployedVerifyIdentityContract.address);

}

main()
.then(() => process.exit(0))
.catch(error => {
  console.log(error);
  process.exit(1);
})