// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.17",
// };

require("@nomicfoundation/hardhat-toolbox");
const INfURA_url='https://goerli.infura.io/v3/edac3c26035f400981d2634401b83dcd';
const privatekey='ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
/**
* @type import('hardhat/config').HardhatUserConfig
*/

module.exports = {

 solidity: "0.8.17",

 networks:{

  goerli:{

   url:INfURA_url,

   accounts:[privatekey],

  }}};
