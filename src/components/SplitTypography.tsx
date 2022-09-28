import * as React from 'react';
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import {styled} from "@mui/material";
import {grey} from "@mui/material/colors";


const PREFIX = 'SplitTypography';

const classes = {
    root: `${PREFIX}-root`,
    pageTitleDivider: `${PREFIX}-pageTitleDivider`,
    titleBox: `${PREFIX}-titleBox`,
};

const StyledBox = styled(Box)(({theme}: any) => ({
    [`&.${classes.root}`]: {
        width: '100%',
    },
    [`& .${classes.titleBox}`]: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(1),
    },
    [`& .${classes.pageTitleDivider}`]: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        backgroundColor: grey[500],
    }
}));

export function SplitTypography(props: any) {

    const {title, children, variant, ...otherProps} = props;

    return (
        <StyledBox className={classes.root} {...otherProps}>
            <Box className={classes.titleBox}>
                <Typography variant={variant} sx={{flexGrow: 1}}>{title}</Typography>
                {children}
            </Box>
            <Divider/>
        </StyledBox>
    );
}

SplitTypography.defaultProps = {
    variant: 'h4',
    title: '',
    children: null,
};

