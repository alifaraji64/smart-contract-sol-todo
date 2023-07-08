import { useEffect, useState } from 'react'
import Web3 from 'web3'
import contractArtifact from '../src/contracts/TodoList.json'
function App () {
  const [contractInstance, setContractInstance] = useState(null)
  const [todos, setTodos] = useState([])
  const [todo, setTodo] = useState('')
  const [account, setAccount] = useState('')

  const handleInputChange = event => {
    setTodo(event.target.value)
  }
  const submitTodo = async (e) => {
    e.preventDefault()
    console.log(contractInstance.events)
    try {
      let result = await contractInstance.methods
        .createTask(todo)
        .send({ from: account })
      console.log(result.logs[0].args)
    } catch (error) {
      console.log(error)
    }
    setTodo('')
  }
  const checkboxChanged = () => {
    console.log('wohoooo')
  }

  useEffect(() => {
    async function getTodos() {
      if (!contractInstance) return;
      try {
        const taskCount = await contractInstance.methods.taskCount().call();
        const newTodos = [];
        for (let i = 1; i <= parseInt(taskCount); i++) {
          const result = await contractInstance.methods.tasks(i).call();
          newTodos.push({
            id: parseInt(result.id),
            task: result.task,
            completed: result.completed
          });
        }
        console.log(newTodos);
        setTodos(newTodos);
      } catch (error) {
        console.error(error);
      }
    }
    getTodos();
  }, [contractInstance]);

  useEffect(() => {
    // if (typeof window.ethereum !== 'undefined') {
    //   //await window.ethereum.enable()
    //   window.web3 = new Web3(window.ethereum)
    // window.web3.eth.getAccounts().then(accounts => {
    //   setAccount(accounts[0])
    // })
    //   // Smart contract ABI (replace with your contract's ABI)
    //   const contractABI = contractArtifact.abi
    //   // Contract address (replace 'contract-address' with the actual contract address)
    //   const contractAddress = contractArtifact.networks['5777'].address

    //   // Create an instance of the contract
    //   setContractInstance(
    //     new window.web3.eth.Contract(contractABI, contractAddress)
    //   )
    // } else {
    //   console.error('MetaMask is not available')
    // }
    const init = async () => {
      console.log('init');
      try {
        await window.ethereum.enable()
        window.web3 = new Web3(window.ethereum)
        window.web3.eth.getAccounts().then(accounts => {
          setAccount(accounts[0])
        })
        const contractABI = contractArtifact.abi
        const contractAddress = contractArtifact.networks['5777'].address
        setContractInstance(
          new window.web3.eth.Contract(contractABI, contractAddress)
        )
      } catch (e) {
        console.log(e)
      }
    }
    init()
  }, [])

  // useEffect(() => {
  //   if (!contractInstance) return
  //   console.log('bam')
  //   let eventListener = contractInstance.events.TaskCreated(
  //     {},
  //     (error, data) => {
  //       if (error) console.log('Error: ' + error)
  //       else console.log('Log data: ' + data)
  //     }
  //   )

  //   // Cleanup function to remove the event listener when the component unmounts
  //   return () => {
  //     eventListener.unsubscribe()
  //   }
  // }, [contractInstance])

  return (
    <div className='App'>
      <header className='App-header'>
        <form>
          <input type='text' value={todo} onChange={handleInputChange} />
          <button onClick={submitTodo}>Submit</button>
        </form>
        {todos.map(todo => (
          <div key={todo.id + Math.random()} id='todo'>
            <input type='checkbox' onChange={checkboxChanged} />
            <p>{todo.task}</p>
          </div>
        ))}
      </header>
    </div>
  )
}

export default App
