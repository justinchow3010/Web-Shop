import React from 'react';
import axios from 'axios';

//admin page
export default class Admin extends React.Component {
    constructor() {
        super();
        this.state = {
            CategoryName : "",
            ProductName : "",
            price : 0,
            description : "",
            list : [],
            productCatid : 0,
            //image : ""
        };
    }
    
    componentDidMount() {
        const url = "/admin/category.php";
        axios.get(url)
        .then ( res=> {console.log(res.data);
             this.setState({list : res.data});
        })
        .catch (error => console.log(error));
        console.log(this.state.list);
    }

    handleInput = async e => {
        await this.setState({
            ...this.state,
            [e.target.name] : e.target.value
        })
        console.log(e.target.name);
        console.log(e.target.value);
    }

    handleCategorySumbit = e => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("name", this.state.CategoryName);
        const url = "/admin/category.php";
        axios.post(url, formData)
        .then (res=> console.log(res.data))
        .catch (err => console.log(err));
        console.log(this.state.CategoryName)
    }

    handleProductSumbit = e => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("name", this.state.ProductName);
        formData.append("price", this.state.price);
        formData.append("description", this.state.description);
        formData.append("category", this.state.productCatid);
        //formData.append("image", this.state.image);
        const url = "/admin/product.php";
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
                                    <select className="custom-select" name="productCatid" onChange={this.handleInput}>
                                        <option value>Choose...</option>
                                        {this.state.list.map((info, index) => {
                                            return <option value={info.catid}>{info.name}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="username">Name*</label>
                                <div className="input-group">
                                    <input type="text" className="form-control" name="ProductName" placeholder="Name" required="" onChange={this.handleInput}></input>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="username">Price*</label>
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
                                <label htmlFor="username">Image*</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Upload</span>
                                    </div>
                                    <div className="custom-file">
                                        <input type="file" className="custom-file-input" name="image"></input>
                                        <label className="custom-file-label" htmlFor="image">Choose one</label>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <button className="btn btn-dark" onClick={this.handleProductSumbit}>Submit</button>
                            </div>
                        </form>
                    </div>

                    <div className="col-md-6 order-md-1">
                        <h4 className="mb-3">New Category</h4>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="username">Name*</label>
                                <div className="input-group">
                                    <input type="text" className="form-control" id="CategoryName" placeholder="Name" required="" name="CategoryName" onChange={this.handleInput}></input>
                                </div>
                            </div>
                            <div className="mb-3">
                                <button className="btn btn-dark" onClick={this.handleCategorySumbit}>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
