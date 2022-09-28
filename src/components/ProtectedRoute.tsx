import React from 'react';
import {Redirect, Route, useHistory, useLocation} from "react-router-dom";
import {connect} from "react-redux";


function ProtectedRoute(props: any) {
    const { isAuthenticated, path } = props;
    const history = useHistory();
    const location = useLocation();

    const { children, ...otherProps } = props;

    if (!isAuthenticated) {
        // Adds path that would've gone to history so that it redirects to that once you login.
        history.push(location.pathname);
        return (<Redirect to={'/login'} from={location.pathname}/>);
    }

    return (
        <Route {...otherProps}>{children}</Route>
    );
}

const mapStateToProps = (state: any) => ({
    isAuthenticated: state.auth.isAuthenticated,
})

const mapDispatchToProps = {

}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProtectedRoute)
