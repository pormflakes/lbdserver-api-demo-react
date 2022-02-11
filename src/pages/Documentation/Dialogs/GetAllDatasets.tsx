import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Alert, Checkbox, FormGroup } from '@mui/material'
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { getDefaultSession, login, Session } from '@inrupt/solid-client-authn-browser';
import { useRecoilState, useRecoilValue } from 'recoil'
import { project as p, datasets as d } from "../../../atoms"
import { v4 } from "uuid"
import DialogTemplate from './DialogTemplate';
import { LBDserver } from "lbdserver-client-api"
import { AGGREGATOR_ENDPOINT } from '../../../constants';
import { extract } from '../../../util/functions';
import { DCTERMS, LDP, RDFS } from '@inrupt/vocab-common-rdf'
const { LbdProject, LbdService, LbdDataset } = LBDserver

const Input = styled('input')({
    display: 'none',
});

export default function GetAllDatasets(props: any) {
    const { open, title, description, Child, childProps } = props
    const [project, setProject] = useRecoilState(p)
    const [aggregator, setAggregator] = useState(AGGREGATOR_ENDPOINT)
    const [projects, setProjects] = useState([])
    const [error, setError] = useState(null)
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [datasets, setDatasets] = useRecoilState(d)

    async function getAllDatasets() {
        const allDatasets = await project.getAllDatasetUrls()
        const loaded = {}
        for (const ds of allDatasets) {
            const myDs = new LbdDataset(getDefaultSession(), ds)
            await myDs.init()
            loaded[ds] = { dataset: myDs, active: false }
        }
        setDatasets(loaded)
    }

    return <div>
        <Typography variant="h5">{title}</Typography>
        <Typography>{description}</Typography>
        {project ? (
            <div>
                <Button style={{ margin: 10, width: "200" }} variant="contained" onClick={getAllDatasets}>Get Datasets</Button>
                <FormGroup>
                    {Object.keys(datasets).map(ds => {
                        return <DatasetInfo key={ds} dataset={datasets[ds]}/>
                    })}
                </FormGroup>
            </div>
        ) : (
            <Typography>No active project has been set. Please select one first.</Typography>
        )}
    </div>
};


function DatasetInfo(props: {dataset: {dataset: InstanceType<typeof LbdDataset>, active: boolean}}) {
    const [datasets, setDatasets] = useRecoilState(d)

    const {dataset, active} = props.dataset

    function makeLabel() {
        const label = extract(dataset.data, dataset.url)[RDFS.label][0]["@value"]
        const creator = extract(dataset.data, dataset.url)[DCTERMS.creator][0]["@id"]
        return `${label} - ${creator}`
    }

    function toggleDatasetState() {
        setDatasets({...datasets, [dataset.url]: {dataset, active: !active}})
    }
    return <FormControlLabel onChange={toggleDatasetState} control={<Checkbox checked={active} />} label={makeLabel()} />
}