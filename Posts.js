import { Component } from "react";

class Posts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (
      (!this.state.posts.length && this.props.posts.length) ||
      JSON.stringify(prevProps.posts) !== JSON.stringify(this.props.posts)
    ) {
      this.setState({ posts: this.props.posts });
    }
  }

  render() {
    return (
      this.props.show && (
        <div className={this.state.posts.length ? "list" : null}>
          {this.state.posts.length ? (
            <div>
              <ul>
                {this.state.posts.map((post, index) => (
                  <li key={index} className="hr">
                    <div>
                      <strong>Title:</strong>
                      {post.title}
                      <br />
                      <strong>Body:</strong>
                      {post.body}
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

export default Posts;
