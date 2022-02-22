import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Alert } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import { getDefaultSession, login, Session } from '@inrupt/solid-client-authn-browser';
import { useRecoilState, useRecoilValue } from 'recoil'
import { project as p } from "../../../atoms"
import { v4 } from "uuid"
import DialogTemplate from './DialogTemplate';
import { LBDserver } from "lbdserver-client-api"
import { AGGREGATOR_ENDPOINT } from '../../../constants';
import { extract } from '../../../util/functions';
import { DCTERMS, LDP, RDFS } from '@inrupt/vocab-common-rdf'
const { LbdProject, LbdService } = LBDserver

export default function InviteStakeholder(props) {
    const { open, title, description, Child, childProps } = props
    const [project, setProject] = useRecoilState(p)
    const [stakeholder, setStakeholder] = useState("")
    const [error, setError] = useState(null)
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    async function inviteStakeholder() {
        await project.addPartialProjectByStakeholder()
    }

    return <div>
        <Typography variant="h5">{title}</Typography>
        <Typography>{description}</Typography>
        {getDefaultSession().info.isLoggedIn ? (
            <div style={{ marginTop: 30 }}>

            <br/>
            <TextField
                    id="stakeholder"
                    label="Stakeholder WebID"
                    placeholder="Stakeholder WebID"
                    defaultValue={stakeholder}
                    fullWidth
                    onChange={(e) => setStakeholder(e.target.value)}
                    autoFocus
                    disabled={loading}
                />
            <Button style={{marginTop: 10, width: "200"}} variant="contained" onClick={inviteStakeholder} disabled={loading}>Invite</Button>
            {error ? (
                <Alert onClose={() => setError(null)} severity="error">{error.message}</Alert>
            ) : (<React.Fragment/>)}
                        {success ? (
                <Alert onClose={() => setSuccess(null)} severity="success">Your project was successfully created and is now the Active Project</Alert>
            ) : (<React.Fragment/>)}
            </div>
        ) : (
            <div style={{ marginTop: 30 }}>
                <Typography>You are not authenticated. You will not be able to create a project.</Typography>
            </div>
        )}
    </div>
};

