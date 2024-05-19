import React, { useState, useRef }from 'react'; // Don't need to import useState here anymore
import TemporaryDrawer from './Sidebar';



function Toolbar() { // Receive props
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
            const response = await fetch('/api/upload', { // Note the updated URL
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Upload successful:', result);
                // ... (Handle the successful response, e.g., update UI)
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
            <button className='left'>Button 2</button>
            <h1 className='toolbar'>VIEW TYPE</h1>
            <form ref={formRef} onSubmit={handleSubmit}
                id="upload" action="/api/upload" method="post" encType="multipart/form-data">
                <input type="file" name="dicom" />
                <button type="submit">Upload</button>
            </form>
            {/*<button className='right' onClick={submit_form(form)}>Upload Files</button>*/}
        </>
    );
}

export default Toolbar;
