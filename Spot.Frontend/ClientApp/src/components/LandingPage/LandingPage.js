import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div>
            <p>testing, LandingPage works!</p>
            <p><Link to="/login">LogIn</Link></p>
            <p><Link to="/signup">SignUp</Link></p>
            <p><Link to="/mainpage">MainPage</Link></p>
        </div>
    )
}