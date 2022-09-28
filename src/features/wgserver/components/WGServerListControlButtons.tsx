import React, {useEffect, useState} from 'react';
import FullPageLayout from "components/FullPageLayout";
import {Box, Button, Fade, styled, Typography} from "@mui/material";
import WGServerBlock from "../components/WGServerBlock";
import {WGServer} from "app/types";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {useGetAllServersQuery, wireguardApi} from "../../auth/apiSlice";
import WGServerBlockSkeleton from "../components/WGServerBlockSkeleton";
import ErrorIcon from "@mui/icons-material/Error";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {WGServerSocketStatus} from "../components/WGServerSocketStatus";
import useWebSocket from "react-use-websocket";
import {RefreshServersButton} from "../components/RefreshServersButton";


const PREFIX = 'PageWGServers';
const classes = {
    root: `${PREFIX}-root`,
};

const StyledDiv = styled('div')(({theme}: any) => ({
    [`& .${classes.root}`]: {
        display: 'flex',
        alignItems: 'middle',
    },
}));

export function WGServerListControlButtons() {
    const [refreshAllServers,] = wireguardApi.endpoints.refreshAllServers.useLazyQuerySubscription()

    const handleRefreshServers = () => {
        if (readyState === 1) {
            // @ts-ignore
            refreshAllServers()
        }
    }

    const { readyState } = useWebSocket(`ws://${window.location.hostname}:8001/ws/wg/servers/`, {share: true});

    useEffect(handleRefreshServers, [readyState])


    return (
        <StyledDiv>
            <a href={'/django/admin/letsvpn/wireguardserver/add/'} target={'_BLANK'}>
                <Button variant={'contained'} startIcon={<AddCircleIcon/>} sx={{m:1}}>New Server <OpenInNewIcon sx={{transform: 'scale(0.7)'}}/></Button>
            </a>

            <RefreshServersButton/>
        </StyledDiv>
    );

}
