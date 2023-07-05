import { useEffect } from 'react'
import Web3 from 'web3'
import contractArtifact from '../src/contracts/TodoList.json'
function App () {
  console.log('MyComponent rendering')

  useEffect(() => {
    // Import Web3.js library

    // Check if MetaMask is available
    if (typeof window.ethereum !== 'undefined') {
      // Use MetaMask's provider
      window.ethereum.enable()
      const web3 = new Web3(window.ethereum)
      web3.eth.getAccounts().then(accounts=>{
        console.log(accounts);
      })

      // Smart contract ABI (replace with your contract's ABI)
      const contractABI = contractArtifact.abi;

      // Contract address (replace 'contract-address' with the actual contract address)
      const contractAddress = contractArtifact.networks['5777'].address;

      // Create an instance of the contract
      const contractInstance = new web3.eth.Contract(
        contractABI,
        contractAddress
      )

      // Example function to interact with the contract
      async function interactWithContract () {
        try {
          // Call a contract function (replace 'function-name' with an actual function in your contract)
          const result = await contractInstance.methods.tasks(1).call()

          console.log('Result:', result)
        } catch (error) {
          console.error(error)
        }
      }

      // Call the interaction function
      interactWithContract()
    } else {
      console.error('MetaMask is not available')
    }
  }, [])
  return (
    <div className='App'>
      <header className='App-header'>
        <p>
          Edit <code>src/App.js</code> and save to reloa.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
