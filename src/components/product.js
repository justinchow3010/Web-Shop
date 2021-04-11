import React, { useState, useEffect } from 'react';
import BreadCrumb from './partials/breadcrumb';
import axios from 'axios';
import { useParams } from "react-router-dom";
import AddToCartButon from './partials/addto_cart_button'

//product page
export default function Product(props) {
    const [list, setList] = useState([]);
    var { id } = useParams();
    const link = props.location.pathname.slice(1).split("/");

    useEffect(() => {
        const url = "/admin/product.php";
        axios.get(url, { params: { pid: id } })
            .then(res => {
                setList(res.data);
            })
            .catch(error => console.log(error));
    }, [])

    const onMatchedRoutes = (matchedRoutes) => {
        return [
            ...matchedRoutes.slice(0, 1),
            {
                route: {
                    path: `/${link[0]}`,
                    breadcrumbName: link[0]
                }
            },
            {
                route: {
                    path: `/${link[0]}/${link[1]}`,
                    breadcrumbName: link[1]
                }
            }
        ];
    };

    return (
        <div className="container">
            {
                list.length > 0
                    ? <div>
                        <BreadCrumb locationPathname={props.location.pathname} onMatchedRoutes={onMatchedRoutes} />
                        {list.map((info, index) => {
                            return <div className="product-info d-flex">
                                <img src={`data:image/png;base64,${info.image}`} alt="Shoe" className="content-img"></img>
                                <div className="ml-4">
                                    <h2>{info.name}</h2>
                                    <p>Price: ${info.price}</p>
                                    <AddToCartButon pid={id} />
                                    <div>Description: <p>{info.description}</p> </div>
                                </div>
                            </div>
                        })}
                    </div>
                    : <h1 className="text-center mt-5 mb-5">......</h1>
            }
        </div>
    )
}
