import React, { useState, useEffect } from 'react';
import Clock from '../partials/clock';
import { Link } from "react-router-dom";
import axios from 'axios';
import ShoppingCart from '../shopp_cart'

//layout
export default function Layout(props) {
    const [list, setList] = useState([]);
    const [userName, setName] = useState("");
    const [flag, setFlag] = useState(0);

    useEffect(() => {
        const url = "/admin/category.php";
        axios.get(url)
            .then(res => {
                //console.log(res.data);
                setList(res.data);
            })
            .catch(error => console.log(error));
        //console.log(list);

        axios.get("/admin/login.php", { params: { userName: "check" } })
            .then(res => {
                setName(res.data[0]);
                setFlag(res.data[1]);
            })
            .catch(error => console.log(error));
    }, [])

    function handleLogout(e) {
        e.preventDefault();
        axios.get("/admin/login.php", { params: { "logout": "true" } })
            .then(res => {
                if (res.data === "successful") {
                    window.location.replace("/");
                } else if (res.data === "failed") {
                    alert("Failed to logout.");
                }
            })
    }

    return (
        <div className={props.className}>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <Link to="/" className="navbar-brand">GLOBAL SHOP</Link>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                {
                                    flag === "1"
                                        ? <Link to="/backend/admin" className="nav-link">Admin Panel</Link>
                                        : <div />
                                }
                            </li>
                            <li className="nav-item">
                                {
                                    userName
                                        ? <Link to="/orders" className="nav-link">My orders</Link>
                                        : <div />
                                }
                            </li>
                        </ul>
                        {
                            userName
                                ? <div className="my-2 my-lg-0 d-flex">
                                    <div className="mr-3">{userName}</div>
                                    <Link className="mr-3 text-dark login-nav" onClick={handleLogout}>Logout</Link>
                                    <Link to="/backend/reset" className="mr-3 text-dark login-nav">Reset Password</Link>
                                    <ShoppingCart />
                                </div>
                                : <div className="my-2 my-lg-0 d-flex">
                                    <div className="mr-3">Guest</div>
                                    <Link to="/backend/login" className="mr-3 text-dark login-nav">Login</Link>
                                    <ShoppingCart />
                                </div>
                        }
                    </div>
                </div>
            </nav>
            <div className="container">
                <nav className="nav d-flex">
                    {list.map((catName) => {
                        return <Link to={`/${catName.name}`} className="p-2 text-muted fs-2">{catName.name}</Link>
                    })}
                </nav>
            </div>
            {props.children}
            <footer className="text-muted"> @2021 All rights reserved to Justin</footer>
        </div>
    )
}


{/*<nav className="navbar navbar-expand-lg">
                <h2 className="navbar-brand"><Link to="/">GLOBAL SHOP</Link></h2>
                <div className="collaspe navbar-collapse">
                    <div className="navbar-nav">

                        <Clock className="nav-item" />
                        <Link to="/backend/admin" className="nav-item">Admin Panel</Link>
                        <div className="cart nav-item">
                            Shopping Cart
                                <div className="drop-down">
                                <table className="cart-table">
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Item 1</td>
                                            <td><input type="number" className="item-input"></input></td>
                                            <td>@ $100</td>
                                        </tr>
                                        <tr>
                                            <td>Item 2</td>
                                            <td><input type="number" className="item-input"></input></td>
                                            <td>@ $100</td>
                                        </tr>
                                    </tbody>
                                </table>
                                    Total Price: $200
                                    <button type="button" className="btn btn-secondary">Checkout</button>
                            </div>
                        </div>
                        <div className="category-list nav-item">
                            {list.map((catName) => {
                                return <p><Link to={`/${catName.name}`}>{catName.name}</Link></p>
                            })}
                            Shoes
                        </div>
                    </div>
                </div>
            </nav>*/}
