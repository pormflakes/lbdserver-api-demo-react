import React, { useEffect, useState, useStyles } from 'react';
import { useSession, LoginButton } from '@inrupt/solid-ui-react'
import { TextField, Button } from '@mui/material'
const packageJSON = require("../../../package.json")

const AuthComponent = () => {
    const session = useSession()

    return <div>
        {!session.info.isLoggedIn ? (
            <div>
                <LoginForm/>
            </div>
        ) : (
            <div>
               <LogoutForm/> 
            </div>
        )}
    </div>;
};

function LogoutForm() {
    return <div>
        Log out
    </div>
}

function LoginForm() {
    const [idp, setIdp] = useState("http://localhost:5000");
    const [currentUrl, setCurrentUrl] = useState("https://localhost:3000");
    const classes = useStyles();

    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, [setCurrentUrl]);

    return (
        <div className={classes.loginFormContainer}>
            <TextField
                id="idp"
                label="IDP"
                placeholder="Identity Provider"
                defaultValue={idp}
                onChange={(e) => setIdp(e.target.value)}
            />
            <LoginButton
                authOptions={{ clientName: packageJSON.name }}
                oidcIssuer={idp}
                redirectUrl={currentUrl}
                onError={console.error}
            >
                <Button variant="contained" color="primary">Log In</Button>
            </LoginButton>
        </div>
    );
}

export default AuthComponent;
