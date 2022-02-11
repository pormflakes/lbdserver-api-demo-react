import React from "react";
import { atom, atomFamily, selectorFamily } from "recoil";

const config = atom({
  key: "config",
  default: {
    // "gltfviewer": {
    //   "url": "http://localhost:7004/remoteEntry.js",
    //   "scope": "gltfviewer",
    //   "label": "gltfviewer",
    //   "module": "./App",
    //   "dimensions": {
    //     "x": 3,
    //     "y": 0,
    //     "h": 22,
    //     "w": 6,
    //     // "static": true
    //   }
    // },
  //   "imageannotator": {
  //     "url": "http://localhost:7002/remoteEntry.js",
  //     "scope": "imageannotator",
  //     "label": "imageannotator",
  //     "module": "./App",
  //     "dimensions": {
  //       "x": 450,
  //       "y": 450,
  //       "h": 400,
  //       "w": 800
  //     }
  // },
      "projectmanager": {
        "url": "http://localhost:7005/remoteEntry.js",
        "scope": "projectmanager",
        "label": "projectmanager",
        "module": "./App",
        "dimensions": {
          "x": 0,
          "y": 0,
          "h": 22,
          "w": 5
        }
      },
      // "resourcemanager": {
      //   "url": "http://localhost:7003/remoteEntry.js",
      //   "scope": "resourcemanager",
      //   "label": "resourcemanager",
      //   "module": "./App",
      //   "dimensions": {
      //     "x": 11,
      //     "y": 0,
      //     "h": 22,
      //     "w": 3
      //   }
      // },

    // "tabs": {
    //   "url": "https://consolidproject.github.io/pluginAggregatorTabs/remoteEntry.js",
    //   "scope": "tabs",
    //   "label": "tabs",
    //   "module": "./index",
    //   "dimensions": {
    //     "x": 0,
    //     "y": 0,
    //     "h": 900,
    //     "w": 900
    //     },
    //   "children": {
    //     "resourcemanager": {
    //       "url": "http://localhost:8081/remoteEntry.js",
    //       "scope": "resourcemanager",
    //       "module": "./index",
    //       "icon": "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
    //         },
    //     "projectquery": {
    //       "url": "https://consolidproject.github.io/pluginQuery/remoteEntry.js",
    //       "scope": "projectquery",
    //       "module": "./index",
    //       "icon": "M7 9H2V7h5v2zm0 3H2v2h5v-2zm13.59 7-3.83-3.83c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L22 17.59 20.59 19zM17 11c0-1.65-1.35-3-3-3s-3 1.35-3 3 1.35 3 3 3 3-1.35 3-3zM2 19h10v-2H2v2z"
    //         }
    //     }
    // },
    // "viewer": {
    //   "url": "http:localhost:8082/remoteEntry.js",
    //   // "url": "https://consolidproject.github.io/pluginViewer/remoteEntry.js",
    //   "scope": "viewer",
    //   "label": "viewer",
    //   "module": "./index",
    //   "dimensions": {
    //     "x": 600,
    //     "y": 0,
    //     "h": 900,
    //     "w": 1000
    //     }
    // }
  }} )

export default config;
