import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Movies from "./movies";
import NavBar from "./navBar";
import Customer from "./customer";
import Rental from "./rentel";
import NotFound from "./notFound";
import MoviesForm from "./moviesForm";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";
import Logout from "./logout";
import auth from "../services/authService";
import ProtectedRoute from "./common/protectedRoute";

console.log("SUPERMAN", process.env.REACT_APP_NAME);

class Vidly extends Component {
  state = {};
  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }
  render() {
    const { user } = this.state;
    return (
      <div>
        <NavBar user={user} />
        <div className="content">
          <Switch>
            <Route path="/logout" component={Logout} />
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
            <ProtectedRoute path="/movies/:id" component={MoviesForm} />
            <Route
              path="/movies"
              render={(props) => <Movies {...props} user={this.state} />}
            />
            <Route path="/customer" component={Customer} />
            <Route path="/rental" component={Rental} />
            <Route path="/not-found" component={NotFound} />
            <Redirect exact from="/" to="/movies" />
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </div>
    );
  }
}
export default Vidly;
