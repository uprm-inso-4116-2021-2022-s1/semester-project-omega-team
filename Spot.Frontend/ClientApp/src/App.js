// import logo from './logo.svg';
import './App.css';
import LandingPage from './components/LandingPage/LandingPage';
import LogIn from './components/UserAuth/LogIn/LogIn';
import SignUp from './components/UserAuth/SignUp/SignUp';
import MainPage from './components/MainPage/MainPage';
import BusinessPage from './components/MainPage/Business/BusinessPage';
import ClientPage from './components/MainPage/Client/ClientPage';
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
          <Route path="/mainpage">
            <MainPage />
          </Route>
          <Route path="/businesspage">
            <BusinessPage />
          </Route>
          <Route path="/clientpage">
            <ClientPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
