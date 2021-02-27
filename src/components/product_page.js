import list_title from '../assets/images/list-title.jpg';
import shoe_pic from '../assets/images/shoe.png';
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import BreadCrumb from './partials/breadcrumb';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Product } from '../pages'
import { renderRoutes } from 'react-router-config';
import { useParams } from "react-router-dom";

//main page
function ProductPage() {
    return (
        <Switch>
            <Route path="/:cat" exact component={Item}/>
            <Route path="/:cat/:id" component={Product} />
        </Switch>
    );
}
export default ProductPage;

function Item(props) {
    const [list, setList] = useState([]);
    const items = [];
    const { url, path } = useRouteMatch();

    var type = url.substring(1);
    
    useEffect(() => {
        const url = "/admin/product.php";
        axios.get(url, { params: { catName: type } })
            .then(res => {
                console.log(res.data);
                setList(res.data);
            })
            .catch(error => console.log(error));
        console.log(list);
    }, [url])

    {
        list.map((info, index) => {
            items.push(
                <div className="product col-md-4">
                    <div className="card mb-5 border-0">
                        <Link to={`${url}/${list[index].pid}`}>
                            <img src={shoe_pic} alt="Shoe" className="card-img-top"></img>
                        </Link>
                        <hr className="mb-0" />
                        <div className="card-body pt-1">
                            <div className="card-text text-center">
                                <Link to={`${url}/${list.pid}`}>{info.name}</Link>
                                <p className="m-0">Price ${info.price}</p>
                                <button className="btn btn-primary add">Add to cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
            return items;
        })
    }
    const onMatchedRoutes = (matchedRoutes) => {
        return [
            ...matchedRoutes.slice(0, -1),
            {
                route: {
                    path: `/${type}`,
                    breadcrumbName: type
                }
            }
        ];
    };

    return (
        <div className="mt-3 container">
            <BreadCrumb locationPathname={props.location.pathname} onMatchedRoutes={onMatchedRoutes} />
            <div className="list-title">
                <img src={list_title} alt="list-title"></img>
            </div>
            <div className="row">
                {items}
            </div>
        </div>
    )
}