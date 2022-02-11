import React, { memo, useRef, useState, Suspense, useEffect } from "react";
import Draggable from "react-draggable";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import mem from "mem";
import { IconButton, Typography } from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import c from "./config";
import {
  sessionTrigger as t,
  loadedParcels as load
} from "../atoms";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { mountRootParcel } from "single-spa";
// const myModules = require("../../../../config/configuration.js");

// const boxIds = useRecoilValue(boxIdState);

// const boxIdState = atom({
//   key: "boxIdState",
//   default: Object.keys(defaultConfig),
// });

export default function Modules(props) {
  const modules = useRecoilValue(c);
  const [boxIds, setBoxIds] = useState(Object.keys(modules))
  useEffect(() => {
    console.log(`modules`, modules)
    setBoxIds(Object.keys(modules))
  }, [modules])

  return (
    <div >
      {boxIds.map((id) => {
        if (modules[id] && modules[id].dimensions) {
          return <DrawModule key={id} id={id} mod={modules[id]} />;
        }
      })}
    </div>
  );
}

const getBoxState = mem((mod) =>
  atom({
    key: `boxState_${mod.url}`,
    default: {
      x: mod.dimensions.x,
      y: mod.dimensions.y,
      w: mod.dimensions.w,
      h: mod.dimensions.h,
      fixed: true,
    },
  })
);

const DrawModule = ({ id, mod }) => {
  const [box, setBox] = useRecoilState(getBoxState(mod));
  const [minimized, setMinimized] = useState(false);
  const ref = useRef();
  function resetPosition() {
    setBox({
      ...box,
      x: mod.dimensions.x,
      y: mod.dimensions.y,
      fixed: true,
      minimized: false,
    });
  }

  function makeResponsive() {
    const windowWidth = window.width()
    const windowHeight = window.height()
  }

  function toggleMinimize() {
    if (!box.minimized) {
      setBox({ ...box, minimized: true, w: 300, h: 50, y: Math.max(box.y, 0) });
    } else {
      setBox({ ...box, minimized: false, w: mod.w, h: mod.h });
    }
  }

  return (
    <Draggable
      nodeRef={ref}
      position={{ x: box.x, y: box.y }}
      onDrag={(event, data) => {
        setBox({ ...box, x: data.x, y: data.y });
      }}
      disabled={box.fixed}
    >
      <div
        id={`module${id}`}
        ref={ref}
        className="box"
        style={{
          width: box.w,
          height: box.h,
          display: "flex",
          position: "absolute",
          background: "white",
          border: "1px LightGray solid",
        }}
      >
        {!mod.dimensions.fixed ? (
          <div>
            <IconButton
              color="primary"
              style={{ position: "absolute", right: 0, bottom: 0, zIndex: 1 }}
              onClick={() => resetPosition()}
            >
              <CompareArrowsIcon />
            </IconButton>
            <IconButton
              color="primary"
              style={{ position: "absolute", right: 80, bottom: 0, zIndex: 1 }}
              onClick={() => toggleMinimize()}
            >
              {box.minimized ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>

            <IconButton
              color="primary"
              style={{
                position: "absolute",
                right: 40,
                bottom: 0,
                zIndex: 1,
              }}
              onClick={() => setBox({ ...box, fixed: !box.fixed })}
            >
              {!box.fixed ? <LockOpenIcon /> : <LockIcon />}
            </IconButton>
          </div>
        ) : (
          <></>
        )}
        {!box.minimized ? (
          <div>
            <Suspense fallback={<p>loading ...</p>}>
              {/* <HotRemoteModule mod={mod} /> */}
              <RemoteComponent system={mod} />
              {/* <RemoteModule module={mod} /> */}
            </Suspense>
          </div>
        ) : (
          <Typography style={{ marginLeft: 10, marginTop: 15 }}>
            {id.toUpperCase()}
          </Typography>
        )}
      </div>
    </Draggable>
  );
};


const RemoteComponent = (props) => {
  const config = useRecoilValue(c)
  const [trigger, setTrigger] = useRecoilState(t);
  const [loadedParcels, setLoadedParcels] = useRecoilState(load)

  const [key, setKey] = useState(1)
  useEffect(() => {
    setKey(k => k + 1)
  }, [config])

  const [parcel, setParcel] = useState(null)
  const { system } = props
  const ref = useRef(null)

  const sharedProps = {
    trigger,
    setTrigger,
    session: getDefaultSession(),
    size: {
      height: system.dimensions.h,
      width: system.dimensions.w
    }
  };


  useEffect(() => {
    async function loader() {

      // if (!Object.keys(loadedParcels).includes(system.scope)) {
      await getDynamicScript(system)
      const factory = await loadComponent(system.scope, system.module)
      const mount = factory().mount
      const unmount = factory().unmount
      const bootstrap = factory().bootstrap
      const update = factory().update
      const parcelConfig = {
        mount,
        unmount,
        bootstrap,
        update
      }

      const parcelProps = { domElement: ref.current, ...sharedProps };
      const p = mountRootParcel(parcelConfig, parcelProps)
      const newLoaded = { ...loadedParcels, [system.scope]: p }
      setLoadedParcels(newLoaded)
      setParcel(p)
      //   }
    }

    loader()
  }, [trigger])

  return <div ref={ref}>Loading...</div>
}

const loadComponent = async (scope, module) => {
  const factory = await window[scope].get(module);
  return factory;
};

const getDynamicScript = (args) => {
  return new Promise((resolve, reject) => {
    try {
      if (!args.url) {
        console.log("no url provided");
        reject();
      }
      const element = document.createElement("script");

      element.src = args.url;
      element.type = "text/javascript";
      element.async = true;
      document.head.appendChild(element);

      element.onload = () => {
        resolve();
      };

      element.onerror = () => {
        reject();
      };
    } catch (error) {
      console.log(`error`, error);
      reject(error);
    }
  });
};