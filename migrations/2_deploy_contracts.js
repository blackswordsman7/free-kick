var bookie = artifacts.require('./bookie.sol');

module.exports = function(deployer) {
    deployer.deploy(bookie);
};
