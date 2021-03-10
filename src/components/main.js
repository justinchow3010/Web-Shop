import React from 'react';
import BreadCrumb from './partials/breadcrumb';

//product page
export default function Main(props) {

    return (
        <div className="container">
            <BreadCrumb locationPathname={props.location.pathname} />
            <div className="p-4 p-md-5 mb-4 text-white bg-dark">
                <div className="col-md-6 px-0">
                    <h1 className="display-3 fst-italic">Welcome</h1>
                    <p className="lead my-3">This is my first web.</p>
                </div>
            </div>
        </div>
    )
}
