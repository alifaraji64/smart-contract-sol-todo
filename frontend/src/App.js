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
      //console.log(result.events.TaskCreated.returnValues)
      const {id, task, completed} = result.events.TaskCreated.returnValues;
      console.log(id, task, completed);
      setTodos(prevTodos=>[...prevTodos,{id, task, completed}])
    } catch (error) {
      console.log(error)
    }
    setTodo('')
  }

  const toggleCompleted = async (taskId) => {
    let result = await contractInstance.methods.toggleCompleted(taskId).send({from: account});
    if(result.status){
      //change the status of that task completed=>true
      const updatedTodos = todos.map((todo)=>{
        if(todo.id === taskId){
          return { ...todo, completed: true };
        }
        return todo;
      })
      setTodos(updatedTodos)
      console.log(updatedTodos);
    }
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


  return (
    <div className='App'>
      <header className='App-header'>
        <form>
          <input type='text' value={todo} onChange={handleInputChange} />
          <button onClick={submitTodo}>Submit</button>
        </form>
        {todos.sort((a, b) => a.completed - b.completed).map(todo => (
          todo.completed ?
          (<p id='completedTask'>{todo.task}</p>):
          (<div key={todo.id + Math.random()} id='todo'>
            <input type='checkbox' onChange={()=>toggleCompleted(todo.id)} />
            <p>{todo.task}</p>
          </div>)
        ))}
      </header>
    </div>
  )
}

export default App
