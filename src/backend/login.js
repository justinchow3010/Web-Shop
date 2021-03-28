import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";

//login page
export default function Login(props) {
    var [email, setEmail] = useState("");
    var [pw, setPw] = useState("");

    function handleLogin(e) {
        e.preventDefault();
        if (email === "" || pw === "") {
            alert("Please enter all information");
        } else {
            var url = "/admin/login.php"
            let formData = new FormData();
            formData.append("email", email);
            formData.append("password", pw);
            axios.post(url, formData)
                .then(res => {
                    console.log(res.data);
                    console.log(res.data["status"] );
                    if (res.data["status"] === "successful") {
                        alert("login")
                        window.location("/");
                    } else if (res.data["status"] === "failed") {
                        alert("There is somethin wrong with your input.")
                    }
                })
                .catch(err => { console.log(err.data) });
        }
    }

    function handleInput(e) {
        if (e.target.type === "email") {
            setEmail(e.target.value);
        } else if (e.target.type === "password") {
            setPw(e.target.value);
        }
    }

    return (
        <div className="container text-center login-box">
            <h1 className="py-5">Please Login</h1>
            <div className="row">
                <div className="col-md-12">
                    <div>
                        <label>Username:</label>
                        <div>
                            <input type="email" placeholder="abc@mail.com" onChange={handleInput}></input>
                        </div>
                    </div>
                    <div className="mt-2">
                        <label>Password:</label>
                        <div>
                            <input type="password" onChange={handleInput}></input>
                        </div>
                    </div>
                    <div className="mt-3">
                        <button className="btn btn-dark" name="action" value="login" onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
