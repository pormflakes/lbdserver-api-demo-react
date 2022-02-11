import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Alert } from '@mui/material'
import { styled } from '@mui/material/styles';
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

const Input = styled('input')({
    display: 'none',
});

export default function CreateDataset(props) {
    const { open, title, description, Child, childProps } = props
    const [project, setProject] = useRecoilState(p)
    const [aggregator, setAggregator] = useState(AGGREGATOR_ENDPOINT)
    const [projects, setProjects] = useState([])
    const [error, setError] = useState(null)
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const [label, setLabel] = useState("")
    const [comment, setComment] = useState("")
    const [isPublic, setIsPublic] = useState("undefined")
    const [file, setFile] = useState(null)

    async function createDataset() {
        try {
            console.log('file', file)
            setLoading(true)
            const theDataset = await project.addDataset({ [RDFS.label]: label, [RDFS.comment]: comment }, eval(isPublic))
            if (file) {
                const theDistribution = await theDataset.addDistribution(file, undefined, {}, undefined, eval(isPublic))
            }
            setSuccess(true)
            setLoading(false)
        } catch (error) {
            setError(error)
            setLoading(false)
        }

    }

    return <div>
        <Typography variant="h5">{title}</Typography>
        <Typography>{description}</Typography>
        {getDefaultSession().info.isLoggedIn ? (
            <div style={{ marginTop: 30 }}>
                {project ? (
                    <div>
                        <TextField
                            style={{ marginTop: 10 }}
                            id="label"
                            label="Dataset label (leave empty to omit)"
                            placeholder="Label"
                            defaultValue={label}
                            fullWidth
                            onChange={(e) => setLabel(e.target.value)}
                            autoFocus
                            disabled={loading}
                        />
                        <TextField
                            style={{ marginTop: 20 }}

                            id="description"
                            label="Dataset description (leave empty to omit)"
                            placeholder="Description"
                            defaultValue={label}
                            fullWidth
                            onChange={(e) => setComment(e.target.value)}
                            autoFocus
                            disabled={loading}
                        />
                        <FormControl style={{ marginTop: 15 }}>

                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                onChange={(e) => setIsPublic(e.target.value)}
                                value={isPublic}
                            >
                                <FormControlLabel key={"public"} label={"Public"} control={<Radio />} value={"true"} />
                                <FormControlLabel key={"private"} label={"Private"} control={<Radio />} value={"false"} />
                                <FormControlLabel key={"inherit"} label={"Inherit"} control={<Radio />} value={"undefined"} />
                            </RadioGroup>
                        </FormControl>
                        <br/>
                        <label style={{margin: 10, width: "200"}} htmlFor="contained-button-file">
                            <Input onChange={e => setFile(e.target.files[0])} id="contained-button-file" type="file" />
                            <Button  variant="contained" component="span">
                                Choose File
                            </Button>
                        </label>
                        <Button style={{ margin: 10, width: "200" }} variant="contained" onClick={createDataset} disabled={loading}>Create Dataset</Button>

                        {error ? (
                            <Alert onClose={() => setError(null)} severity="error">{error.message}</Alert>
                        ) : (<React.Fragment />)}
                        {success ? (
                            <Alert onClose={() => setSuccess(null)} severity="success">Your dataset was successfully created.</Alert>
                        ) : (<React.Fragment />)}
                    </div>
                ) : (
                    <Typography>You do not have any projects selected in this application. Please activate one via the SDK documentation or via your own app.</Typography>
                )}
            </div>

        ) : (
            <div style={{ marginTop: 30 }}>
                <Typography>You are not authenticated. You will not be able to upload a dataset.</Typography>
            </div>
        )}
    </div>
};

