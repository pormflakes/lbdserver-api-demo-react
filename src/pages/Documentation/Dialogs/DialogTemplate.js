import React, { useEffect, useState } from 'react';
import { TextField, Button, Grid, Box, Dialog, useMediaQuery, DialogTitle, DialogContent } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import { getDefaultSession, login, Session } from '@inrupt/solid-client-authn-browser';
import {useRecoilState, useRecoilValue} from 'recoil'
import {v4} from "uuid"

const DialogTemplate = (props) => {
    const {open, title, Child, childProps, onClose} = props
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return <Dialog 
        fullScreen
        open={open}
    >
        <DialogContent>
        <Grid style={{ textAlign: "justify" }} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={0} sm={2} md={3}/>
                <Grid item style={{margin: 15}} xs={4} sm={4} md={6}>
                <Child {...props}/>

                </Grid>
                <Grid item xs={0} sm={2} md={3}/>
        </Grid>
        </DialogContent>
        <Button style={buttonStyle} onClick={onClose} variant="contained" color="primary">
      Close
    </Button>
    </Dialog>;
};

const buttonStyle={
    width: "100px",
    margin: 10,
    float: "right"
}


export default DialogTemplate;