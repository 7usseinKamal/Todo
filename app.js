// ES7 OOP
class Todo {
  input = document.querySelector("input");
  add = document.querySelector(".plus");
  tasksContent = document.querySelector(".tasks-content");
  countTasks = document.querySelector(".count-tasks span");
  completedTasks = document.querySelector(".completed-tasks span");
  reset = document.getElementById("btn");
  todoList = [];

  // method to check if "tasksContent" is empty to show no tasks message
  checkContent() {
    if (this.tasksContent.childElementCount === 0) {
      this.tasksContent.innerHTML = `<span class="no-tasks-message">No Tasks To Show</span>`;
    }
  }

  renderToTheDOM() {
    let listResult = "";
    this.todoList.forEach((list) => {
      listResult += `
        <span class="task-box" id=${list.id}>
          <h3 class="headThree ${list.isCompelted ? "finished" : ""}">
            ${list.title}
          </h3>
          <span class="delete"><i class="fas fa-trash-alt"></i></span>
        </span>
      `;
    });

    return listResult;
  }

  // method to get data from localStorage if it found
  isInLocalStorage() {
    let storageData;
    if (localStorage.getItem("todoList")) {
      storageData = JSON.parse(localStorage.getItem("todoList"));
    } else {
      storageData = [];
    }
    this.todoList = storageData;
    this.tasksContent.innerHTML = this.renderToTheDOM();
  }

  // get input value and put it into screen
  getTodo() {
    if (this.input.value.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Forbidden...",
        text: "You Mustn't Add An Empty Task!",
      });
      return;
    } else {
      let data = {};
      // value id
      data.id = Math.random().toString();
      // input value
      data.title = this.input.value.trim();
      // is completed key
      data.isCompelted = false;
      // push to array
      this.todoList.push(data);
      // pu to localStorage
      localStorage.setItem("todoList", JSON.stringify(this.todoList));
      this.tasksContent.innerHTML = this.renderToTheDOM();
      this.tasksLength();
      this.input.value = "";
    }
  }

  // method to calc length of tasks
  tasksLength() {
    this.countTasks.innerHTML = this.todoList.length;
  }

  // method to check if is completed or not
  isCompletedTasks(id) {
    // find specific item
    const singleItem = this.todoList.find((list) => list.id === id);
    if (singleItem) {
      // to toggle isCompleted key onClick
      singleItem.isCompelted = !singleItem.isCompelted;
    }
    // get an array of isCompelted objects == true
    const completedArr = this.todoList.filter(
      (list) => list.isCompelted === true
    );
    // to localStorage
    localStorage.setItem("todoList", JSON.stringify(this.todoList));
    this.completedTasks.innerHTML = completedArr.length;
  }

  // method to remove task
  removeTodoList(id) {
    const remainingArr = this.todoList.filter((list) => list.id !== id);
    this.todoList = remainingArr;
    localStorage.setItem("todoList", JSON.stringify(remainingArr));
    this.tasksLength();
    this.isCompletedTasks(id);
    // to show no tasks message
    if (this.tasksContent.childElementCount <= 1) {
      this.tasksContent.innerHTML = `<span class="no-tasks-message">No Tasks To Show</span>`;
    }
  }

  // method to clear list
  clearList() {
    if (this.todoList.length === 0) {
      return;
    }
    this.todoList = [];
    localStorage.setItem("todoList", JSON.stringify(this.todoList));
    this.tasksLength();
    // this.isCompletedTasks(id);
    this.tasksContent.innerHTML = `<span class="no-tasks-message">No Tasks To Show</span>`;
    this.completedTasks.innerHTML = 0;
  }
}

// execute class
const todo = new Todo();

todo.add.addEventListener("click", () => {
  todo.getTodo();
});

// event to put tasks finished or remove task
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("headThree")) {
    e.target.classList.toggle("finished");
    todo.isCompletedTasks(e.target.parentElement.id);
  } else if (e.target.classList.contains("fa-trash-alt")) {
    todo.removeTodoList(e.target.parentElement.parentElement.id);
    e.target.parentElement.parentElement.remove();
  }
});

// event to clear tasks
todo.reset.addEventListener("click", () => {
  todo.clearList();
});

// event to execute first on reload
document.addEventListener("DOMContentLoaded", () => {
  todo.isInLocalStorage();
  todo.tasksLength();
  const completedArr = todo.todoList.filter(
    (list) => list.isCompelted === true
  );
  todo.completedTasks.innerHTML = completedArr.length;
  todo.checkContent();
});
