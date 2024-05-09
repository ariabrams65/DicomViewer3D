import React from 'react'; // Don't need to import useState here anymore
import TemporaryDrawer from './Sidebar';

function Toolbar() { // Receive props

    return (
        <>
            <div className='side'>
            <TemporaryDrawer/>
            </div>
            {/* <button onClick={() => toggleSidebar(!collapsed)}>Toggle Sidebar</button> */}
            {/* Use the toggleSidebar function */}
            <button className='left'>Dicom Viewer</button>
            <h1 className='toolbar'>View Type</h1>
            <button className='right'>Upload Files</button>
            
        </>
    );
}

export default Toolbar;
