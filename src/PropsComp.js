import { Component } from "react";

class PropsComp extends Component {

    render() {
        return (
            <div>
                Name: {this.props.name} <br />
                Age: {this.props.age}
            </div>
        )
    }
}

export default PropsComp;