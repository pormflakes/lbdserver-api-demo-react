// import React, {useState} from 'react';
// import Box from '@mui/material/Box'
// import Grid from '@mui/material/Grid'
// import Typography from '@mui/material/Typography'

// const Project = () => {
//     const [newProject, setNewProject] = useState(false)
//     return <Box sx={{ flexGrow: 1 }}>
//         <Grid style={{marginTop: 100}} textAlign="center" container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
//             <Grid item xs={0} sm={1} md={4} />
//             <Grid item xs={4} sm={6} md={4}>
//                 <Typography variant="h3" >Project Management</Typography>
//             </Grid>
//             <Grid item xs={0} sm={1} md={4} />
//         </Grid>

//     </Box>;
// };

// export default Project;

import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import RemoteComponent from "../components/remote";

const ResponsiveReactGridLayout = WidthProvider(Responsive);


function createLayoutFromConfig(config) {
  const layout =  Object.keys(config).map((item, index) => {
    const {url, scope, label, module} = config[item]
    const i = index.toString()
    return {scope, label, module, url, i, ...config[item].dimensions, static: true}
  })

  return layout
}


export default class Configuration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBreakpoint: "lg",
      compactType: "vertical",
      mounted: false,
      layouts: { lg: createLayoutFromConfig(props.initialLayout) }
    };

    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onCompactTypeChange = this.onCompactTypeChange.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onNewLayout = this.onNewLayout.bind(this);
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  generateDOM() {
    return _.map(this.state.layouts.lg, function(l, i) {



      return (
        <div key={i} id={l.label} style={{border: "2px solid black", borderRadius: "15px"}}>
          {/* {l.static ? (
            <span
              className="text"
              title="This item is static and cannot be removed or resized."
            >
              Static - {i}
            </span>
          ) : ( */}
            <RemoteComponent system={l}/>
          {/* )} */}
        </div>
      );
    });
  }

  onBreakpointChange(breakpoint) {
    this.setState({
      currentBreakpoint: breakpoint
    });
  }

  onCompactTypeChange() {
    const { compactType: oldCompactType } = this.state;
    const compactType =
      oldCompactType === "horizontal"
        ? "vertical"
        : oldCompactType === "vertical"
          ? null
          : "horizontal";
    this.setState({ compactType });
  }

  onLayoutChange(layout, layouts) {
    this.props.onLayoutChange(layout, layouts);
  }

  onNewLayout() {
      console.log('generateLayout', generateLayout());
    this.setState({
      layouts: { lg: Object.keys(this.props.initialLayout).map(key => this.props.initialLayout[key].dimensions) }
    });
  }

  render() {
    return (
      <div>
        {/* <div>
          Current Breakpoint: {this.state.currentBreakpoint} ({
            this.props.cols[this.state.currentBreakpoint]
          }{" "}
          columns)
        </div>
        <div>
          Compaction type:{" "}
          {_.capitalize(this.state.compactType) || "No Compaction"}
        </div>
        <button onClick={this.onNewLayout}>Generate New Layout</button>
        <button onClick={this.onCompactTypeChange}>
          Change Compaction Type
        </button> */}
        <ResponsiveReactGridLayout
          {...this.props}
          style={{width: "99%", height: "99%", alignContent: "center"}}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}
          compactType={this.state.compactType}
          preventCollision={!this.state.compactType}
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

Configuration.propTypes = {
  onLayoutChange: PropTypes.func.isRequired
};

Configuration.defaultProps = {
  className: "layout",
  rowHeight: 30,
  onLayoutChange: function() {},
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  initialLayout: generateLayout()
};

function generateLayout() {
  return _.map(_.range(0, 25), function(item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: (_.random(0, 5) * 2) % 12,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: Math.random() < 0.05
    };
  });
}

