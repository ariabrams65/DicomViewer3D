import { useState } from 'react';
import Renderer from './components/Renderer';
import './styles/App.css';
import Toolbar from './components/Toolbar';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import IconButton from '@mui/material/IconButton';

import { Home } from '@mui/icons-material';

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Sidebar collapsed={collapsed}>
        <Menu>
          <MenuItem icon={<Home />}>Home</MenuItem>
        </Menu>
      </Sidebar>
      <div className="app-container">
        <Toolbar collapsed={collapsed} toggleSidebar={setCollapsed} /> {/* Update */}
        <Renderer className='renderer'>3d Renderer </Renderer>
      </div>
    </>
  );
}

export default App;
