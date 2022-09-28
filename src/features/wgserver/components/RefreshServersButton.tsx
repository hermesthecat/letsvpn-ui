import React, {useEffect, useState} from 'react';
import FullPageLayout from "components/FullPageLayout";
import {Box, Button, CircularProgress, Fade, styled, Typography} from "@mui/material";
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


const PREFIX = 'PageWGServers';
const classes = {
    errorBox: `${PREFIX}-errorBox`,
    loadingBox: `${PREFIX}-loadingBox`,
    testcss: `${PREFIX}-testcss`,
};

const StyledFullPageLayout = styled(FullPageLayout)(({theme}: any) => ({
    [`& .${classes.errorBox}`]: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'middle',
    },
    [`& .${classes.loadingBox}`]: {
        //display: 'flex',
        justifyContent: 'center',
        alignItems: 'middle',
    },
    [`& .${classes.testcss}`]: {
        backgroundColor: 'rgba(255,0,0,0.5) !important',
    },
}));

export function RefreshServersButton(props: any) {
    const [refreshAllServers,] = wireguardApi.endpoints.refreshAllServers.useLazyQuerySubscription()

    const [updating, setUpdating] = useState<boolean>(false);

    const handleRefreshServers = () => {
        if (readyState === 1) {
            setUpdating(true);
            // @ts-ignore
            refreshAllServers()
        }
    }

    const handleMessage = (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        if (data.type === 'wg.server.status.all') {
            setUpdating(false)
        }
    }

    const { readyState } = useWebSocket(`ws://${window.location.hostname}:8001/ws/wg/servers/`, {
        share: true,
        onMessage: handleMessage,
    });

    useEffect(handleRefreshServers, [readyState])


    return (
        <Button
            color={'primary'}
            startIcon={updating ? <CircularProgress  size={20} color={'inherit'}/> : <RefreshIcon/>}
            onClick={handleRefreshServers}
            variant={'contained'}
            disabled={updating}
        >
            Refresh All
        </Button>
    );

}
