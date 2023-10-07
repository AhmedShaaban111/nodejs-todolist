const fs = require("fs");
const { program } = require("commander");
const stringifiedTasks = fs.readFileSync("./titles.json", "utf8");
const Tasks = JSON.parse(stringifiedTasks);
const writeUpdatedTasks = (titles) =>
  fs.writeFileSync("./titles.json", JSON.stringify(titles, null, 2));

var counter =
  Tasks.length > 0 ? Math.max(...Tasks.map((task) => task.id)) + 1 : 1;
const addNewTask = (options) => {
  const { name, status } = options;
  Tasks.push({
    id: counter++,
    name,
    status,
  });
  writeUpdatedTasks(Tasks);
};
const listTasks = () => console.log(Tasks);
const deleteTask = (id) => {
  const filteredTasks = Tasks.filter((task) => task.id !== +id);
  writeUpdatedTasks(filteredTasks);
};
const editTask = (options) => {
  const { id, name, status } = options;

  const taskToEdit = Tasks.find((task) => task.id === +id);

  if (taskToEdit) {
    taskToEdit.name = name;
    taskToEdit.status = status;
    writeUpdatedTasks(Tasks);
  } else {
    console.error("Task not found with ID:", id);
  }
};

const listByStatus = (status) => {
  const tasksWithStatus = Tasks.filter((task) => task.status === status);
  console.log(tasksWithStatus);
};

program

  .name("users CLI")
  .description("CLI to operate on tasks data")
  .version("1.0.0");

program
  .command("add")
  .description("Add task to our Json")
  .requiredOption("-n, --name <string>", "must enter title name")
  .option("-s, --status <string>", "status", "to do")
  .action((options) => {
    console.log(options);
    addNewTask(options);
  });
program
  .command("list")
  .description("list all tasks")
  .action(() => {
    listTasks();
  });
program
  .command("delete")
  .description("delete specific task")
  .argument("<number>", "id of task")
  .action((id) => {
    deleteTask(id);
  });
program
  .command("edit")
  .description("edit existing task with id")
  .option("-i,--id <number>", "id of task to delete")
  .requiredOption("-n, --name <string>", "must enter title name")
  .option("-s, --status <string>", "status", "to do")
  .action((options) => {
    editTask(options);
  });

program
  .command("listStatus")
  .argument("<string>", "status of task")
  .action((status) => {
    listByStatus(status);
  });
program.parse();
