import { Component } from "react";
import User from "./user";
import { getAll } from "./utils";

const usersUrl = "https://jsonplaceholder.typicode.com/users";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      filteredUsers: [],
      activeUser: null,
      showAddUser: false,
      formErrorUser: false,
      formErrorEmail: false,
    };
  }

  componentDidMount() {
    this.getUsers();
  }

  componentDidUpdate() {}

  filter = (e) => {
    const value = e.target.value;

    const filtered = this.state.users?.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );

    this.setState({ filteredUsers: filtered });
  };

  getUsers = async () => {
    const { data: users } = await getAll(usersUrl);
    this.setState({
      users,
      filteredUsers: users,
    });
  };

  clear() {
    this.setState({ filteredUsers: this.state.users });
    document.querySelector("#filter").value = "";
  }

  updateUsers(id, user) {
    //console.log(id, 'user: ', user);
    const _users = this.state.users.map((_user) => {
      if (id === _user.id) {
        return user;
      }
      return _user;
    });

    const _filtered = this.state.filteredUsers.map((_user) => {
      if (id === _user.id) {
        return user;
      }
      return _user;
    });

    this.setState({
      users: [..._users],
      filteredUsers: [..._filtered],
    });
    console.log(this.state.users);
  }

  deleteUsers(id) {
    let delUser = "";
    const _users = this.state.users.map((_user) => {
      if (id === _user.id) {
        delUser = _user;
      }
      return _user;
    });
    _users.splice(_users.indexOf(delUser), 1);

    const _filtered = this.state.filteredUsers.map((_user) => {
      if (id === _user.id) {
        delUser = _user;
        //return _user;
        //_filtered.pop(_user);
      }
      return _user;
    });

    _filtered.splice(_filtered.indexOf(delUser), 1);

    this.setState({
      users: [..._users],
      filteredUsers: [..._filtered],
    });
    console.log(this.state.users);
  }
  setActiveUser(id, props) {
    this.setState({
      activeUser: {
        id,
        ...props,
      },
    });
  }

  addUser(event) {
    event.preventDefault();
    const { newUserName, newUserEmail } = this;
    const user = newUserName.value;
    const email = newUserEmail.value;
    if (user.length && email.length) {
      this.setState({
        formErrorUser: false,
        formErrorEmail: false,
        showAddUser: false
      });

      const newUserProps = {
        id: this.state.users.length + 1,
        name:user,
        email,
      }

      this.setState({
        users: [
          ...this.state.users,
          newUserProps,
        ],
        filteredUsers: [
          ...this.state.filteredUsers,
          newUserProps,
        ],
      });
    } else {
      !user.length && this.setState({ formErrorUser: !user.length });
      !email.length && this.setState({ formErrorEmail: !email.length });
    }
  }

  showAddUser() {
    // console.log(this.state.showAddUser);

    return (
      this.state.showAddUser && (
        <form className="add_user" onSubmit={this.addUser.bind(this)}>
          <div>
            <div
              className={`formItem ${this.state.formErrorUser ? "error" : ""}`}
            >
              <label htmlFor="name">Name</label>
              <input
                id={"name"}
                type="text"
                name="name"
                placeholder="Enter name"
                onChange={() => this.setState({ formErrorUser: false })}
                ref={(node) => (this.newUserName = node)}
              />
            </div>
            <div
              className={`formItem ${this.state.formErrorEmail ? "error" : ""}`}
            >
              <label htmlFor="email">Email</label>
              <input
                id={"email"}
                type="email"
                placeholder="Enter email"
                name="email"
                onChange={() => this.setState({ formErrorEmail: false })}
                ref={(node) => (this.newUserEmail = node)}
              />
            </div>
            <div className="add_footer">
              <button type={"submit"}>Add</button>
              <button onClick={() => this.setState({ showAddUser: false })}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      )
    );
  }

  handleAddUser() {
    this.setState({ showAddUser: !this.state.showAddUser });
    // console.log(this.state.showAddUser);
  }

  render() {
    // Repeater
    //console.log(this.state.filteredUsers);
    const users = this.state.filteredUsers.map((user, index) => {
      const userProps = {
        setActiveUser: this.setActiveUser.bind(this),
        activeUser: this.state.activeUser,
        updateUsers: this.updateUsers.bind(this),
        deleteUsers: this.deleteUsers.bind(this),
        user,
      };
      return <User key={index} {...userProps} />;
    });

    return (
      <div>
        <div>
          <strong>{this.state.filteredUsers?.length} Users</strong>
          <br />
          <input type="text" id="filter" onChange={this.filter}></input>
          <button onClick={() => this.clear.call(this)}>Clear</button>
          <button onClick={() => this.handleAddUser.call(this)}>
            {this.state.showAddUser ? "Hide" : "Show"} Add User
          </button>
          <br />
          {this.showAddUser()}
          {users}
        </div>
      </div>
    );
  }
}

export default Users;
