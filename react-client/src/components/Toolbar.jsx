import React from 'react'; // Don't need to import useState here anymore
import TemporaryDrawer from './Sidebar';

function Toolbar() { // Receive props

    return (
        <>
            <TemporaryDrawer />
            {/* <button onClick={() => toggleSidebar(!collapsed)}>Toggle Sidebar</button> */}
            {/* Use the toggleSidebar function */}
            <button className='left'>Button 2</button>
            <h1 className='toolbar'>VIEW TYPE</h1>
            <button className='right'>Button 4</button>
            
        </>
    );
}

export default Toolbar;