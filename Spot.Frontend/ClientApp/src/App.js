import logo from './logo.svg';
import './App.css';
import LogIn from './components/UserAuth/LogIn/LogIn';
import SignUp from './components/UserAuth/SignUp/SignUp';
import MainPage from './components/MainPage/MainPage';

function App() {
  return (
    <div className="App">
      <LogIn />
      <SignUp />
      <MainPage />
    </div>
  );
}

export default App;
