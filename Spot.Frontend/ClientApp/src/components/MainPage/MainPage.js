import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";

export default function MainPage() {

    const [accountType, setAccountType] = useState("");

    const checkAccount = () => {
        console.log("checking account type now:", accountType);
        if (accountType === "business") {
            return (<Redirect to="/businesspage" />);
        } else {
            return (<Redirect to="/clientpage" />);
        }
    }

    return (
        <div>
            <p>testing, MainPage works!</p>
            {checkAccount()}
        </div>
    )
}