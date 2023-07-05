// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract TodoList{
  uint public taskCount = 0;

  struct Task{
    uint id;
    string task;
    bool completed;
  }

  mapping(uint => Task) public tasks;

  constructor() {
    createTask('checkout cryptokingpin');
  }

  function createTask(string memory _content) public{
    taskCount++;
    tasks[taskCount] = Task(taskCount, _content, false);
  }
}
