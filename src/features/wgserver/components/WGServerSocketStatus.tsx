import React, {useEffect, useState} from 'react';
import {Box, styled, Tooltip} from '@mui/material';
import isPropValid from '@emotion/is-prop-valid';
import useWebSocket from "react-use-websocket";
import clsx from "clsx";
import LensBlurIcon from "@mui/icons-material/LensBlur";
import {SERVER_STATUS} from "../../../lib/enums";

const PREFIX = 'WGServerSocketStatus';
const classes = {
    root: `${PREFIX}-root`,
    connecting: `${PREFIX}-connecting`,
    connected: `${PREFIX}-connected`,
    closed: `${PREFIX}-closed`,
};

const StyledDiv = styled(Box, {
    shouldForwardProp: prop => isPropValid(prop) && prop !== 'status'
})(({ status, theme }: any) => ({
    [`&.${classes.root}`]: {
        width: 7,
        height: 7,
        boxShadow: '0 0 5px grey',
        borderRadius: '50%',
        position: 'fixed',
        bottom: 10,
        right: 10,
        background: 'grey',
    },
    [`&.${classes.connecting}`]: {
        backgroundColor: theme.palette.warning.main,
        boxShadow: `0 0 5px ${theme.palette.warning.main}`,
    },
    [`&.${classes.connected}`]: {
        backgroundColor: theme.palette.success.main,
        boxShadow: `0 0 5px ${theme.palette.success.main}`,
    },
    [`&.${classes.closed}`]: {
        backgroundColor: theme.palette.error.main,
        boxShadow: `0 0 5px ${theme.palette.error.main}`,
    },
}));

export function WGServerSocketStatus() {
    const socketUrl = `ws://${window.location.hostname}:8001/ws/wg/servers/`;


    const { readyState } = useWebSocket(socketUrl, {
        share: true,
        retryOnError: true,
        shouldReconnect: (e) => true,
        reconnectInterval: 2,
        reconnectAttempts: 20,
    });

    const getSocketStatus = () => {
        switch (readyState) {
            case 0: return 'Connecting';
            case 1: return 'Connected';
            case 2: return 'Disconnecting';
            case 3: return 'Disconnected';
            default: return 'Disconnected';
        }
    }

    return (
        <Tooltip title={getSocketStatus()} placement={'left-end'}>
            <StyledDiv className={clsx(classes.root, classes.connecting, {
                    [classes.connecting]: readyState === 0,
                    [classes.connected]: readyState === 1,
                    [classes.connecting]: readyState == 2,
                    [classes.closed]: readyState === 3,
                })}/>
        </Tooltip>
    );

}

