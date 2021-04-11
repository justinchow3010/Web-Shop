import React, { useState, useEffect } from 'react';
import axios from 'axios';

//login page
export default function ResetPassword(props) {
    var [email, setEmail] = useState("");
    var [oldPw, setOldPw] = useState("");
    var [newPw, setNewPw] = useState("");
    var [error, setError] = useState("");
    var [loggedIn, setLoggedIn] = useState(false);

    function handleReset(e) {
        e.preventDefault();
        let formData = new FormData();
        formData.append("email", email);
        formData.append("oldPassword", oldPw);
        formData.append("newPassword", newPw);
        axios.post("/admin/reset.php", formData)
            .then(res => {
                if (res.data["status"] === "successful") {
                    alert(res.data["message"]);
                    axios.get("/admin/login.php", { params: { "logout": "true" } })
                        .then(ress => {
                            if (ress.data === "successful") {
                                window.location.replace("/");
                            } else if (ress.data === "failed") {
                                alert("Failed to logout.");
                            }
                        })
                } else if (res.data["status"] === "failed") {
                    setError(res.data["message"]);
                }
            })
            .catch(error => {
                console.log(error.data);
            })
    }

    function handleInput(e) {
        if (e.target.type === "email") {
            setEmail(e.target.value);
        } else if (e.target.name === "oldPassword") {
            setOldPw(e.target.value);
        } else if (e.target.name === "newPassword") {
            setNewPw(e.target.value);
        }

        if (newPw === oldPw) {
            setError("The new password cannot be the same as the old password.");
        }
    }

    useEffect(() => {
        axios.get("/admin/login.php")
            .then((res) => {
                if (res.data[0] === "notLoggedIn") {
                    setLoggedIn(false);
                } else {
                    setLoggedIn(true);
                }
            })
    }, [])

    if (loggedIn === true) {
        return (
            <div className="container text-center">
                <h1 className="py-5">Reset password</h1>
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
                            <label>Old Password:</label>
                            <div>
                                <input type="password" name="oldPassword" onChange={handleInput}></input>
                            </div>
                        </div>
                        <div className="mt-2">
                            <label>New Password:</label>
                            <div>
                                <input type="password" name="newPassword" onChange={handleInput}></input>
                            </div>
                        </div>
                        <div className="mt-3 login-box">
                            <button className="btn btn-dark" onClick={handleReset}>Reset</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else if (loggedIn === false) {
        return (
            <div className="container text-center">
                <h1 className="py-5">Please Login to proceed further action.</h1>
            </div>

        )
    }
}
