const contracts = artifacts.require("contacts");

module.exports = function (deployer) {
  deployer.deploy(contracts);
};
