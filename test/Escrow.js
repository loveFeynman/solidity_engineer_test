const {
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("This is our test for escrow contract", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployTokenFixture()  {
    const [admin, alice, bob] = await ethers.getSigners();
    const SUSDC = await hre.ethers.getContractFactory("SUSDC");
    const susdc =  await SUSDC.deploy();

    const Escrow = await hre.ethers.getContractFactory("Escrow");
    const escrow =  await Escrow.deploy(susdc.address);

    await susdc.mint(alice.address, 10);
    await susdc.mint(bob.address, 10);

    console.log("address: ", escrow.address, susdc.address);
    return {susdc, escrow, admin, alice, bob };
  }

  it ("This is the first test", async function () {
    const { susdc, escrow, admin, alice, bob } = await loadFixture(
      deployTokenFixture
    );

    const depositAmount = 10;
    await escrow.startBet(depositAmount);
    await susdc.connect(alice).approve(escrow.address, depositAmount);
    await escrow.connect(alice).deposit(1, depositAmount);

    await susdc.connect(bob).approve(escrow.address, depositAmount);
    await escrow.connect(bob).deposit(2, depositAmount);

    await escrow.connect(admin).settle();
    expect(await susdc.balanceOf(alice.address)).to.equal(0);
    expect(await susdc.balanceOf(bob.address)).to.equal(20);
  })
});
