import list_title from '../assets/images/list-title.jpg';
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import BreadCrumb from './partials/breadcrumb';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Product } from '../pages'
import EventEmitter from './tools/event_emitter'
import AddToCartButon from './partials/addto_cart_button'

//main page
function ProductPage() {
    return (
        <Switch>
            <Route path="/:cat" exact component={Item} />
            <Route path="/:cat/:id" component={Product} />
        </Switch>
    );
}
export default ProductPage;

function Item(props) {
    const [list, setList] = useState([]);
    const items = [];
    //const [catList, setCatList] = useState([]);
    const { url } = useRouteMatch();
    var type = url.substring(1);
    /*const para = useParams().cat;
    var inside = false;*/

    useEffect(() => {
        const url = "/admin/product.php";
        axios.get(url, { params: { catName: type } })
            .then(res => {
                //console.log(res.data);
                setList(res.data);
            })
            .catch(error => console.log(error));
        //console.log(list);
        /*axios.get("/admin/category.php")
            .then(res => {
                setCatList(res.data);
            })
            .catch(error => console.log(error));
        if (catList.includes(para)) inside = true;*/
    }, [url])

    {
        list.map((info, index) => {
            items.push(
                <div className="product col-md-4">
                    <div className="card mb-5 border-0">
                        <Link to={`${url}/${list[index].pid}`}>
                            <img src={`data:image/png;base64,${list[index].image}`} alt="Shoe" className="card-img-top list-img"></img>
                        </Link>
                        <hr className="mb-0" />
                        <div className="card-body pt-1">
                            <div className="card-text text-center">
                                <Link to={`${url}/${list[index].pid}`}>{info.name}</Link>
                                <p className="m-0">Price ${info.price}</p>
                                <AddToCartButon pid={info.pid} />
                            </div>
                        </div>
                    </div>
                </div>
            );
            return items;
        })
    }//production

    /*{
        items.push(
            <div className="product col-md-4">
                <div className="card mb-5 border-0">
                    <Link to="">
                        <img src="" alt="Shoe" className="card-img-top list-img"></img>
                    </Link>
                    <hr className="mb-0" />
                    <div className="card-body pt-1">
                        <div className="card-text text-center">
                            <Link to="">dsdsds</Link>
                            <p className="m-0">Price $23232323</p>
                            <AddToCartButon list={list} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }///testing*/

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
        <div className="container">
            {items.length > 0 ?
                [
                    <BreadCrumb locationPathname={props.location.pathname} onMatchedRoutes={onMatchedRoutes} />,
                    <div className="list-title">
                        <img src={list_title} alt="list-title"></img>
                    </div>,
                    <div className="row">
                        {items}
                    </div>,
                ]
                : <h1 className="text-center">.......</h1>}

        </div>
    )
}
