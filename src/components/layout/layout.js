import React from 'react';
import Clock from '../partials/clock';
import { Link } from "react-router-dom";

//layout
export default function layout(props) {

    return (
        <div className={props.className}>
            <nav className="nav-menu">
                <h2>GLOBAL SHOP</h2>
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
                    <p><Link to="/">Shoes</Link></p>
                    <p>T-shirt</p> {/*not made yet*/}
                    <p>Trousers</p> {/*not made yet*/}
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
