import React, { useState, useRef }from 'react'; // Don't need to import useState here anymore
import TemporaryDrawer from './Sidebar';
// import axios from "axios";


function Toolbar({ setIDName, setUploadSuccess }) { // Receive props
    const formRef = useRef(null);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isFormSubmitted) {
            console.log('Form is already submitted.');
            return;
        }

        setIsFormSubmitted(true);

        const formData = new FormData(formRef.current);

        try {
            const response = await fetch('/api/dicom', { // Note the updated URL
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                const result = await response.json();
                console.log('Upload successful:', result);
                console.log('Response:', result);
                const modelID = result.modelId;
                // loader.load(`/textures/${modelID}/model.gltf`, loadCallback);
                // Somehow need to load the model into react three fiber
                setIDName(modelID);
                setUploadSuccess(true);
            } else {
                console.error('Upload failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error during upload:', error);
        } finally {
            setIsFormSubmitted(false);
        }
    };
    return (
        <>
            <div className='side'>
                <TemporaryDrawer />
            </div>
            {/* <button className='left'>DICOM Viewer</button> */}
            <h1 className='toolbar'>DICOM Viewer</h1>
            <form className='right' ref={formRef} onSubmit={handleSubmit}
                id="upload" action="/api/upload" method="post" encType="multipart/form-data">
                <input type="file" name="dicom" />
                <button type="submit">Upload</button>
            </form>
            {/*<button className='right' onClick={submit_form(form)}>Upload Files</button>*/}
        </>
    );
}

export default Toolbar;
