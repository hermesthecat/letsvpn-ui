import React, {useEffect, useState} from 'react';
import {
    Box,
    Divider,
    Grid,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {api} from "features/auth/authSlice";
import {connect} from "react-redux";
import {WGServer} from "../../../app/types";
import isPropValid from '@emotion/is-prop-valid'
import WGServerBlockInfo from "./WGServerBlockInfo";
import useWebSocket from "react-use-websocket";
import {Link} from "react-router-dom";


const PREFIX = 'WGServerBlock';
const classes = {
    root: `${PREFIX}-root`,
    peerSkeleton: `${PREFIX}-peerSkeleton`,
    header: `${PREFIX}-header`,
    link: `${PREFIX}-link`,
};

interface StyleProps {
    serverEnabled: boolean,
    theme?: any,
}
const StyledWGServerBlock = styled(Paper, {
    shouldForwardProp: prop => isPropValid(prop) && prop !== 'serverEnabled'
})(({ theme }: StyleProps) => ({
    [`& .${classes.root}`]: {
        padding: theme.spacing(10),
    },
    [`& .${classes.peerSkeleton}`]: {
        borderRadius: theme.spacing(1),
        margin: theme.spacing(1, 0),
    },
    [`& .${classes.header}`]: {
        backgroundColor: 'rgba(255,255,255,0)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.05)',
            transitionDuration: `${theme.transitions.duration.complex}ms`,
            transitionProperty: 'background-color',
        }
    },
    [`& .${classes.link}`]: {
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'flex',
        flexGrow: 1,
    },
}));


function WGServerBlock(props: any) {
    const { api } = props;

    const [server, setServer] = useState<WGServer>(props.server);


    return (
        <StyledWGServerBlock serverEnabled={server.enabled} className={classes.root} elevation={6}>
            <Grid container spacing={0}>
                <Grid item md={12} sx={{p: 1, pl: 2}} className={classes.header}>
                    <Typography variant={'h3'} component={Link} to={`/servers/${server.id}`} className={classes.link}>{server.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center'}}>
                        <WGServerBlockInfo serverID={server.id} />
                    </Box>
                </Grid>
                <Grid item md={12}><Divider/></Grid>
                <Grid item md={6}>
                    <TableContainer>
                        <Table size={'small'}>
                            <TableBody>
                                <TableRow>
                                    <TableCell><b>Public IP</b></TableCell>
                                    <TableCell>{server.wan}{server.wan6 ? `\n${server.wan6}` : ''}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><b>Private Key</b></TableCell>
                                    <TableCell>
                                        <TextField fullWidth disabled value={server.private_key ? server.private_key : ''} variant={'outlined'} size={'small'}/>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{borderBottom: 'none'}}><b>Public Key</b></TableCell>
                                    <TableCell sx={{borderBottom: 'none'}}>
                                        <TextField fullWidth disabled value={server.public_key ? server.public_key : ''} variant={'outlined'} size={'small'}/>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>



                <Grid item md={6}>
                    {/*peersLoading && <> TODO: Add peers to server block
                        <Typography variant={'h3'}>Peers</Typography>
                        <Divider/>
                        <Skeleton variant={'rectangular'} height={50} className={classes.peerSkeleton}/>
                        <Skeleton variant={'rectangular'} height={50} className={classes.peerSkeleton}/>
                        <Skeleton variant={'rectangular'} height={50} className={classes.peerSkeleton}/>
                    </>*/}
                    <Box>

                    </Box>
                </Grid>
            </Grid>
        </StyledWGServerBlock>
    );

}

const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = {
    api,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WGServerBlock);
