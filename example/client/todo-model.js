import BicycleClient from '../../src/client'; // in a real app, the path should be 'bicycle/client'
import {uuid} from './utils.js';

export default function TodoModel() {
  this.todos = [];
  this.onChanges = [];

  this._client = new BicycleClient();
  this._subscription = this._client.subscribe({todos: {id: true, title: true, completed: true}}, (result, loaded) => {
    if (loaded) { // ignore partial results
      this.todos = result.todos;
      this.inform();
    }
  });
}

TodoModel.prototype.subscribe = function (onChange) {
  this.onChanges.push(onChange);
};

TodoModel.prototype.inform = function () {
  this.onChanges.forEach(cb => cb());
};

TodoModel.prototype.addTodo = function (title) {
  this._client.update('Todo.addTodo', {id: uuid(), title, completed: false}, (mutation, cache) => {
    if (cache.root.todos) {
      return {
        ['Todo:' + mutation.args.id]: mutation.args,
        root: {
          todos: ['Todo:' + mutation.args.id].concat(cache.root.todos),
        },
      };
    }
    return {};
  }).done();
};

TodoModel.prototype.toggleAll = function (checked) {
  this._client.update('Todo.toggleAll', {checked}, (mutation, cache) => {
    if (cache.root.todos) {
      const result = {};
      cache.root.todos.forEach(key => {
        result[key] = {completed: checked};
      });
      return result;
    }
    return {};
  });
};

TodoModel.prototype.toggle = function (todoToToggle) {
  this._client.update('Todo.toggle', {id: todoToToggle.id, checked: !todoToToggle.completed}, (mutation, cache) => {
    return {['Todo:' + mutation.args.id]: {completed: mutation.args.checked}};
  });
};

TodoModel.prototype.destroy = function (todo) {
  this._client.update('Todo.destroy', {id: todo.id}, (mutation, cache) => {
    if (cache.root.todos) {
      return {
        root: {
          todos: cache.root.todos.filter(id => id !== 'Todo:' + mutation.args.id),
        },
      };
    }
    return {};
  });
};

TodoModel.prototype.save = function (todoToSave, text) {
  this._client.update('Todo.save', {id: todoToSave.id, title: text}, (mutation, cache) => {
    return {
      ['Todo:' + mutation.args.id]: {title: mutation.args.title},
    };
  });
};

TodoModel.prototype.clearCompleted = function () {
  this._client.update('Todo.clearCompleted', {}, (mutation, cache) => {
    if (cache.root.todos) {
      return {
        root: {
          todos: cache.root.todos.filter(id => !cache[id].completed),
        },
      };
    }
    return {};
  });
};