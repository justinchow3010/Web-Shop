import list_title from '../assets/images/list-title.jpg';
import shoe_pic from '../assets/images/shoe.png';
import { Link } from "react-router-dom";
import BreadCrumb from './partials/breadcrumb';

//main page
function Main(props) {
    const number = 12;
    const items = [];

    for (var i = 0; i < number; i++) {
        items.push(
            <div className="product col-md-4" key={i}>
                <div className="card mb-5 border-0">
                    <Link to="/product">
                        <img src={shoe_pic} alt="Shoe" className="card-img-top"></img>
                    </Link>
                    <hr className="mb-0"/>
                    <div className="card-body pt-1">
                        <div className="card-text text-center">
                            <Link to="product">Shoe</Link>
                            <p className="m-0">Price $200</p>
                            <button className="btn btn-primary add">Add to cart</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-3 container">
            <BreadCrumb locationPathname={props.location.pathname} />
            <div className="list-title">
                <img src={list_title} alt="list-title"></img>
            </div>
            <div className="row">
                {items}
            </div>
        </div>
    );
}

export default Main;
