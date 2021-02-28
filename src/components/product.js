import React, { useState, useEffect } from 'react';
import shoe_pic from '../assets/images/shoe.png';
import BreadCrumb from './partials/breadcrumb';
import axios from 'axios';
import { useParams } from "react-router-dom";

//product page
export default function Product(props) {
    const [list, setList] = useState([]);
    //const [catList, setCatList] = useState([]);
    let { id } = useParams();

    //console.log(id);
    useEffect(() => {
        const url = "/admin/product.php";
        axios.get(url, { params: { pid: id } })
            .then(res => {
                //console.log(res.data);
                setList(res.data);
            })
            .catch(error => console.log(error));

        /*axios.get("/admin/category.php", { params: { catid : list.catid } })
            .then(res => {
                //console.log(res.data);
                setCatList(res.data);
            })
            .catch(error => console.log(error));*/
    }, [])

    /*const onMatchedRoutes = (matchedRoutes) => {
        return [
            ...matchedRoutes.slice(0, 1),
            {
                route: {
                    path: "/",
                    breadcrumbName: Product
                }
            },
            {
                route: {
                    path: "/",
                    breadcrumbName: id
                }
            }
        ];
    };*/

    return (
        <div className="mt-3 container">
            <BreadCrumb locationPathname={props.location.pathname} />
            {list.map((info) => {
                return <div className="product-info d-flex">
                    <img src={`data:image/png;base64,${info.image}`} alt="Shoe" className="content-img"></img>
                    <div className="ml-4">
                        <h2>{info.name}</h2>
                        <p>Price: ${info.price}</p>
                        <button className="btn btn-primary add">Add to cart</button>
                        <div>Description: <p>{info.description}</p> </div>
                    </div>
                </div>
            })}
        </div>
    )
}
