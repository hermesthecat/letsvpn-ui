import React, {useEffect, useState} from 'react';
import {Box, SpeedDial, SpeedDialAction, styled, Tooltip} from '@mui/material';
import isPropValid from '@emotion/is-prop-valid';
import LensBlurIcon from '@mui/icons-material/LensBlur';
import SettingsPowerIcon from '@mui/icons-material/SettingsPower';
import clsx from 'clsx';
import {getRandomInt, sleep} from "../../../lib/common";
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {useGetAllServersQuery, useGetServerStatusQuery, useStopServerQuery, useStartServerQuery, useRestartServerQuery, wireguardApi} from "features/auth/apiSlice";
import useWebSocket from "react-use-websocket";
import {SERVER_STATUS} from "../../../lib/enums";

const PREFIX = 'WGServerStatusIcon';
const classes = {
    root: `${PREFIX}-root`,
    sanim: `${PREFIX}-sanim`,
    statusIcon: `${PREFIX}-statusIcon`,
    disabled: `${PREFIX}-disabled`,
    stopped: `${PREFIX}-stopped`,
    running: `${PREFIX}-running`,
    loading: `${PREFIX}-loading`,
    starting: `${PREFIX}-starting`,
    stopping: `${PREFIX}-stopping`,
    active: `${PREFIX}-active`,
    loadingOverlay: `${PREFIX}-loadingOverlay`,
    loadingOverlay2: `${PREFIX}-loadingOverlay2`,
    stoppedOverlay: `${PREFIX}-stoppedOverlay`,
    stoppedOverlay2: `${PREFIX}-stoppedOverlay2`,
    stoppedOverlay3: `${PREFIX}-stoppedOverlay3`,
    runningOverlay: `${PREFIX}-runningOverlay`,
    runningOverlay2: `${PREFIX}-runningOverlay2`,
    runningOverlay3: `${PREFIX}-runningOverlay3`,
};

const StyledWGServerStatusIcon = styled(Box, {
    shouldForwardProp: prop => isPropValid(prop) && prop !== 'status'
})(({ status, theme }: any) => ({
    [`&.${classes.root}`]: {
        display: 'flex',
        alignItems: 'center',
    },
    [`& .${classes.sanim}`]: {
        animation: 'myAnim 2s ease 0s 1 normal forwards',
    },
    [`& .${classes.statusIcon}`]: {
        position: 'absolute',
        top: 20,
        left: 20,
        marginLeft: -10,
        marginTop: -10  ,
        visibility: 'hidden',
        '@media (prefers-reduced-motion)': {
            animation: 'none !important',
        }
    },
    [`& .${classes.disabled}`]: {
        color: 'black',
        filter: `drop-shadow(0 0 5px black)`,
    },
    [`& .${classes.stopped}`]: {
        color: theme.palette.error.main,
        filter: `drop-shadow(0 0 5px ${theme.palette.warning.main})`,
    },
    [`& .${classes.running}`]: {
        color: theme.palette.success.light,
        filter: `drop-shadow(0 0 5px ${theme.palette.warning.light})`,
    },
    // starting, stopping
    [`& .${classes.loading}`]: {
        color: theme.palette.warning.light,
        filter: `drop-shadow(0 0 5px ${theme.palette.warning.light})`,
    },
    [`& .${classes.active}`]: {
        visibility: 'visible',
        //animation: `statusIconEntrance 200 0ms linear forwards 1`,
    },
    [`& .${classes.stoppedOverlay}`]: {
        filter: `drop-shadow(0 0 5px ${theme.palette.error.main})`,
        animation: status === SERVER_STATUS.STOPPED ? `stoppedOverlayEntrance1 2000ms 0ms ${theme.transitions.easing.easeOut} forwards 1` : '',
    },
    [`& .${classes.stoppedOverlay2}`]: {
        filter: `drop-shadow(0 0 5px ${theme.palette.error.main})`,
        animation: status === SERVER_STATUS.STOPPED ? `stoppedOverlayEntrance2 2700ms 0ms ${theme.transitions.easing.easeOut} forwards 1` : '',
    },
    [`& .${classes.stoppedOverlay3}`]: {
        filter: `drop-shadow(0 0 5px ${theme.palette.error.main})`,
        animation: status === SERVER_STATUS.STOPPED ? `stoppedOverlayEntrance2 3400ms 0ms ${theme.transitions.easing.easeOut} forwards 1` : '',
    },
    [`& .${classes.runningOverlay}`]: {
        filter: `drop-shadow(0 0 5px ${theme.palette.success.main})`,
        animation: status === SERVER_STATUS.RUNNING ? `runningOverlayEntrance1 2000ms 0ms ${theme.transitions.easing.easeOut} forwards 1` : '',
    },
    [`& .${classes.runningOverlay2}`]: {
        filter: `drop-shadow(0 0 5px ${theme.palette.success.main})`,
        animation: status === SERVER_STATUS.RUNNING ? `runningOverlayEntrance2 2700ms 0ms ${theme.transitions.easing.easeOut} forwards 1` : '',
    },
    [`& .${classes.runningOverlay3}`]: {
        filter: `drop-shadow(0 0 5px ${theme.palette.success.main})`,
        animation: status === SERVER_STATUS.RUNNING ? `runningOverlayEntrance2 3400ms 0ms ${theme.transitions.easing.easeOut} forwards 1` : '',
    },
    [`& .${classes.loadingOverlay}`]: {
        animation: status > 2 ? `loadingOverlayEntrance1 2000ms 0ms ${theme.transitions.easing.easeOut} forwards infinite` : '',
    },
    [`& .${classes.loadingOverlay2}`]: {
        opacity: 0,
        filter: `drop-shadow(0 0 5px ${theme.palette.warning.light}) drop-shadow(0 0 10px ${theme.palette.warning.light})`,
        animation: status > 2 ? `loadingOverlayEntrance2 1000ms 0ms linear alternate infinite` : '',
    },
    ['@keyframes runningOverlayEntrance3']: {
        '0%': {
            opacity: 0,
            transform: 'scale(0.75)'
        },
        '18.75%': {
            opacity: 0.75,
        },
        '56.25%': {
            opacity: 0.1,
        },
        '75%': {
            opacity: 0,
            transform: 'scale(3.8)'
        },
        '100%': {
            transform: 'scale(3.8)'
        }
    },
    ['@keyframes runningOverlayEntrance2']: {
        '0%': {
            opacity: 0,
            transform: 'scale(0.75)'
        },
        '18.75%': {
            opacity: 0.75,
        },
        '56.25%': {
            opacity: 0.1,
        },
        '75%': {
            opacity: 0,
            transform: 'scale(2.4)'
        },
        '100%': {
            opacity: 0,
            transform: 'scale(2.4)'
        }
    },
    ['@keyframes runningOverlayEntrance1']: {
        '0%': {
            opacity: 0,
            transform: 'scale(0.75)'
        },
        '18.75%': {
            opacity: 0.75,
            transform: 'scale(1.2)'
        },
        '56.25%': {
            opacity: 0.1,
        },
        '75%': {
            opacity: 0,
            transform: 'scale(1.4)'
        },
        '100%': {
            opacity: 0,
            transform: 'scale(1.4)'
        }
    },
    ['@keyframes stoppedOverlayEntrance3']: {
        '0%': {
            opacity: 0,
            transform: 'scale(0.75)'
        },
        '18.75%': {
            opacity: 0.75,
        },
        '56.25%': {
            opacity: 0.1,
        },
        '75%': {
            opacity: 0,
            transform: 'scale(3.8)'
        },
        '100%': {
            transform: 'scale(3.8)'
        }
    },
    ['@keyframes stoppedOverlayEntrance2']: {
        '0%': {
            opacity: 0,
            transform: 'scale(0.75)'
        },
        '18.75%': {
            opacity: 0.75,
        },
        '56.25%': {
            opacity: 0.1,
        },
        '75%': {
            opacity: 0,
            transform: 'scale(2.4)'
        },
        '100%': {
            opacity: 0,
            transform: 'scale(2.4)'
        }
    },
    ['@keyframes stoppedOverlayEntrance1']: {
        '0%': {
            opacity: 0,
            transform: 'scale(0.75)'
        },
        '18.75%': {
            opacity: 0.75,
            transform: 'scale(1.2)'
        },
        '56.25%': {
            opacity: 0.1,
        },
        '75%': {
            opacity: 0,
            transform: 'scale(1.4)'
        },
        '100%': {
            opacity: 0,
            transform: 'scale(1.4)'
        }
    },
    ['@keyframes loadingOverlayEntrance2']: {
        '0%': {
            opacity: 0.3,
        },
        '100%': {
            opacity: 1,
        }
    },
    ['@keyframes loadingOverlayEntrance1']: {
        '0%': {
            opacity: 0,
            transform: 'scale(0.75)'
        },
        '18.75%': {
            opacity: 0.75,
            transform: 'scale(1.2)'
        },
        '56.25%': {
            opacity: 0.1,
        },
        '75%': {
            opacity: 0,
            transform: 'scale(1.4)'
        },
        '100%': {
            opacity: 0,
            transform: 'scale(1.4)'
        }
    },
    ['@keyframes statusIconEntrance']: {
        '0%': {
            filter: 'opacity(0)',
        },
        '100%': {
            filter: 'opacity(1)',
        }
    },
}));




export default function WGServerBlockInfo(props: any) {
    const { serverID } = props;

    const [status, setStatus] = useState<number>(SERVER_STATUS.DISABLED);


    const handleMessage = (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        if (data.type === 'wg.server.status.all') {
            console.log('all status', data);
            for (let s of data.servers) {
                console.log('s', s);
                if (s.server === serverID && s.state > -1) {
                    setStatus(s.state);
                    return;
                }
            }
        }
        else if (data.type === 'wg.server.status' && data.state >= -1) {
            setStatus(data.state);
        }
    }

    const socket = useWebSocket(`ws://${window.location.hostname}:8001/ws/wg/servers/`, {
        share: true,
        onMessage: handleMessage,
    });

    const [stopServer,] = wireguardApi.endpoints.stopServer.useLazyQuerySubscription(serverID);
    const [startServer,] = wireguardApi.endpoints.startServer.useLazyQuerySubscription(serverID);
    const [restartServer,] = wireguardApi.endpoints.restartServer.useLazyQuerySubscription(serverID);


    const handleStartServer = async () => {
        if (status !== 2) {
            setStatus(SERVER_STATUS.STARTING);
            await startServer(serverID);
        }
    }

    const handleStopServer = async () => {
        if (status !== SERVER_STATUS.STOPPED) {
            setStatus(SERVER_STATUS.STOPPING);
            await stopServer(serverID);
        }
    }

    const handleRestartServer = async () => {
        if (status !== SERVER_STATUS.STARTING && status !== SERVER_STATUS.STOPPING) {
            setStatus(SERVER_STATUS.STARTING);
            await restartServer(serverID);
        }
    }


    return (
        <>
            <StyledWGServerStatusIcon className={classes.root} status={status}>
                <Box sx={{position: 'relative', width: 40, height: 40}}>
                    <Tooltip title={'DISABLED'} placement={'top'}><LensBlurIcon className={clsx(classes.statusIcon, classes.disabled, {[classes.active]: status === SERVER_STATUS.DISABLED})}/></Tooltip>

                    <LensBlurIcon className={clsx(classes.statusIcon, classes.loading, classes.loadingOverlay, {[classes.active]: status > 2})}/>
                    <LensBlurIcon className={clsx(classes.statusIcon, classes.loading, classes.loadingOverlay2, {[classes.active]: status > 2})}/>
                    <Tooltip title={status === SERVER_STATUS.STARTING ? 'STARTING' : 'STOPPING'} placement={'top'}><LensBlurIcon className={clsx(classes.statusIcon, classes.loading, {[classes.active]: status > 2})}/></Tooltip>

                    <LensBlurIcon className={clsx(classes.statusIcon, classes.stopped, classes.stoppedOverlay, {[classes.active]: status === SERVER_STATUS.STOPPED})}/>
                    <LensBlurIcon className={clsx(classes.statusIcon, classes.stopped, classes.stoppedOverlay2, {[classes.active]: status === SERVER_STATUS.STOPPED})}/>
                    <LensBlurIcon className={clsx(classes.statusIcon, classes.stopped, classes.stoppedOverlay3, {[classes.active]: status === SERVER_STATUS.STOPPED})}/>
                    <Tooltip title={'STOPPED'} placement={'top'}><LensBlurIcon className={clsx(classes.statusIcon, classes.stopped, {[classes.active]: status === SERVER_STATUS.STOPPED})}/></Tooltip>

                    <LensBlurIcon className={clsx(classes.statusIcon, classes.running, classes.runningOverlay, {[classes.active]: status === SERVER_STATUS.RUNNING})}/>
                    <LensBlurIcon className={clsx(classes.statusIcon, classes.running, classes.runningOverlay2, {[classes.active]: status === SERVER_STATUS.RUNNING})}/>
                    <LensBlurIcon className={clsx(classes.statusIcon, classes.running, classes.runningOverlay3, {[classes.active]: status === SERVER_STATUS.RUNNING})}/>
                    <Tooltip title={'RUNNING'} placement={'top'}><LensBlurIcon className={clsx(classes.statusIcon, classes.running, {[classes.active]: status === SERVER_STATUS.RUNNING})}/></Tooltip>
                </Box>
                <Box sx={{position: 'relative', width: 56, height: 40, mx: -0.75}}>
                    <SpeedDial icon={<SettingsPowerIcon />} ariaLabel={'power'} direction={'down'} sx={{position: 'absolute', top: 0, left: 0}}  FabProps={{
                        size: 'small',
                        sx: {
                            boxShadow: 'none',
                            background: 'none',
                        },
                        //classes: {focusVisible: ''},
                    }}>
                        <SpeedDialAction
                            // @ts-ignore
                            tooltipTitle={'Start'} tooltipOpen
                            onClick={handleStartServer}
                            icon={<ArrowUpwardIcon/>}
                            FabProps={{
                                disabled: status == SERVER_STATUS.RUNNING || status === SERVER_STATUS.STARTING || status === SERVER_STATUS.STOPPING,
                            }}
                        />
                        <SpeedDialAction
                            // @ts-ignore
                            tooltipTitle={'Stop'} tooltipOpen
                            onClick={handleStopServer}
                            icon={<StopIcon/>}
                            FabProps={{
                                disabled: status === SERVER_STATUS.STOPPED,
                            }}
                        />
                        <SpeedDialAction
                            // @ts-ignore
                            tooltipTitle={'Restart'} tooltipOpen
                            onClick={handleRestartServer}
                            icon={<RestartAltIcon/>}
                            FabProps={{
                                disabled: status === SERVER_STATUS.STARTING || status === SERVER_STATUS.STOPPING,
                            }}
                        />
                    </SpeedDial>
                </Box>

            </StyledWGServerStatusIcon>
        </>
    );

}

