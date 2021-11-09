// import logo from './logo.svg';
import './App.css';
import LandingPage from './components/LandingPage/LandingPage';
import LogIn from './components/UserAuth/LogIn/LogIn';
import SignUp from './components/UserAuth/SignUp/SignUp';
import SignUpBusiness from './components/UserAuth/SignUp/SignUpBusiness';
import MainPage from './components/MainPage/MainPage';
import Test from './components/Test/Test';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/login">
            <LogIn />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/signupbusiness">
            <SignUpBusiness />
          </Route>
          <Route path="/mainpage">
            <MainPage />
          </Route>
          <Route path="/test">
            <Test />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
