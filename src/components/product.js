import React from 'react';
import shoe_pic from '../assets/images/shoe.png';
import BreadCrumb from './partials/breadcrumb';

//product page
export default function product(props) {
    
    return (
        <div className="mt-3 container">
            <BreadCrumb locationPathname={props.location.pathname} />

            <div className="product-info d-flex">
                <img src={shoe_pic} alt="Shoe" className="content-img"></img>
                <div className="ml-4">
                    <h2>Black Shoes</h2>
                    <p>Price: $200</p>
                    <button className="btn btn-primary add">Add to cart</button>
                    <div>Description: <p>Set Your Feet Free</p> </div>
                </div>
            </div>
        </div>
    )
}
