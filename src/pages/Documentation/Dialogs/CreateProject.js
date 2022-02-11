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

export default function CreateProject(props) {
    const { open, title, description, Child, childProps } = props
    const [project, setProject] = useRecoilState(p)
    const [aggregator, setAggregator] = useState(AGGREGATOR_ENDPOINT)
    const [endpointType, setEndpointType] = useState("public")
    const [projects, setProjects] = useState([])
    const [error, setError] = useState(null)
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    async function createProject() {
        try {
            setLoading(true)
            const myService = new LbdService(getDefaultSession())
            const aggregator = await myService.getProjectRegistry(getDefaultSession().info.webId)
            const accessPoint = aggregator + v4()
            const myProject = new LbdProject(getDefaultSession(), accessPoint)
            await myProject.create(undefined, {[RDFS.label]: name}, true)
            
            setProject(myProject)
            setSuccess(true)
            setLoading(false)
        } catch (error) {
            console.log('error', error)
            setError(error)
            setLoading(false)
        }

    }

    return <div>
        <Typography variant="h5">{title}</Typography>
        <Typography>{description}</Typography>
        {getDefaultSession().info.isLoggedIn ? (
            <div style={{ marginTop: 30 }}>

            <br/>
            <TextField
                    id="projectName"
                    label="Project Name"
                    placeholder="Project Name"
                    defaultValue={name}
                    fullWidth
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    disabled={loading}
                />
            <Button style={{marginTop: 10, width: "200"}} variant="contained" onClick={createProject} disabled={loading}>Create Project</Button>
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

