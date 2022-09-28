import React, {useEffect, useState} from 'react';
import FullPageLayout from "components/FullPageLayout";
import {Box, Button, Divider, Fade, Grid, IconButton, Paper, styled, Typography} from "@mui/material";
import WGServerBlock from "../components/WGServerBlock";
import {WGServer} from "app/types";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {useGetAllServersQuery, useGetServerByIDQuery, wireguardApi} from "../../auth/apiSlice";
import WGServerBlockSkeleton from "../components/WGServerBlockSkeleton";
import ErrorIcon from "@mui/icons-material/Error";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {WGServerSocketStatus} from "../components/WGServerSocketStatus";
import useWebSocket from "react-use-websocket";
import {RefreshServersButton} from "../components/RefreshServersButton";
import {WGServerListControlButtons} from "../components/WGServerListControlButtons";
import {useParams} from "react-router";
import {CollapsiblePaper} from "../components/CollapsiblePaper";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import WGServerBlockInfo from "../components/WGServerBlockInfo";
import {SplitTypography} from "../../../components/SplitTypography";


const PREFIX = 'PageWGServerDetails';
const classes = {
    errorBox: `${PREFIX}-errorBox`,
    loadingBox: `${PREFIX}-loadingBox`,
    sectionPaper: `${PREFIX}-sectionPaper`,
    darkDivider: `${PREFIX}-darkDivider`,
    fieldValue: `${PREFIX}-fieldValue`,
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
    [`& .${classes.sectionPaper}`]: {
        margin: theme.spacing(2, 0),
        padding: theme.spacing(2),
    },
    [`& .${classes.darkDivider}`]: {
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    [`& .${classes.fieldValue}`]: {
        fontFamily: 'monospace',
        fontSize: '11pt',
    },
}));

export function PageWGServerDetails() {
    // TODO: Get Server ID from URL
    let { id: serverID } = useParams<any>();

    // @ts-ignore
    const { data: server, error, refetch, isFetching } = useGetServerByIDQuery(serverID);

    const [connected, setConnected] = useState<boolean>(false);

    const { readyState } = useWebSocket(`ws://${window.location.hostname}:8001/ws/wg/servers/`, {
        share: true,
    });

    const [refreshServer,] = wireguardApi.endpoints.getServerStatus.useLazyQuerySubscription()

    const handleRefresh = () => {
        if (readyState === 1 && !connected) {
            // @ts-ignore
            refreshServer(serverID);
            setConnected(true);
        }
    }

    useEffect(handleRefresh, [readyState])

    return (
        <StyledFullPageLayout
            title={!isFetching && !error ? server.name : 'Details'}
            header={!isFetching && !error ? `Interface: ${server.name}` : 'Interface Details'}
        >

            <Fade in={isFetching === true} unmountOnExit>
                <Box className={classes.loadingBox}>{[...Array(3)].map((n, i) => <WGServerBlockSkeleton key={i}/>)}</Box>
            </Fade>


            <Fade in={!isFetching && error !== undefined && !server.id} unmountOnExit>
                <Box sx={{minHeight: 200, textAlign: 'center', pt: 4}}>
                    <ErrorIcon sx={{width: 50, height: 50, color: 'error.dark', opacity: 0.7}}/>
                    <Typography variant={'h6'} sx={{color: 'error.dark', opacity: 0.7}}>Encountered an error fetching your WireGuard servers.</Typography>
                    <Button color={'primary'} sx={{mt: 2}} startIcon={<RefreshIcon/>} onClick={() => refetch()} variant={'contained'}>Refresh</Button>
                </Box>
            </Fade>

            {!isFetching && error === undefined && server !== undefined &&
            <Fade in={!isFetching}>
                <Box>

                    <Paper elevation={6} sx={{p: 2, pt: 1}}>
                        <SplitTypography title={'Utilities'} sx={{mb: 1}}>
                            <WGServerBlockInfo serverID={serverID} />
                        </SplitTypography>

                        <Button variant={'contained'} sx={{mr: 1}}>Generate config</Button>
                        <Button variant={'contained'} sx={{mr: 1}}>Generate peers</Button>
                    </Paper>

                    <CollapsiblePaper title={'IPv4 Settings'}>
                        <Grid container spacing={0}>
                            <Grid item md={5}>
                                <Typography variant={'h5'}>Enabled</Typography>
                                <Divider className={classes.darkDivider} />
                                <Typography className={classes.fieldValue}>{server.enabled ? 'Yes' : 'No'}</Typography>
                            </Grid>
                            <Grid item md={5}>
                                <Typography variant={'h5'}>Default</Typography>
                                <Divider className={classes.darkDivider} />
                                <Typography className={classes.fieldValue}>{server.default ? 'Yes' : 'No'}</Typography>
                            </Grid>
                            <Grid item md={2}>
                                <Typography variant={'h5'}>Port</Typography>
                                <Divider className={classes.darkDivider} />
                                <Typography className={classes.fieldValue}>{server.port}</Typography>
                            </Grid>

                            <Grid item xs={12} sx={{height: 1, width: '100%', mb: 2}}></Grid>

                            <Grid item md={6}>
                                <Typography variant={'h5'}>Public Key</Typography>
                                <Divider className={classes.darkDivider} />
                                <Typography className={classes.fieldValue}>{server.public_key}</Typography>
                            </Grid>
                            <Grid item md={6}>
                                <Typography variant={'h5'}>Private Key</Typography>
                                <Divider className={classes.darkDivider} />
                                <Typography className={classes.fieldValue}>{server.private_key}</Typography>
                            </Grid>
                        </Grid>
                    </CollapsiblePaper>


                    <CollapsiblePaper title={'IPv6 Settings'}>
                        <Grid container spacing={0}>
                            <Grid item md={5}>
                                <Typography variant={'h5'}>External IP</Typography>
                                <Divider className={classes.darkDivider} />
                                <Typography className={classes.fieldValue}>{server.wan6}</Typography>
                            </Grid>
                            <Grid item md={5}>
                                <Typography variant={'h5'}>Tunnel IP</Typography>
                                <Divider className={classes.darkDivider} />
                                <Typography className={classes.fieldValue}>{server.address6}</Typography>
                            </Grid>
                            <Grid item md={2}>
                                <Typography variant={'h5'}>Subnet</Typography>
                                <Divider className={classes.darkDivider} />
                                <Typography className={classes.fieldValue}>{server.subnet6}</Typography>
                            </Grid>
                        </Grid>
                    </CollapsiblePaper>


                    <CollapsiblePaper title={'General Settings'}>
                        <Grid container spacing={0}>
                            <Grid item md={5}>
                                <Typography variant={'h5'}>Enabled</Typography>
                                <Divider className={classes.darkDivider} />
                                <Typography className={classes.fieldValue}>{server.enabled ? 'Yes' : 'No'}</Typography>
                            </Grid>
                            <Grid item md={5}>
                                <Typography variant={'h5'}>Default</Typography>
                                <Divider className={classes.darkDivider} />
                                <Typography className={classes.fieldValue}>{server.default ? 'Yes' : 'No'}</Typography>
                            </Grid>
                            <Grid item md={2}>
                                <Typography variant={'h5'}>Port</Typography>
                                <Divider className={classes.darkDivider} />
                                <Typography className={classes.fieldValue}>{server.port}</Typography>
                            </Grid>

                            <Grid item xs={12} sx={{height: 1, width: '100%', mb: 2}}></Grid>

                            <Grid item md={6}>
                                <Typography variant={'h5'}>Public Key</Typography>
                                <Divider className={classes.darkDivider} />
                                <Typography className={classes.fieldValue}>{server.public_key}</Typography>
                            </Grid>
                            <Grid item md={6}>
                                <Typography variant={'h5'}>Private Key</Typography>
                                <Divider className={classes.darkDivider} />
                                <Typography className={classes.fieldValue}>{server.private_key}</Typography>
                            </Grid>
                        </Grid>
                    </CollapsiblePaper>


                    <CollapsiblePaper title={'Peers'}>Peers go here</CollapsiblePaper>

                </Box>
            </Fade>}

            <WGServerSocketStatus/>
        </StyledFullPageLayout>
    );

}
