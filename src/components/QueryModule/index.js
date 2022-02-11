import React, { useEffect, useState } from "react";
import { Button, TextField, FormGroup, FormControlLabel, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useRecoilValue } from "recoil";
import {datasets as d} from '../../atoms'
import {newEngine} from '@comunica/actor-init-sparql'
import {getDefaultSession} from '@inrupt/solid-client-authn-browser'
import {parseStream} from '../../util/functions'

const QueryModule = (props) => {
    const datasets = useRecoilValue(d)
    const [endpoints, setEndpoints] = useState([])
    const [query, setQuery] = useState(`SELECT * WHERE {
        ?s ?p ?o
    } LIMIT 10`)
    const [queryResults, setQueryResults] = useState({})

    useEffect(() => {
        const activeDatasets = Object.keys(datasets).map((i) => datasets[i]).filter((ds) => ds.active)
        const filtered = activeDatasets.filter(ds => {
            const main = ds.dataset.distributions[0]
            return ["https://www.iana.org/assignments/media-types/text/turtle"].includes(main.getContentType())
        })
        setEndpoints(p => filtered)
    }, [datasets])



  const columns = [
    { field: 'id', headerName: '#', width: 30 },
    {
      field: 'label',
      headerName: '?label',
      width: 120,
      editable: true,
    },
    {
      field: 'resource',
      headerName: '?resource',
      width: 300,
      editable: true,
    }
  ];

  const rows = [
    { id: 1, label: 'damage image', resource: 'https://pod.fm.ugent.be/lbd/9320812f/local/datasets/damages/'},
  ];

  async function queryDistributions() {
    const myEngine = newEngine()
    const sources = endpoints.map(ds => ds.dataset.distributions[0].url)
    const res = await myEngine.query(query, {sources, fetch: getDefaultSession().fetch})
    const { data } = await myEngine.resultToString(
        res,
        "application/sparql-results+json"
      );
      const parsed = await parseStream(data);
      setQueryResults(prev => parsed.results.bindings)
  }

  return (
    <div style={{ margin: 20 }}>
          <h4 style={{ marginTop: -5 }}>Query Resource Metadata</h4>
          <TextField
            id="outlined-multiline-flexible"
            label="Query SPARQL"
            fullWidth
            multiline
            minRows={4}
            maxRows={10}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <Button style={{ marginTop: 15}} onClick={queryDistributions} fullWidth color="primary" variant="contained">QUERY</Button>
          <br/>
          <h4 style={{marginTop: 20}}>Results</h4>

          <div style={{ height: 260}}>
          <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                disableSelectionOnClick
              />            
          </div>
          <Button style={{ marginTop: 15}} fullWidth color="primary" variant="contained">ACTIVATE SELECTION</Button>
    </div>
  );
};

export default QueryModule