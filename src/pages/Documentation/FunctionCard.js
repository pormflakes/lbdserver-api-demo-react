import React, {useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DialogTemplate } from './Dialogs';
import { Box } from '@mui/material';

export default function FunctionCard(props) {
  const {title, description, TheComponent, childProps} = props
    const [openDialog, setOpenDialog] = useState(false)
  return ( <div >
    <Card style={{height: 250}}>
      <CardContent style={{height: 170}}>
        <Typography gutterBottom variant="h7" component="div">
          {title}
        </Typography>
        <Typography style={{textAlign: "left", marginTop: 40}} variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => setOpenDialog(true)} variant="contained" size="small">Learn More</Button>
      </CardActions>
    </Card>
    <DialogTemplate open={openDialog} onClose={()=> setOpenDialog(false)} Child={TheComponent} {...props}/>
  </div>
  );
}