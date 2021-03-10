import React from 'react'
import EventEmitter from '../tools/event_emitter'

export default function CartButton(props) {
    function addToCart(pid, num) {
        var items = [];
        var json = localStorage.getItem("cart");
        var check = false;
        if (json !== null) {
            JSON.parse(json).map((data, i) => {
                if (data.pid === pid) {
                    var num = parseInt(data.quan, 10);
                    num += 1;
                    data.quan = num;
                    check = true;
                }
                items.push(data);
            })
        }
        if (check === false) items.push({ "pid": pid, "quan": num });
        localStorage.setItem('cart', JSON.stringify(items));
        //emit event
        EventEmitter.emit("updateCart", {
            items: items
        })
    }

    return(
        <button className="btn btn-primary add" onClick={() => addToCart(props.pid, 1)}>Add to cart</button>
    )
}