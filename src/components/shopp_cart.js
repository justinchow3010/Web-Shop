import React from 'react';
import EventEmitter from './tools/event_emitter'
import axios from 'axios';

export default class ShoppingCart extends React.Component {
    constructor() {
        super();
        this.state = {
            rawCartList: [],
            parseCartList: [],
            totalPrice: 0,
            custom: "",
            invoice: 0
        };
        this.updateCart = this.updateCart.bind(this);
    }

    getCartInfo() {
        const url = "/admin/product.php";
        axios.get(url, { params: { rawCartList: JSON.stringify(this.state.rawCartList) } })
            .then(res => {
                this.setState({
                    parseCartList: res.data
                }, () => {
                    this.calTotalPrice();
                });
            })
            .catch(error => { console.log(error) });
    }

    calTotalPrice() {
        var total = 0;
        this.state.parseCartList.map((data, index) => {
            total += parseFloat(data.price, 10) * this.state.rawCartList[index].quan;
        })
        //console.log(total);
        this.setState({
            totalPrice: total
        })
    }

    updateCart(event) {
        this.setState({
            rawCartList: event.items
        }, () => {
            this.getCartInfo();
        });
    }

    getLocalStorage() {
        var items = [];
        var json = localStorage.getItem("cart");
        //console.log(json);
        if (json !== null) {
            JSON.parse(json).map((data, i) => {
                //console.log(data);
                items.push(data);
            })
        }
        return items;
    }

    changeQuan = e => {
        var json = localStorage.getItem("cart");
        var items = [];
        //console.log(e.target.name);
        if (json !== null) {
            JSON.parse(json).map((data, i) => {
                if (data.pid !== e.target.name) {
                    items.push(data);
                } else {
                    if (e.target.value !== "0") {
                        data.quan = parseInt(e.target.value, 10);
                        items.push(data);
                    }
                }
            });
            localStorage.removeItem("cart");
            localStorage.setItem("cart", JSON.stringify(items));
            this.setState({
                rawCartList: items
            }, () => {
                this.calTotalPrice();
            });

        }
    }

    removeItem(index) {
        var tmpParse = [...this.state.parseCartList];
        var tmpRaw = [...this.state.rawCartList];
        var items = this.getLocalStorage();
        tmpParse.splice(index, 1);
        tmpRaw.splice(index, 1);
        items.splice(index, 1);
        localStorage.removeItem("cart");
        localStorage.setItem("cart", JSON.stringify(items));
        this.setState({
            parseCartList: tmpParse,
            rawCartList: tmpRaw
        }, () => {
            this.calTotalPrice();
        });
    }

    cartSubmit(e) {
        e.preventDefault();
        //console.log(e.target[7]);
        var formData = new FormData();
        var upload = {};
        if (this.state.rawCartList.length > 0) {
            for (var i = 0; i < this.state.rawCartList.length; i++) {
                var id = this.state.rawCartList[i].pid;
                upload[id] = this.state.rawCartList[i].quan;
            }
        };
        //console.log(upload);
        formData.append("upload", JSON.stringify(upload));
        axios.post("/admin/checkout_process.php", formData)
            .then(res => {
                this.setState({
                    custom: res.data["custom"],
                    invoice: res.data["invoice"]
                }, () => {
                    //console.log(this.state.custom);
                    //console.log(this.state.invoice);
                    e.target.submit();
                    localStorage.removeItem("cart");
                });
                //window.location.replace("/");
            })
            .catch(error => { console.log(error) });
    }

    componentDidMount() {
        var items = this.getLocalStorage();
        this.setState({
            rawCartList: items
        }, () => {
            //console.log("list" + this.state.rawCartList);
            if (this.state.rawCartList.length > 0) {
                this.getCartInfo();
            }
        });

        const listener = EventEmitter.addListener("updateCart", this.updateCart);
        return () => {
            listener.remove();
        }
    }
//action="https://www.sandbox.paypal.com/us/cgi-bin/webscr"
    render() {
        return (
            <div className="cart">
                Shopping Cart
                <div className="drop-down">
                    <form method="post" onSubmit={this.cartSubmit.bind(this)} action="https://www.sandbox.paypal.com/us/cgi-bin/webscr">
                        <input type="hidden" name="cmd" value="_cart" />
                        <input type="hidden" name="upload" value="1" />
                        <input type="hidden" name="business" value="sb-4q32t5876156@business.example.com" />
                        <input type="hidden" name="currency_code" value="HKD" />
                        <input type="hidden" name="charset" value="utf-8" />
                        {this.state.parseCartList.map((data, index) => {
                            if (this.state.rawCartList.length > 0) {
                                return [
                                    <input type="hidden" name={`item_name_${index + 1}`} value={data.name} />,
                                    <input type="hidden" name={`amount_${index + 1}`} value={data.price} />,
                                    <input type="hidden" name={`quantity_${index + 1}`} value={this.state.rawCartList[index].quan} />
                                ]
                            }
                        })}
                        <input type="hidden" name="custom" value={this.state.custom} />
                        <input type="hidden" name="invoice" value={this.state.invoice} />
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.parseCartList.map((data, index) => {
                                    if (this.state.rawCartList.length > 0) {
                                        return <tr>
                                            <td>{data.name}</td>
                                            <td><input type="number" className="item-input" placeholder={this.state.rawCartList.length > 0 ? this.state.rawCartList[index].quan : ""} onChange={this.changeQuan} name={this.state.rawCartList.length > 0 ? this.state.rawCartList[index].pid : ""} value={this.state.rawCartList.length > 0 ? this.state.rawCartList[index].quan : ""} min="1"></input></td>
                                            <td>${data.price}</td>
                                            <td><button className="btn btn-danger ml-2" onClick={() => { this.removeItem(index) }}>Delete</button></td>
                                        </tr>
                                    }
                                })}
                            </tbody>
                        </table>
                        <div>Total Price: ${this.state.totalPrice}</div>
                        <input type="submit" className="btn btn-secondary" value="Checkout" />
                    </form>
                </div>
            </div>
        )
    }
}