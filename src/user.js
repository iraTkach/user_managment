import { Component } from "react";
import Tasks from "./Tasks";
import Posts from "./Posts";
import { getAll, updateObj, deleteObj } from "./utils";
import "./style.css";

const url = "https://jsonplaceholder.typicode.com/users";
const urlTodos = "https://jsonplaceholder.typicode.com/todos?userId=";
const urlPosts = "https://jsonplaceholder.typicode.com/posts?userId=";

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        id: "",
        name: "",
        email: "",
        address: {
          city: "",
          street: "",
        },
        showAll: false,
      },
      status: props.activeUser?.status || false,
      isValid: false,
      showTasks: false,
      tasks: props.activeUser?.tasks || [],
      posts: props.activeUser?.posts || [],
      showAddress: props.activeUser?.showAddress || false,
    };
  }

  componentDidMount() {
    const { id, name, email, address } = this.props?.user;
    this.setState({ user: { id, name, email, address } });

    this.handleStyle();
  }

  componentDidUpdate(prevState) {
    // console.log('pre', prevState.user.name)
    // console.log('props', this.props.user.name)
    const { user, activeUser } = this.props;
    if (prevState.user.name !== user.name) {
      const { id, name, email, address } = user;
      this.setState({ user: { id, name, email, address } });
      this.handleStyle();
    }

    if (activeUser) {
      if (!this.state.tasks.length && activeUser?.tasks?.length) {
        this.setState({ tasks: activeUser?.tasks });
      }

      if (!this.state.posts.length && activeUser?.posts?.length) {
        this.setState({ posts: activeUser?.posts });
      }
    }
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ user: { ...this.state.user, [name]: value } });
  };

  showAddress = () =>
    // const { data: user } = await getById(url, this.props.user.id);
    this.state.showAddress && (
      <div>
        <label htmlFor="city">City</label>
        <input
          id={"city"}
          type="text"
          name="city"
          value={this.state.user.address.city}
          onChange={this.handleChange}
        />
        <br />
        <label htmlFor="street">Street</label>
        <input
          id={"street"}
          type="text"
          name="street"
          value={this.state.user.address.street}
          onChange={this.handleChange}
        />
        <br />
      </div>
    );

  toggleAddress() {
    this.setState({ showAddress: this.state.showAddress ? false : true });
  }

  updateData = async () => {
    try {
      //if (this.state.id && this.state.isValid) {
      const updatedUser = { ...this.state.user };
      console.log("updatedUser", updatedUser);
      //console.log(this.props.user.id)

      const { data: response } = await updateObj(
        url,
        this.props.user.id,
        updatedUser
      );
      console.log("response: ", response);
      this.props.updateUsers(this.props.user.id, updatedUser);

      // } else {
      //     alert('All fields required!')
      // }
    } catch (error) {
      console.log(error);
    }
  };

  deleteUser = async () => {
    try {
      const { data: response } = await deleteObj(url, this.props.user.id);
      console.log(response);
      this.props.deleteUsers(this.props.user.id);
    } catch (error) {
      console.log(error);
    }
  };

  isEntityOwner(name) {
    const entities = this.state[name];
    return (
      entities?.length &&
      entities?.filter((n) => n.userId === this.props?.user?.id).length ===
        entities?.length
    );
  }

  updateActiveUser() {
    this.handleStyle();

    this.props.setActiveUser(this.props.user.id, {
      status: this.state.status,
      tasks: this.state.tasks,
      posts: this.state.posts,
      showAddress: this.state.showAddress,
    });
  }

  showTodos = async (url, name) => {
    if (this.isEntityOwner(name)) {
      this.updateActiveUser();
    } else {
      const { data: todos } = await getAll(`${url}${this.props.user.id}`);
      const top3Todos = todos.slice(0, 3);

      this.setState({ [name]: top3Todos }, this.updateActiveUser);
    }
  };

  showData() {
    this.setState({ showTasks: !this.state.showTasks }, () => {
      if (!this.state.showTasks) return false;
      //console.log(this.state.user.showAll);
      if (
        this.props.user.id !== this.props.activeUser ||
        !this.isEntityOwner("tasks")
      ) {
        this.showTodos(urlTodos, "tasks");
        this.showTodos(urlPosts, "posts");
        this.setState({ showAll: true });
        // console.log("!!",this.state.showAll);

        document.querySelector(`#user_${this.props.user.id}`).scrollIntoView();
      }
      // else
      //   this.setState({ showAll: false});
    });
  }

  handleStyle() {
    if (this.isEntityOwner("tasks")) {
      this.setState({
        status: this.state.tasks.length
          ? this.state.tasks.filter((task) => !task.completed).length === 0
          : false,
      });
    } else {
      this.setState({ status: false });
    }
  }

  updateUserTasks(tasks) {
    this.setState({ tasks: [...tasks] }, this.handleStyle);
  }

  render() {
    //console.log(this.props.user);
    const showDataCondition =
      this.state.showTasks && this.props.user.id === this.props.activeUser?.id;
    //console.log(this.props.user.id, this.props.activeUser, this.state.tasks);
    // showDataCondition && console.log(this.state.posts,this.state.tasks)
    return (
      <div className="userWrapper" id={`user_${this.props.user.id}`}>
        <div className={`status_${this.state.status ? "green" : "red"}`}>
          <div>
            <header onClick={() => this.showData.call(this)}>
              ID: {this.props.user.id}
            </header>
            <div className="formItem">
              <label htmlFor={`name_${this.props.user.id}`}>Name</label>
              <input
                id={`name_${this.props.user.id}`}
                type="text"
                name="name"
                value={this.state?.user?.name}
                onChange={this.handleChange}
              />
            </div>
            <div className="formItem">
              <label htmlFor={`email_${this.props.user.id}`}>Email</label>
              <input
                id={`email_${this.props.user.id}`}
                type="text"
                name="email"
                value={this.state?.user?.email}
                onChange={this.handleChange}
              />
            </div>
            <button onClick={() => this.toggleAddress.call(this)}>
              Other Data
            </button>
            {this.showAddress()}
            <button onClick={this.updateData}>Update</button>
            <button onClick={this.deleteUser}>Delete</button>
          </div>
        </div>
        <Tasks
          show={showDataCondition}
          userId={this.props.user.id}
          updateUserTasks={this.updateUserTasks.bind(this)}
          callback={() => this.handleStyle.call(this)}
          tasks={this.state.tasks}
        />
        <Posts
          show={showDataCondition}
          userId={this.props.user.id}
          posts={this.state.posts}
        />
      </div>
    );
  }
}

export default User;
