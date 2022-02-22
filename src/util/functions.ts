import { IQueryResultBindings, newEngine } from "@comunica/actor-init-sparql";
import LbdDataset from "lbdserver-client-api/lib/types/helpers/LbdDataset";
import LbdDistribution from "lbdserver-client-api/lib/types/helpers/LbdDistribution";
import {translate, toSparql} from 'sparqlalgebrajs'

function extract(jsonld, uri) {
    return Object.assign({}, ...jsonld.filter(i => i["@id"] === uri))
  }

  async function createReferences(project, lbdLocation, gltfLocation, session) {
    const myEngine = newEngine();
    const gltfData = await session.fetch(gltfLocation).then(t => t.json())
    const lbdProps = await determineLBDpropsLevel(lbdLocation, session);
    for (const element of gltfData.nodes) {
      if (element.name && element.name.length > 10) {
        let q;
        if (lbdProps === 1) {
          q = `
            prefix ldp: <http://www.w3.org/ns/ldp#>
            prefix dcat: <http://www.w3.org/ns/dcat#>
            prefix schema: <http://schema.org/> 
            prefix props: <https://w3id.org/props#>
      
            select ?element 
            where 
            { ?element props:globalIdIfcRoot_attribute_simple "${element.name}" .
            } LIMIT 1`;
        } else {
          q = `
          prefix ldp: <http://www.w3.org/ns/ldp#>
          prefix dcat: <http://www.w3.org/ns/dcat#>
          prefix schema: <http://schema.org/> 
          prefix props: <https://w3id.org/props#>
        
          select ?element ?thing
          where 
          { ?element props:globalIdIfcRoot ?thing . ?thing schema:value "${element.name}" .
          } LIMIT 1`;
        }
      
          const bindings = await myEngine.query(q, {
            sources: [lbdLocation],
            fetch: session.fetch,
          }).then((result: IQueryResultBindings) => result.bindings())
  
          if (bindings.length > 0) {
            const el = bindings[0].get('?element').value;
            const gltfDataset = gltfLocation.split('/').slice(0, -1).join('/') + '/'
            const lbdDataset = lbdLocation.split('/').slice(0, -1).join('/') + '/'
  
            const concept = await project.addConcept()
            await concept.addReference(element.name, gltfDataset, gltfLocation)
            await concept.addReference(el, lbdDataset, lbdLocation)
          }
      }
    } 
  
  
  
  }
  
  async function determineLBDpropsLevel(source, session) {
    const myEngine = newEngine();
  
    let q, bindings, results;
    q = `
    prefix ldp: <http://www.w3.org/ns/ldp#>
    prefix dcat: <http://www.w3.org/ns/dcat#>
    prefix schema: <http://schema.org/> 
    prefix props: <https://w3id.org/props#>
  
    select ?element ?thing
    where 
    { ?element props:globalIdIfcRoot_attribute_simple ?thing .
    } LIMIT 1`;
  
    bindings = await myEngine.query(q, {
      sources: [source],
      fetch: session.fetch,
    }).then((r:IQueryResultBindings) => r.bindings())
  
    if (bindings.length == 0) {
      q = `
      prefix ldp: <http://www.w3.org/ns/ldp#>
      prefix dcat: <http://www.w3.org/ns/dcat#>
      prefix schema: <http://schema.org/> 
      prefix props: <https://w3id.org/props#>
    
      select ?element ?thing
      where 
      { ?element props:globalIdIfcRoot ?thing . ?thing schema:value ?id .
      } LIMIT 1`;
  
      const bindings = await myEngine.query(q, {
        sources: [source],
        fetch: session.fetch,
      }).then((r:IQueryResultBindings) => r.bindings())
  
      if (bindings.length > 0) {
        return 2;
      } else {
        throw Error("could not determine props level");
      }
    } else {
      return 1;
    }
  }
  
  export function parseStream(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
      stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on("error", (err) => reject(err));
      stream.on("end", () =>{
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")))
      });
    });
  }
 
  
  // const start = new Date()
  // const prefixes = `
  // PREFIX ex: <http://example.org/voc#> 
  // `
  
  // const q0 = prefixes + 'SELECT ?item ?dam WHERE  {?item a ex:Door ; ex:hasDamage ?dam }'
  // const q1 = prefixes + 'SELECT ?item ?dam ?g WHERE { GRAPH ?g {?item a ex:Door ; ex:hasDamage ?dam }}'
  
  // function fragment(query: string) {
  //     function findLowerLevel(obj, variables?) {
  //         if (!variables) variables = obj.variables
  //         if (obj.type === "bgp") {
  //             return {bgp: obj, variables}
  //         } else {
  //             return findLowerLevel(obj.input, variables)
  //         }
  //     }
      
  //     function backToSparql(bgp, variables) {
  //         const allQueries = bgp.patterns.map(pattern => {
  //             const patterns = [pattern]
  //             const theQ1 = {type: "bgp", patterns}
  //             const graphVar = { termType: 'Variable', value: 'g' }
  //             const includedVars = variables.filter(i => [pattern.subject.value, pattern.object.value, pattern.predicate.value].includes(i.value))
  //             const theQ2 = {type: "project", input: {type: "graph", input: theQ1, name: graphVar }, variables: [...includedVars, graphVar]}
  //             return toSparql(theQ2)
  //         })
  //         return allQueries
  //     }
  
  //     const translation = translate(query);
  //     const {bgp, variables} = findLowerLevel(translation, translation.variables)
  //     return backToSparql(bgp, variables)
  // }
  
  // async function queryProject(queries, sources) {
  //     const myEngine = newEngine()
  //     for (const q of queries) {
  //         const results = await myEngine.query(q, {sources})
  //         const {data} = await myEngine.resultToString(results, "application/json")
  //     }
  // }
  
  // const fragmentations = fragment(q0)
  
  
  
  
  // const timePassed = new Date().getTime() - start.getTime()
  // console.log('timePassed', timePassed);

export {extract, createReferences}