import React from 'react';
import BreadCrumb from './partials/breadcrumb';

//product page
export default function Main(props) {
    
    return (
        <div className="mt-3 container">
            <BreadCrumb locationPathname={props.location.pathname} />
            <h1 className="display-2 text-center">Welcome!</h1>
        </div>
    )
}
