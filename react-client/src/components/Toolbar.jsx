import React from 'react'; // Don't need to import useState here anymore
import IconButton from '@mui/material/IconButton';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';

function Toolbar({ collapsed, toggleSidebar }) { // Receive props

    return (
        <>
            <IconButton onClick={() => { toggleSidebar(!collapsed) }} >
                <DensityMediumIcon />
            </IconButton>
            {/* <button onClick={() => toggleSidebar(!collapsed)}>Toggle Sidebar</button> */}
            {/* Use the toggleSidebar function */}
            <button>Button 2</button>
            <button>Button 3</button>
            <button>Button 4</button>
        </>
    );
}

export default Toolbar;
