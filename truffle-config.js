module.exports = {
  contracts_build_directory: './frontend/src/contracts',
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*' // Match any network id
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  compilers: {
    solc: {
      version: '0.8.4' // Specify the desired Solidity compiler version
    }
  }
}
