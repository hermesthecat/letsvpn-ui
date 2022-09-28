import React from "react";
import ProtectedRoute from "components/ProtectedRoute";
import PageWGServers from "./pages/PageWGServers";
import {PageWGServerDetails} from "./pages/PageWGServerDetails";


const WGServerRoutes = (
    <>
        <ProtectedRoute path='/servers' exact><PageWGServers/></ProtectedRoute>
        <ProtectedRoute path='/servers/:id'><PageWGServerDetails/></ProtectedRoute>
    </>
)

export default WGServerRoutes;


