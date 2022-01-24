import { Component } from "react";
import { updateObj } from "./utils";

const urlTodos = "https://jsonplaceholder.typicode.com/todos";

class Tasks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      status: true,
      showAddTask: false,
      disabledBtn: false,
      formErrorTitle: false
    };
  }

  componentDidMount() {
    //this.props.callback(this.checkStatus());
  }
  componentDidUpdate(prevProps) {
    if (
      (!this.state.tasks.length && this.props.tasks.length) ||
      JSON.stringify(prevProps.tasks) !== JSON.stringify(this.props.tasks)
    ) {
      this.setState({ tasks: this.props.tasks });
    }
  }

  async taskCompleted(task) {
    // this.status = false;
    // this.props.callback(false);

    this.setState({ disabledBtn: true });
    try {
      //if (this.state.id && this.state.isValid) {
      //const updatedData = { ...this.state.tasks };
      // console.log(task);
      // console.log(this.props.tasks);
      //this.state.tasks.find()

      const { data: response } = await updateObj(urlTodos, task.id, {
        ...task,
        completed: true,
      });
      console.log(response);
      // } else {
      //     alert('All fields required!')
      // }

      const _updatedTasks = this.state.tasks.map((_task) => {
        if (_task.id === task.id) {
          _task.completed = true;
        }
        return _task;
      });

      this.setState({ tasks: [..._updatedTasks] });

      this.props.callback();

      this.setState({ disabledBtn: false });
    } catch (error) {
      console.log(error);
      this.setState({ disabledBtn: false });
    }
  }

  showAddTask() {
    return (
      this.state.showAddTask && (
        <form className="add_task" onSubmit={this.addTask.bind(this)}>
          <div>
            <div
              className={`formItem ${this.state.formErrorTitle ? "error" : ""}`}
            >
              <label htmlFor="title">Title</label>
              <input
                id={"title"}
                type="text"
                name="title"
                placeholder="Enter title"
                onChange={() => this.setState({ formErrorTitle: false })}
                ref={(node) => (this.newTask = node)}
              />
            </div>
            <div className="add_footer">
              <button type={"submit"}>Add</button>
              <button onClick={() => this.setState({ showAddTask: false })}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      )
    );
  }

  addTask(event) {
    event.preventDefault();
    // const { newTask } = this;
    const title = this.newTask.value;
    if (title.length) {
      const newTaskProps = {
        title,
        id: this.state.tasks.length + 1,
        userId: this.props.userId,
        completed: false
      }

      this.setState({
        formErrorTitle: false,
        showAddTask: false,
        tasks: [
          ...this.state.tasks,
          newTaskProps,
        ],
      }, () => {
        this.props.updateUserTasks(this.state.tasks);
      });

    } else {
      this.setState({ formErrorTitle: !title.length });
    }
  }

  render() {
    return (
      this.props.show && (
        <div className={this.state.tasks.length ? "list" : null}>
          <button
            onClick={() =>
              this.setState({ showAddTask: !this.state.showAddTask })
            }
          >
            Add Task
          </button>
          {this.showAddTask()}
          {this.state.tasks.length ? (
            <div>
              <ul>
                {this.state.tasks.map((task, index) => (
                  <li key={index} className="hr">
                    <div>
                      <strong>Title:</strong> {task.title}
                      <br />
                      {task.completed ? (
                        <strong>"Completed"</strong>
                      ) : (
                        <button
                          disabled={this.state.disabledBtn}
                          onClick={() => this.taskCompleted.call(this, task)}
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )
    );
  }
}

export default Tasks;
