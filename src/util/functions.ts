import { IQueryResultBindings, newEngine } from "@comunica/actor-init-sparql";
import LbdDataset from "lbdserver-client-api/lib/types/helpers/LbdDataset";
import LbdDistribution from "lbdserver-client-api/lib/types/helpers/LbdDistribution";

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

export {extract, createReferences}