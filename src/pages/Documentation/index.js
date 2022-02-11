import React from 'react';
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import { Typography, Grid } from '@mui/material';
import FunctionCard from './FunctionCard';

import CreateProject from './Dialogs/CreateProject.js';
import GetProjects from './Dialogs/GetProjects';
import CreateDataset from './Dialogs/CreateDataset';
import { useRecoilValue } from 'recoil';
import { project as p } from '../../atoms';
const functionality = {
    "createProject": { title: "Create Project", description: "Create an LBDserver project on your local Pod.", TheComponent: CreateProject, childProps: {} },
    "getProject": { title: "Get/Activate Projects", description: "Discover LBDserver projects on a given aggregator.", TheComponent: GetProjects, childProps: {} },
    "addDataset": { title: "Add Dataset/Distribution", description: "Add a dataset to a project and upload a distribution. The 'dataset' contains the metadata, the 'distribution' contains the actual resources.", TheComponent: CreateDataset, childProps: {} }
}

const SdkDemo = () => {
    const project = useRecoilValue(p)
    return <div>
                    <Typography align="center" style={{marginTop: 50}} variant="h4">LBDserver SDK documentation</Typography>

        <Grid style={{ textAlign: "justify" }} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={0} sm={2} md={3} />
            <Grid item style={{ margin: 15 }} xs={4} sm={4} md={6}>

                    {getDefaultSession().info.isLoggedIn ? (
                        <Typography>You are logged in as: {getDefaultSession().info.webId}.</Typography>
                    ) : (
                        <Typography>You are currently unauthenticated.</Typography>
                    )}
                <Typography style={{marginTop: 10}}>This page contains the basic information needed to interact with the LBDserver ecosystem for federated AEC projects.</Typography>
                <Typography style={{marginTop: 10}}>The following resources have been activated: </Typography>
                <ul>
                   <li>{`Project: ${(project && project.accessPoint) || "no projects are activated"}`}</li> 
                </ul>
            </Grid>
            <Grid item xs={0} sm={2} md={3} />
        </Grid>
        <Grid style={{padding: 10}} container spacing={1} columns={{ xs: 2, sm: 8, md: 12 }}>
            <Grid  item xs={0} sm={2} md={2} />
            {Object.keys(functionality).map(f => {
                const info = functionality[f]
                return <Grid  key={f} item xs={2} sm={2} md={2}>
                    <FunctionCard {...info} />
                </Grid>
            })}
            <Grid item xs={0} sm={2} md={2} />
        </Grid>

    </div>;
};

export default SdkDemo;
