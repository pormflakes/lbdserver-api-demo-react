import { Session } from "@inrupt/solid-client-authn-browser"
import {atom} from "recoil"
import {v4} from 'uuid'

const sessionTrigger = atom({
    key: 'sessionTrigger',
    default: v4()
})

const propagate = atom({
  key: 'propagate',
  default: v4()
})

const loadedParcels = atom({
    key: "loadedParcels",
    default: {},
    dangerouslyAllowMutability: true
  });

const project = atom({
    key: "project",
    default: null,
  });

const datasets = atom({
    key: "datasets",
    default: {},
});

const selectedElements = atom({
  key: "selectedElements",
  default: []
})
  
// const session = atom({
//   key: "session",
//   default: new Session()
// })


export {sessionTrigger, loadedParcels, project, propagate, datasets, selectedElements}