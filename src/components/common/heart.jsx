import React, { Component } from "react";
class Heart extends Component {
  getHeartIcon() {
    let classes = "fa fa-heart";
    classes += this.props.liked ? " " : "-o";
    return classes;
  }

  render() {
    return (
      <i
        className={this.getHeartIcon()}
        style={{ cursor: "pointer" }}
        onClick={this.props.onClick}
      ></i>
    );
  }
}

export default Heart;
