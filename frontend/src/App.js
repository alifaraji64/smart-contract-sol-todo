import { useEffect, useState } from 'react'
import Web3 from 'web3'
import contractArtifact from '../src/contracts/TodoList.json'
function App () {
  const [contractInstance, setContractInstance] = useState(null)
  const [todos, setTodos] = useState([])
  const checkboxChanged = ()=>{
    console.log('wohoooo');
  }

  useEffect(() => {
    async function getTodos () {
      if (!contractInstance) return
      try {
        const taskCount = await contractInstance.methods.taskCount().call()
        console.log(parseInt(taskCount))
        for (let i = 1; i <= parseInt(taskCount); i++) {
          const result = await contractInstance.methods.tasks(i).call()
          setTodos(prevTodos => [
            ...prevTodos,
            {
              id: parseInt(result.id),
              task: result.task,
              completed: result.completed
            }
          ])
        }
        //const result = await contractInstance.methods.tasks(1).call()
        //setTodos({id:parseInt(result.id), task:result.task, completed: result.completed})
      } catch (error) {
        console.error(error)
      }
    }
    getTodos()
  }, [contractInstance])

  useEffect(() => {
    // Import Web3.js library

    // Check if MetaMask is available
    if (typeof window.ethereum !== 'undefined') {
      // Use MetaMask's provider

      window.ethereum.enable()

      window.web3 = new Web3(window.ethereum)

      window.web3.eth.getAccounts().then(accounts => {
        console.log(accounts)
      })

      // Smart contract ABI (replace with your contract's ABI)
      const contractABI = contractArtifact.abi

      // Contract address (replace 'contract-address' with the actual contract address)
      const contractAddress = contractArtifact.networks['5777'].address

      // Create an instance of the contract
      setContractInstance(
        new window.web3.eth.Contract(contractABI, contractAddress)
      )

      // Call the interaction function
      //interactWithContract()
    } else {
      console.error('MetaMask is not available')
    }
  }, [])
  return (
    <div className='App'>
      <header className='App-header'>
        {todos.map(todo => (
          <div key={todo.id}>
            <input type='checkbox' onChange={checkboxChanged}/>
            <p>{todo.task}</p>
          </div>
        ))}
      </header>
    </div>
  )
}

export default App
