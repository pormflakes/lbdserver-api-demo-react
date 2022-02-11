import React, { useEffect, useState } from 'react';
import { TextField, Button, Grid, Typography, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import { getDefaultSession, login, Session } from '@inrupt/solid-client-authn-browser';
import { useRecoilState, useRecoilValue } from 'recoil'
import { project as p } from "../../../atoms"
import { v4 } from "uuid"
import DialogTemplate from './DialogTemplate';
import { LBDserver } from "lbdserver-client-api"
import { AGGREGATOR_ENDPOINT } from '../../../constants';
import { extract } from '../../../util/functions';
import { LDP } from '@inrupt/vocab-common-rdf'
const { LbdProject, LbdService } = LBDserver

export default function GetProjects(props) {
    const { open, title, description, Child, childProps } = props
    const [project, setProject] = useRecoilState(p)
    const [aggregator, setAggregator] = useState(AGGREGATOR_ENDPOINT)
    const [endpointType, setEndpointType] = useState("public")
    const [projects, setProjects] = useState([])
    const [error, setError] = useState(null)

    async function getProjects() {
        try {
            var myService = new LbdService(getDefaultSession())

            let endpoint = aggregator
            if (getDefaultSession().info.isLoggedIn && endpointType === "private") {
                endpoint = await myService.getProjectRegistry(getDefaultSession().info.webId)
            }
            const myProjects = await myService.getAllProjects(endpoint)
            setProjects(p => myProjects)
            return myProjects
        } catch (error) {
            console.log('error', error);
        }
    }

    async function makeActiveProject(url) {
        const theProject = new LbdProject(getDefaultSession(), url)
        await theProject.init()
        setProject(theProject)
    }

    return <div>
        <Typography variant="h5">{title}</Typography>
        <Typography>{description}</Typography>
        {getDefaultSession().info.isLoggedIn ? (
            <div style={{ marginTop: 30 }}>
                <FormControl >
                    <FormLabel id="demo-row-radio-buttons-group-label">Aggregator</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        onChange={(e) => setEndpointType(e.target.value)}
                        value={endpointType}
                    >
                        <FormControlLabel label="My Own Projects" control={<Radio />} value="private" />
                        <FormControlLabel label="Public aggregator" control={<Radio />} value="public" />
                    </RadioGroup>
                </FormControl>
            </div>
        ) : (
            <div style={{ marginTop: 30 }}>
                <Typography>You are not authenticated. You can still query a public aggregator to find interesting LBDserver projects!</Typography>
            </div>
        )}
        <div style={{ marginTop: 30 }}>
            {(endpointType === "public") ? (
                <TextField
                    id="aggregator"
                    label="Aggregator"
                    placeholder="Aggregator"
                    defaultValue={aggregator}
                    fullWidth
                    onChange={(e) => setAggregator(e.target.value)}
                    autoFocus
                />
            ) : (
                <React.Fragment />
            )}
            <br/>
            <Button style={{marginTop: 10, width: "200"}} variant="contained" onClick={getProjects}>Get projects!</Button>
            {(projects.length > 0) ? (
                <FormControl style={{marginTop: 15}}>
                    <FormLabel id="demo-row-radio-buttons-group-label">Projects</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        onChange={(e) => makeActiveProject(e.target.value)}
                        value={project && project.accessPoint}
                    >
                        {projects.map(p => {
                            return <FormControlLabel key={p} label={p} control={<Radio />} value={p} />
                        })}
                    </RadioGroup>
                </FormControl>
            ) : (
                <React.Fragment />
            )}

        </div>

    </div>
};

