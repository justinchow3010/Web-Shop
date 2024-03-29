import React from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

//admin page
export default class Admin extends React.Component {
    constructor() {
        super();
        var fetch = false;
        this.state = {
            CategoryName: "",
            ProductName: "",
            price: 0,
            description: "",
            catList: [],
            productList: [],
            productCatid: 0,
            productId: 0,
            action: "",
            toChange: "",
            image: [],
            orders: []
        };
    }

    componentWillMount() {
        var url = "/admin/login.php";
        axios.get(url, { xsrfCookieName: 'XSRF-TOKEN', xtxsrfHeaderName: 'X-XSRF-TOKEN' })
            .then(res => {
                if (res.data[0] === "notLoggedIn") {
                    window.location.replace("/");
                } else if (res.data[0] === "auth" && res.data[1] === "0") {
                    window.location.replace("/");
                } else {
                    fetch = true;
                }
            })
            .catch(error => console.log(error));

        axios.get("/admin/orders.php", { xsrfCookieName: 'XSRF-TOKEN', xtxsrfHeaderName: 'X-XSRF-TOKEN' })
            .then(res => {
                if (res.data["status"] === "successful") {
                    this.setState({
                        orders: res.data["message"].map((data, index) => {
                            return <tr>
                                <th scope="row">{index}</th>
                                <td>{data.username}</td>
                                <td><Link to={`/orders/${data.invoice}`}>{data.invoice}</Link></td>
                                <td>{data.custom}</td>
                                <td>{data.txnid}</td>
                                <td>{data.payment_status}</td>
                            </tr>
                        })
                    });
                } else if (res.data["status"] === "failed") {
                    alert(res.data["message"]);
                }
            })
            .catch(err => console.log(err));
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        var url = "/admin/category.php";
        axios.get(url, { xsrfCookieName: 'XSRF-TOKEN', xtxsrfHeaderName: 'X-XSRF-TOKEN' })
            .then(res => {
                console.log(res.data);
                this.setState({ catList: res.data });
            })
            .catch(error => console.log(error));

        url = "/admin/product.php";
        axios.get(url, { xsrfCookieName: 'XSRF-TOKEN', xtxsrfHeaderName: 'X-XSRF-TOKEN' })
            .then(res => {
                console.log(res.data);
                this.setState({ productList: res.data });
            })
            .catch(error => console.log(error));
    }

    handleInput = async e => {
        if (e.target.name === "image") {
            this.setState({ image: e.target.files[0] })
            console.log(e.target.files[0]);
        } else {
            this.setState({
                ...this.state,
                [e.target.name]: e.target.value
            })
        }
        console.log(e.target.name);
        console.log(this.state.action);
    }

    handleCategorySumbit = e => {
        e.preventDefault();
        this.handleInput(e);
        let formData = new FormData();
        formData.append("name", this.state.CategoryName);
        formData.append("action", e.target.value);
        formData.append("category", this.state.productCatid);
        formData.append("toChange", this.state.toChange);
        const url = "/admin/category.php";
        axios.post(url, formData, { xsrfCookieName: 'XSRF-TOKEN', xtxsrfHeaderName: 'X-XSRF-TOKEN' })
            .then(res => {
                if (res.data["status"] === "successful") {
                    alert(res.data["message"]);
                    this.fetchData();
                } else if (res.data["status"] === "failed") {
                    alert(res.data["message"]);
                }
                //window.location.reload()
            })
            .catch(err => console.log(err));
        //console.log(this.state.CategoryName)
    }

    handleProductSumbit = e => {
        e.preventDefault();
        this.handleInput(e);
        let formData = new FormData();
        formData.append("name", this.state.ProductName);
        formData.append("price", this.state.price);
        formData.append("description", this.state.description);
        formData.append("category", this.state.productCatid);
        formData.append("action", e.target.value);
        formData.append("pid", this.state.productId);
        formData.append("toChange", this.state.toChange);
        formData.append("image", this.state.image);
        const url = "/admin/product.php";
        axios.post(url, formData, { xsrfCookieName: 'XSRF-TOKEN', xtxsrfHeaderName: 'X-XSRF-TOKEN' })
            .then(res => {
                if (res.data["status"] === "successful") {
                    alert(res.data["message"]);
                    this.fetchData();
                } else if (res.data["status"] === "failed") {
                    alert(res.data["message"]);
                }
            })
            .catch(err => console.log(err));
        //console.log(this.state.CategoryName)
    }

    render() {
        if (fetch === true) {
            return (
                <div className="container">
                    <div className="py-5 text-center">
                        <h2>Admin Panel</h2>
                        <h6 className="text-danger">*items must be filled in</h6>
                    </div>
                    <div className="row">
                        <div className="col-md-6 order-md-1">
                            <h4 className="mb-3">New Product</h4>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="username">Category<span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <select className="custom-select" name="productCatid" onChange={this.handleInput}>
                                            <option value="default">Choose...</option>
                                            {this.state.catList.map((info, index) => {
                                                return <option value={info.catid}>{info.name}</option>
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="username">Name<span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" name="ProductName" placeholder="Name" required="" onChange={this.handleInput}></input>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="username">Price (at most 2 decimal place)<span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" name="price" placeholder="Price" required="" onChange={this.handleInput}></input>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="username">Description</label>
                                    <div className="input-group">
                                        <textarea className="form-control" name="description" rows="3" onChange={this.handleInput}></textarea>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="username">Image<span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Upload</span>
                                        </div>
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" name="image" onChange={this.handleInput}></input>
                                            {this.state.image == "" ? <label className="custom-file-label" htmlFor="image">Choose one</label> : <label className="custom-file-label" htmlFor="image">{this.state.image.name}</label>}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="username">Preview</label>
                                        {this.state.image != "" ? <img src={URL.createObjectURL(this.state.image)} alt="product" className="list-img"></img> : ""}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <button className="btn btn-dark" name="action" value="addProduct" onClick={this.handleProductSumbit}>Submit</button>
                                </div>
                            </form>
                        </div>

                        <div className="col-md-6 order-md-1">
                            <h4 className="mb-3">New Category</h4>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="username">Name<span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" id="CategoryName" placeholder="Name" required="" name="CategoryName" onChange={this.handleInput}></input>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <button className="btn btn-dark" name="action" value="addCat" onClick={this.handleCategorySumbit}>Submit</button>
                                </div>
                            </form>
                        </div>

                        <div className="col-md-6 order-md-1">
                            <h4 className="mb-3">Delete Product</h4>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="username">Choose one<span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <select className="custom-select" name="productId" onChange={this.handleInput}>
                                            <option value="default">Choose...</option>
                                            {this.state.productList.map((info, index) => {
                                                return <option value={info.pid}>{info.name}</option>
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <button className="btn btn-dark" name="action" value="deleteProduct" onClick={this.handleProductSumbit}>Submit</button>
                                </div>
                            </form>
                        </div>

                        <div className="col-md-6 order-md-1">
                            <h4 className="mb-3">Delete Category</h4>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="username">Choose one</label>
                                    <div className="input-group">
                                        <select className="custom-select" name="productCatid" onChange={this.handleInput}>
                                            <option value="default" >Choose...</option>
                                            {this.state.catList.map((info, index) => {
                                                return <option value={info.catid}>{info.name}</option>
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <button className="btn btn-dark" name="action" value="deleteCat" onClick={this.handleCategorySumbit}>Submit</button>
                                </div>
                            </form>
                        </div>

                        <div className="col-md-6 order-md-1">
                            <h4 className="mb-3">Update Product</h4>
                            <form>
                                <div className="mb-3">
                                    <p>Fill in all infomation or it will get empty.</p>
                                    <label htmlFor="username">Which one to change?<span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <select className="custom-select" name="toChange" onChange={this.handleInput}>
                                            <option value="default">Choose...</option>
                                            {this.state.productList.map((info, index) => {
                                                return <option value={info.pid}>{info.name}, ${info.price}, {info.description}</option>
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="username">Name<span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" name="ProductName" placeholder="Name" required="" onChange={this.handleInput}></input>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="username">Price (at most 2 decimal place)<span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" name="price" placeholder="Price" required="" onChange={this.handleInput}></input>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="username">Description</label>
                                    <div className="input-group">
                                        <textarea className="form-control" name="description" rows="3" onChange={this.handleInput}></textarea>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="username">Image<span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Upload</span>
                                        </div>
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" name="image" onChange={this.handleInput}></input>
                                            {this.state.image == "" ? <label className="custom-file-label" htmlFor="image"><span className="text-danger">*</span></label> : <label className="custom-file-label" htmlFor="image">{this.state.image.name}</label>}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="username">Preview</label>
                                        {this.state.image != "" ? <img src={URL.createObjectURL(this.state.image)} alt="product" className="list-img"></img> : ""}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <button className="btn btn-dark" name="action" value="updateProduct" onClick={this.handleProductSumbit}>Submit</button>
                                </div>
                            </form>
                        </div>

                        <div className="col-md-6 order-md-1">
                            <h4 className="mb-3">Update Category</h4>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="username">Choose one<span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <select className="custom-select" name="toChange" onChange={this.handleInput}>
                                            <option value="default">Choose...</option>
                                            {this.state.catList.map((info, index) => {
                                                return <option value={info.catid}>{info.name}</option>
                                            })}
                                        </select>
                                        <input type="text" className="form-control" name="CategoryName" placeholder="Name" required="" onChange={this.handleInput}></input>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <button className="btn btn-dark" name="action" value="updateCat" onClick={this.handleCategorySumbit}>Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <h4 className="mb-3">Order records</h4>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">username</th>
                                <th scope="col">invoice</th>
                                <th scope="col">custom</th>
                                <th scope="col">transcation ID</th>
                                <th scope="col">payment status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.orders}
                        </tbody>
                    </table>
                </div>
            );
        } else {
            return (
                <div className="container">
                    <div className="py-5 text-center">
                        Please wait or you are not authorized.
                    </div>
                </div>
            );
        }
    }
}
