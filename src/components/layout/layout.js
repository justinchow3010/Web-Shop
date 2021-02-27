import React, { useState, useEffect } from 'react';
import Clock from '../partials/clock';
import { Link } from "react-router-dom";
import axios from 'axios';

//layout
export default function Layout(props) {
    const [list, setList] = useState([]);

    useEffect(() => {
        const url = "/admin/category.php";
        axios.get(url)
            .then(res => {
                console.log(res.data);
                setList(res.data);
            })
            .catch(error => console.log(error));
        console.log(list);
    }, [])

    return (
        <div className={props.className}>
            <nav className="nav-menu">
                <h2><Link to="/">GLOBAL SHOP</Link></h2>
                <Clock />
                <span> <Link to="/backend/admin">Admin Panel</Link></span>
                <div className="cart">
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
                <div className="category-list">
                    {list.map((catName) => {
                        return <p><Link to={`/${catName.name}`}>{catName.name}</Link></p>
                    })}
                </div>
            </nav>

            <div className="wrap">
                {props.children}
                <div className="sidebar-2">
                    Advetisment
                </div>
            </div>

            <footer className="text-muted"> All right reserved to Justin</footer>
        </div>
    )
}
