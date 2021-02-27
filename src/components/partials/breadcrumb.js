import React from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { BreadcrumbItem } from 'react-bootstrap';
import routes from '../../route';
// eslint-disable-next-line
import { renderRoutes, matchRoutes } from 'react-router-config';

export default function breadCrumb(props) {
    let matchedRoutes = matchRoutes(routes, props.locationPathname);
    if (props.locationPathname !== '/') {
        matchedRoutes = [
            {
                route: {
                    path: '/',
                    breadcrumbName: 'Home'
                }
            },
            ...matchedRoutes
        ];
    }

    if (typeof props.onMatchedRoutes === 'function') {
        matchedRoutes = props.onMatchedRoutes(matchedRoutes);
    }
    
    console.log(matchedRoutes);
    return (
        <Breadcrumb className="mb-20">
            {matchedRoutes.map((matchRoute, i) => {
                const { path, breadcrumbName } = matchRoute.route;
                const isActive = path === props.locationPathname;
                console.log(props.locationPathname);
                console.log(path);
                return isActive ? (
                    <BreadcrumbItem active key={i} >{breadcrumbName}</BreadcrumbItem>
                ) : (
                        <BreadcrumbItem href={path} key={i}>{breadcrumbName}</BreadcrumbItem>
                    );
            })}
        </Breadcrumb>
    )
}

