import React, { useState, useEffect } from 'react';
import { Link, Switch, Route, useParams } from "react-router-dom";
import axios from 'axios';

export default function Orders() {
    return (
        <div>
            <Switch>
                <Route path="/orders/:id">
                    <OrderPage />
                </Route>
                <Route path="/orders">
                    <Order />
                </Route>
            </Switch>
        </div>
    )
}

function Order(props) {
    var [list, setList] = useState([]);
    var username = "";

    useEffect(() => {
        axios.get("/admin/login.php", { params: { userName: "check" } })
            .then(res => {
                username = res.data[0];
                axios.get("/admin/orders.php", { params: { username: username } })
                .then(result => {
                    setList(result.data["invoice"].map((data, index) => {
                        return <li class="list-group-item"><Link to={`/orders/${data["invoice"]}`}>{data["invoice"]}</Link></li>
                    }))
                })
            })
            .catch(error => console.log(error));
    }, [])

    return (
        <div className="container">
            <div className="text-center">
                <h2>Past 5 orders</h2>
            </div>
            <div className="text-center">
                <ul class="list-group list-group-flush">
                    {list}
                </ul>
            </div>
        </div>
    )
}

function OrderPage(props) {
    var [list, setList] = useState([]);
    var [price, setPrice] = useState(0);
    const { order, id } = useParams();
    
    useEffect(() => {
        //console.log("id" + id);
        var totalPrice = 0;
        axios.get("/admin/orders.php", { params: { id: id } })
            .then(res => {
                setList(res.data["message"].map(data => {
                    totalPrice += parseFloat(data["price"], 10) * parseFloat(data["quantity"], 10);
                    if (!data["payment_status"]) {
                        data["payment_status"] = "pending";
                    }
                    return <li class="list-group-item">Product Name: {data["product_name"]}  Quantity: {data["quantity"]} Price: ${data["price"]} Status: {data["payment_status"]}</li>
                }))
                //console.log(totalPrice);
                setPrice(totalPrice);
            })
    }, [])

    return (
        <div className="container">
            <div className="py-5 text-center">
            </div>
            <div className="text-center">
                <ul class="list-group list-group-flush">
                    {list}
                </ul>
                <h2>Total Price: ${price}</h2>
            </div>
        </div>
    )
}
