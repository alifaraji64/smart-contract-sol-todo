const TodoList = artifacts.require('TodoList')

contract('TodoList', accounts => {
  before(async () => {
    this.todoList = await TodoList.deployed()
  })

  it('deployed successfully', async()=>{
    const address = await this.todoList.address;
    assert.notEqual(address, '');
    assert.notEqual(address, 0x0);
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  })

  it('task check', async()=>{
    const taskCount = await this.todoList.taskCount();
    const task = await this.todoList.tasks(taskCount);
    assert.equal(taskCount, 1);
    assert.equal(task.id.toNumber(), 1);
    assert.equal(task.task, 'checkout cryptokingpin');
    assert.equal(task.completed, false);
  })

  it('creates tasks', async()=>{
    const result = await this.todoList.createTask('second task');
    const taskCount = await this.todoList.taskCount();
    assert.equal(taskCount, 2);
    const event = result.logs[0].args;
    assert.equal(event.id.toNumber(), 2);
    assert.equal(event.task, 'second task');
    assert.equal(event.completed, false);
  })

  it('toggles completed', async()=>{
    const taskCount = await this.todoList.taskCount();
    await this.todoList.toggleCompleted(taskCount);
    const task = await this.todoList.tasks(taskCount);
    assert.equal(task.completed, true);
  })
})
