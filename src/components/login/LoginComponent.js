import React, { useEffect, useState } from 'react';
import { TextField, Button, Grid, Box, Dialog, useMediaQuery, DialogTitle, DialogContent } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import { getDefaultSession, login, Session } from '@inrupt/solid-client-authn-browser';
import { useRecoilState, useRecoilValue } from 'recoil'
import { v4 } from "uuid"
import { sessionTrigger as t } from '../../atoms'
const packageJSON = require("../../../package.json")


const AuthComponent = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return <Dialog
    fullScreen={fullScreen}
    open={open}
  >
    <DialogTitle>Log in with Solid</DialogTitle>
    <DialogContent>

      <LoginForm onClose={onClose}/>

    </DialogContent>
  </Dialog>;
};

function LoginForm() {
  const [oidcIssuer, setOidcIssuer] = useState("http://localhost:5000");
  const [loading, setLoading] = useState(false)


  const onLoginClick = async (e) => {
    try {
      setLoading(true);
      if (!getDefaultSession().info.isLoggedIn) {
        await login({
          oidcIssuer,
          redirectUrl: window.location.href,
          clientName: packageJSON.name,
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(`error`, error);
    }
  };

  return (
    <div style={{ alignContent: "center", padding: 30 }}>
      <TextField
        id="oidcIssuer"
        label="Solid Identity Provider"
        placeholder="Identity Provider"
        defaultValue={oidcIssuer}
        onChange={(e) => setOidcIssuer(e.target.value)}
        autoFocus
        fullWidth
      />

      <Button style={buttonStyle} onClick={onLoginClick} variant="contained" color="primary">
        Log In
      </Button>
      <Button style={{...buttonStyle, float: "right"}} onClick={onLoginClick} variant="contained" color="primary">
        Cancel
      </Button>
    </div>
  );
}

const buttonStyle = {
  marginTop: 15,
  width: "40%"
}

export default AuthComponent;
