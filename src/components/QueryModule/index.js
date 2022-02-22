import React, { useEffect, useState } from "react";
import { Button, TextField, FormGroup, FormControlLabel, Checkbox, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useRecoilValue, useRecoilState } from "recoil";
import { datasets as d, project as p, selectedElements as s } from '../../atoms'
import { newEngine } from '@comunica/actor-init-sparql'
import { getDefaultSession } from '@inrupt/solid-client-authn-browser'
import { parseStream } from '../../util/functions'
import { translate } from "sparqlalgebrajs";
import {LBDserver} from 'lbdserver-client-api'


function findLowerLevel(obj, variables) {
  if (!variables) variables = obj.variables
  if (obj.type === "bgp") {
    return { bgp: obj, variables }
  } else {
    return findLowerLevel(obj.input, variables)
  }
}

const QueryModule = (props) => {
  const datasets = useRecoilValue(d)
  const [endpoints, setEndpoints] = useState([])
  const [selectedElements, setSelectedElements] = useRecoilState(s)

  const [query, setQuery] = useState(`PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
  SELECT * WHERE {
          ?s a beo:Wall
      } LIMIT 10`)
  const [queryResults, setQueryResults] = useState({})
  const [variables, setVariables] = useState([]);
  const [error, setError] = useState("")
  const [columns, setColumns] = useState([])
  const [rows, setRows] = useState([])
  const project = useRecoilValue(p)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const activeDatasets = Object.keys(datasets).map((i) => datasets[i]).filter((ds) => ds.active)
    const filtered = activeDatasets.filter(ds => {
      const main = ds.dataset.distributions[0]
      return ["https://www.iana.org/assignments/media-types/text/turtle"].includes(main.getContentType())
    })
    setEndpoints(p => filtered)
  }, [datasets])

  useEffect(() => {
    try {
      setError(null)
      const translation = translate(query);
      const { bgp, variables } = findLowerLevel(translation, translation.variables)
      const recognised = variables.map((e) => {
        return {
          name: e.value,
          checked: true,
        };
      })
      setVariables(v => recognised);
    } catch (error) {
      console.log('error', error)
      setError(error.message);
    }
  }, [query]);


  useEffect(() => {
    if (queryResults && queryResults.head) {
      const columnShape = queryResults.head.vars.map((v) => {return {
        field: v,
        headerName: v,
        width: 200,
        editable: true
      }})
      setColumns(prev => [{ field: 'id', headerName: '#', width: 30 }, ...columnShape])
  
      const rowShape = queryResults.results.bindings.map((b, index) => {
        const results = {}
        Object.keys(b).forEach(key => {
          results[key] = b[key].value
        })
        return {
          id: index, 
          ...results
        }
      })
      setRows(prev => rowShape)
    }
  }, [queryResults])

  async function queryDistributions() {
    const myEngine = newEngine()
    const sources = endpoints.map(ds => ds.dataset.distributions[0].url)
    const res = await myEngine.query(query, { sources, fetch: getDefaultSession().fetch })
    const { data } = await myEngine.resultToString(
      res,
      "application/sparql-results+json"
    );
    const parsed = await parseStream(data);
    setQueryResults(prev => parsed)
  }

  async function propagateAndSelect(selectionIds) {
    const identifiersToFind = []
    const selectedResults = rows.filter(item => selectionIds.includes(item.id))
    variables.forEach(variable => {
      if (variable.checked) {
        selectedResults.forEach(res => {
          if (res[variable.name]) {
            identifiersToFind.push(res[variable.name])
          }
        })
      }
    })
    const selection = []
    for (const identifier of identifiersToFind) {
      for (const ds of endpoints) {
        const c = await project.getConceptByIdentifier(identifier, ds.dataset.url, ds.dataset.distributions[0].url)
        selection.push(c)
      }
    }
    setSelectedElements(prev => selection)
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
        helperText={error}
        error={error ? true : false}
        onChange={e => setQuery(e.target.value)}
      />
      <div style={{ marginTop: 10 }}>
        <h4>Variables to propagate</h4>
        <FormGroup>
          {variables.sort((a, b) => { return a.name === b.name ? 0 : a.name < b.name ? -1 : 1; }).map((v) => {
            return (
              <FormControlLabel
                style={{ marginLeft: 15, marginTop: -10 }}
                key={v.name}
                control={
                  <Checkbox
                    checked={v.checked}
                    onChange={(e) => {
                      const filtered = variables.filter((item) => {
                        return item.name !== v.name;
                      });
                      setVariables([
                        ...filtered,
                        { name: v.name, checked: !v.checked },
                      ]);
                    }}
                    name="checkedB"
                    color="primary"
                  />
                }
                label={v.name}
              />
            );
          })}
        </FormGroup>
      </div>
      <Button style={{ marginTop: 15 }} onClick={queryDistributions} fullWidth color="primary" variant="contained">QUERY</Button>
      <br />
      <h4 style={{ marginTop: 20 }}>Results</h4>

      <div style={{ height: 260 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          onSelectionModelChange={propagateAndSelect}
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default QueryModule