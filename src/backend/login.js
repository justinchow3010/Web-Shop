import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

//login page
export default function Login(props) {
    var [email, setEmail] = useState("");
    var [pw, setPw] = useState("");
    var checkCookie = true;
    var [error, setError] = useState("");

    function handleLogin(e) {
        e.preventDefault();
        if (email === "" || pw === "") {
            setError("Please enter all information");
        } else {
            var url = "/admin/login.php"
            let formData = new FormData();
            formData.append("email", email);
            formData.append("password", pw);
            axios.post(url, formData)
                .then(res => {
                    //console.log(res.data);
                    //console.log(res.data["status"]);
                    if (res.data["status"] === "successful") {
                        window.location.replace("/");
                    } else if (res.data["status"] === "failed") {
                        setError(res.data["message"]);
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

    useEffect(() => {
        axios.get("/admin/login.php")
            .then((res) => {
                if (res.data[0] === "notLoggedIn") {
                    checkCookie = false;
                } else {
                    checkCookie = true;
                }
                if (checkCookie) {
                    window.location.replace("/");
                }
            })
    }, [])

    return (
        <div className="container text-center">
            <h1 className="py-5">Please Login</h1>
            {error ? <h4 className="text-danger mb-5">{error}</h4> : <div></div>}
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
                    <div className="mt-3 login-box">
                        <button className="btn btn-dark" onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
