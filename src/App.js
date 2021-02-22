import './sass/App.scss';

import Layout from './components/layout/layout'
// eslint-disable-next-line
import { renderRoutes, matchRoutes } from 'react-router-config';
import routes from './route';

import {
    BrowserRouter as Router,
} from "react-router-dom";

function App() {

    return (
        <Router>
            <Layout>
                {renderRoutes(routes)}
            </Layout>
        </Router>
    );
}

export default App;
