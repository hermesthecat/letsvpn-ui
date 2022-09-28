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
import {WGServerListControlButtons} from "../components/WGServerListControlButtons";


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

export default function PageWGServers(props: any) {
    // @ts-ignore
    const { data: servers, error, refetch, isFetching } = useGetAllServersQuery();

    const [connected, setConnected] = useState<boolean>(false);


    const [refreshAllServers,] = wireguardApi.endpoints.refreshAllServers.useLazyQuerySubscription()

    const handleRefreshServers = () => {
        if (readyState === 1 && !connected) {
            // @ts-ignore
            refreshAllServers();
            setConnected(true);
        }
    }

    const { readyState } = useWebSocket(`ws://${window.location.hostname}:8001/ws/wg/servers/`, {
        share: true,
    });

    useEffect(handleRefreshServers, [readyState])


    return (
        <StyledFullPageLayout title={'Servers'} header={'WireGuard Servers'} className={classes.testcss}>

            <Fade in={isFetching === true} unmountOnExit>
                <Box className={classes.loadingBox}>{[...Array(3)].map((n, i) => <WGServerBlockSkeleton key={i}/>)}</Box>
            </Fade>


            <Fade in={(!isFetching && error !== undefined) as boolean} unmountOnExit>
                <Box sx={{minHeight: 200, textAlign: 'center', pt: 4}}>
                    <ErrorIcon sx={{width: 50, height: 50, color: 'error.dark', opacity: 0.7}}/>
                    <Typography variant={'h6'} sx={{color: 'error.dark', opacity: 0.7}}>Encountered an error fetching your WireGuard servers.</Typography>
                    <Button color={'primary'} sx={{mt: 2}} startIcon={<RefreshIcon/>} onClick={() => refetch()} variant={'contained'}>Refresh</Button>
                </Box>
            </Fade>


            <Fade in={!isFetching && error === undefined && servers?.length === 0} unmountOnExit>
                <Box sx={{minHeight: 200, textAlign: 'center', pt: 4}}>
                    <ErrorIcon sx={{width: 50, height: 50, color: 'error.dark', opacity: 0.7}}/>
                    <Typography variant={'h6'} sx={{color: 'error.dark', opacity: 0.7}}>No WireGuard interfaces found.</Typography>
                </Box>
            </Fade>


            <Fade in={!isFetching && error === undefined && servers?.length > 0}>
                <Box>
                    <WGServerListControlButtons/>

                    {servers?.map((s: WGServer) => <WGServerBlock server={s} key={s.id}/>)}
                </Box>
            </Fade>

            <WGServerSocketStatus/>
        </StyledFullPageLayout>
    );

}
