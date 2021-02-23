import React from 'react';
import axios from 'axios';

//admin page
export default class Admin extends React.Component {
    constructor() {
        super();
        this.state = {
            CategoryName : ""
        };
    }
    
    handleInput = async e => {
        await this.setState({
            CategoryName : e.target.value
        })
        //console.log(this.state.CategoryName)
    }

    handleSumbit = e => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("name", this.state.CategoryName);
        const url = "../backend/admin.php";
        axios.post(url, formData)
        .then (res=> console.log(res.data))
        .catch (err => console.log(err));
        console.log(this.state.CategoryName)
    }

    render() {
        return (
            <div className="container">
                <div className="py-5 text-center">
                    <h2>Admin Panel</h2>
                </div>
                <div className="row">
                    <div className="col-md-6 order-md-1">
                        <h4 className="mb-3">New Product</h4>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="username">Category*</label>
                                <div className="input-group">
                                    <select className="custom-select" id="inputGroupSelect01">
                                        <option value>Choose...</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="username">Name*</label>
                                <div className="input-group">
                                    <input type="text" className="form-control" id="ProductName" placeholder="Name" required=""></input>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="username">Price*</label>
                                <div className="input-group">
                                    <input type="text" className="form-control" id="Price" placeholder="Price" required=""></input>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="username">Description</label>
                                <div className="input-group">
                                    <textarea className="form-control" id="" rows="3"></textarea>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="username">Image*</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Upload</span>
                                    </div>
                                    <div className="custom-file">
                                        <input type="file" className="custom-file-input" id="inputGroupFile01"></input>
                                        <label className="custom-file-label" htmlFor="inputGroupFile01">Choose file</label>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <button className="btn btn-dark">Submit</button>
                            </div>
                        </form>
                    </div>

                    <div className="col-md-6 order-md-1">
                        <h4 className="mb-3">New Category</h4>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="username">Name*</label>
                                <div className="input-group">
                                    <input type="text" className="form-control" id="CategoryName" placeholder="Name" required="" onChange={this.handleInput}></input>
                                </div>
                            </div>
                            <div className="mb-3">
                                <button className="btn btn-dark" onClick={this.handleSumbit}>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
