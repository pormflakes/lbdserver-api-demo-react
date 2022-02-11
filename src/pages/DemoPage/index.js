import React from 'react'
import { Grid } from '@mui/material'
import GetProjects from '../Documentation/Dialogs/GetProjects'
import CreateProject from '../Documentation/Dialogs/CreateProject'
import CreateDataset from '../Documentation/Dialogs/CreateDataset'
import GetAllDatasets from '../Documentation/Dialogs/GetAllDatasets'
import AlignDistributions from '../Documentation/Dialogs/AlignDistributions'
import BasicTabs from '../Documentation/Dialogs/BasicTabs'

const DemoPage = () => {
    return (
        <Grid style={{ textAlign: "justify" }} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={0} sm={2} md={3} />
            <Grid item style={{ margin: 15 }} xs={4} sm={4} md={6}>
                <div style={subComponentStyle}>
                    <CreateProject title={"1. (optional) create a project (login required)"} />
                </div>
                <div style={subComponentStyle}>
                    <GetProjects style={subComponentStyle} title={"2. Get available projects for this aggregator"} />
                </div>
                <div style={subComponentStyle}>
                    <CreateDataset style={subComponentStyle} title={"3. Upload Datasets to this project"} />
                </div>
                <div style={subComponentStyle}>
                    <GetAllDatasets style={subComponentStyle} title={"4. Activate Datasets of this project"} />
                </div>
                <div style={subComponentStyle}>
                    <AlignDistributions style={subComponentStyle} title={"5. Align datasets and create abstract concepts"} />
                </div>
                <div style={subComponentStyle}>
                    <BasicTabs title={"6. Scroll through the enrichment modules, visualise and query the project."}/>
                </div>
            </Grid>
            <Grid item xs={0} sm={2} md={3} />
        </Grid>
    )
}

const subComponentStyle = { marginTop: 30, border: "2px solid gray", borderRadius: 15, padding: 15}

export default DemoPage