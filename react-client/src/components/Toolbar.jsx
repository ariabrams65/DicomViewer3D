import React, { useState, useRef } from 'react';
import TemporaryDrawer from './Sidebar';
import { ClipLoader } from 'react-spinners'; // Import the spinner

function Toolbar({ setIDName, setUploadSuccess }) {
  const formRef = useRef(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage the loading spinner

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isFormSubmitted) {
      console.log('Form is already submitted.');
      return;
    }

    setIsFormSubmitted(true);
    setLoading(true); // Activate the spinner

    const formData = new FormData(formRef.current);

    try {
      const response = await fetch('/api/dicom', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
        console.log('Response:', result);
        const modelID = result.modelId;
        setIDName(modelID);
        setUploadSuccess(true);
      } else {
        console.error('Upload failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during upload:', error);
    } finally {
      setIsFormSubmitted(false);
      setLoading(false); // Deactivate the spinner
    }
  };

  return (
    <>
      <div className='side'>
        <TemporaryDrawer />
      </div>
      <h1 className='toolbar'>DICOM Viewer</h1>
      <form
        className='right'
        ref={formRef}
        onSubmit={handleSubmit}
        id="upload"
        action="/api/upload"
        method="post"
        encType="multipart/form-data"
      >
        <input type="file" name="dicom" />
        <button type="submit" disabled={loading}>Upload</button> {/* Disable button when loading */}
        {loading && <ClipLoader color="#36d7b7" />} {/* Spinner */}
      </form>
    </>
  );
}

export default Toolbar;