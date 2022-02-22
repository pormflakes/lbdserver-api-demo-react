import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Viewer from '../../../components/Viewer'
import QueryModule from '../../../components/QueryModule'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs(props) {
  const { title, description } = props
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography component={"span"} variant="h5">{title}</Typography>
      <Typography component={"span"}>{description}</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="GlTF Viewer" {...a11yProps(0)} />
          <Tab label="SPARQL Query" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel id="tab-box" style={tabStyle} value={value} index={0}>
        <Viewer parentNode={"tab-box"} />
      </TabPanel >
        <TabPanel style={tabStyle} value={value} index={1}>
          <QueryModule/>
        </TabPanel>
        <TabPanel style={tabStyle} value={value} index={2}>
          Item Three
        </TabPanel>
    </Box>
  );
}

const tabStyle = { height: 800 }