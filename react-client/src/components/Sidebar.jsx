import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Modal from './helpMenu';



export default function TemporaryDrawer() {

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const [subopen, setsubOpen] = React.useState(true);

  const handleClick = () => {
    setsubOpen(!subopen);
  };

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const helpUp = () => {
    setIsModalOpen(true);
    setOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const DrawerList = (
    <Box sx={{ width: 600}} role="presentation" >
      <List>
        <ListItemButton onClick={handleClick} style={{minHeight: '150px', backgroundColor:"lightblue"}}>
          <ListItemText className="centered" primaryTypographyProps={{fontSize: '35px'}} primary="View Types" />
          {subopen ? <ExpandLess /> : <ExpandMore />} 
        </ListItemButton>
        <Collapse in={subopen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText className="centered" primaryTypographyProps={{fontSize: '25px'}} primary="All" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText className="centered" primaryTypographyProps={{fontSize: '25px'}} primary="Skin" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText className="centered" primaryTypographyProps={{fontSize: '25px'}} primary="Bone" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText className="centered" primaryTypographyProps={{fontSize: '25px'}} primary="Soft Tissue" />
            </ListItemButton>
          </List>
        </Collapse>
          <ListItem key={"Settings"} disablePadding>
            <ListItemButton style={{minHeight: '150px', backgroundColor:'lightblue'}}>
              <ListItemText className="centered" primaryTypographyProps={{fontSize: '35px'}} primary={"Settings"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Help"} disablePadding>
            <ListItemButton style={{minHeight: '150px', backgroundColor:'lightblue'}} onClick={helpUp}>
              <ListItemText className="centered" primaryTypographyProps={{fontSize: '35px'}} primary={"Help"} />
            </ListItemButton>
            
          </ListItem>
        {['Exit Menu'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton style={{minHeight: '150px', backgroundColor:'lightblue'}} onClick={toggleDrawer(false)}>
              <ListItemText className="centered" primaryTypographyProps={{fontSize: '35px'}} primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
    
  );


//   <IconButton onClick={() => { toggleSidebar(!collapsed) }} >
//   <BluetoothIcon/>
// </IconButton>
  return (
    <div>
      <IconButton className='icon' onClick={toggleDrawer(true)}><DensityMediumIcon/></IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
      {isModalOpen && <Modal onClose={handleCloseModal} />}
    </div>
  );
}
