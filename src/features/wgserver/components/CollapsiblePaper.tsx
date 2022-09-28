import React, {useEffect, useState} from 'react';
import {Box, Collapse, Divider, IconButton, Paper, styled, Typography} from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const PREFIX = 'CollapsiblePaper';
const classes = {
    root: `${PREFIX}-root`,
    title: `${PREFIX}-title`,
    titleBox: `${PREFIX}-titleBox`,
};

const StyledPaper = styled(Paper)(({theme}: any) => ({
    [`&.${classes.root}`]: {
        padding: theme.spacing(1, 2, 2, 2),
        margin: theme.spacing(2, 0),
    },
    [`& .${classes.titleBox}`]: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
    },
    [`& .${classes.title}`]: {
        flexGrow: 1,
    },
}));

export function CollapsiblePaper(props: any) {
    const { children, title, defaultCollapsed, disabled } = props;

    const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);

    const toggleCollapse = () => {
        if (!disabled)
            setCollapsed(!collapsed)
    }

    return (
        <StyledPaper
            elevation={6}
            className={classes.root}
        >
            <Box className={classes.titleBox} onClick={toggleCollapse}>
                {typeof title === 'string' ? <Typography variant={'h4'} className={classes.title}>{title}</Typography> : title}
                {!disabled && <IconButton>{collapsed ? <ArrowDropDownIcon/> : <ArrowDropUpIcon/>}</IconButton>}
            </Box>

            <Collapse in={!collapsed}>
                <Divider sx={{my: 1}}/>
                {children}
            </Collapse>
        </StyledPaper>
    );

}

CollapsiblePaper.defaultProps = {
    title: '',
    defaultCollapsed: false,
    disabled: false,
}
