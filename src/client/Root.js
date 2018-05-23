import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {Home, Register, Login, Articles, Write, ProfileManage, Article} from '../pages';
import {Provider} from 'react-redux';
import PropTypes from 'prop-types';
import { PersistGate } from 'redux-persist/integration/react'

const Root = ({store, persistor}) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <div>
                        <Route exact path="/" component={Home}/>
                        <Route path="/register" component={Register}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/articles" component={Articles}/>
                        <Route path="/write" component={Write}/>
                        <Route path="/article/:articleId" component={Article}/>
                        <Route path="/manage" component={ProfileManage}/>
                    </div>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    );
}

Root.propTypes = {
    store: PropTypes.object.isRequired
}

export default Root;