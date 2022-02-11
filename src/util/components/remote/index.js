import React, { useState, useEffect, useRef } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { getDefaultSession } from '@inrupt/solid-client-authn-browser'
import { loadedParcels as load, sessionTrigger as t } from '../../atoms'
import c from "../../util/config"
import { mountRootParcel } from "single-spa";
import {unmountComponentAtNode} from 'react-dom'
const getDimensions = (node) => {
    return {
        height: node.scrollHeight,
        width: node.scrollWidth
    }
}

const RemoteComponent = ({system}) => {
    const config = useRecoilValue(c)
    const [trigger, setTrigger] = useRecoilState(t);
    const [loadedParcels, setLoadedParcels] = useRecoilState(load)
    const [dimensions, setDimensions] = useState(document.getElementById(system.label))

    const [key, setKey] = useState(1)

    useEffect(() => {
        setKey(k => k + 1)
    }, [config])

    function handleResize() {
        unmountComponentAtNode(document.getElementById(system.label))
        const dim = getDimensions(document.getElementById(system.label))
        if (!dimensions || (dimensions && dim.h !== dimensions.h && dim.w !== dimensions.w)) {
            setDimensions(dim)
        }
    }

    useEffect(() => {

        window.addEventListener("resize", handleResize)
        handleResize()
    }, [])

    const [parcel, setParcel] = useState(null)
    const ref = useRef(null)


    useEffect(() => {
        async function loader() {
            
            const sharedProps = {
                trigger,
                setTrigger,
                session: getDefaultSession(),
                size: dimensions
            };
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

        if (dimensions) {
            console.log("loading")
            loader()
        }
    }, [trigger, dimensions])

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

export default RemoteComponent