# DicomViewer3D

Upload dicom images and view them in 3d.


## Installation 

Make sure you have both Node.js and Python installed

**Clone the repository:**

```
git clone https://github.com/ariabrams65/DicomViewer3D
```

**Change into the server directory and create a python virtual environment:**

```
cd DicomViewer3D/server
```
    
```
python -m venv .venv
```

**Activate the virtual environment:**

Windows:

```
.\.venv\Scripts\activate
```

Unix or MacOS:

```
source .venv/bin/activate
```

**Install the python dependencies:**

```
pip install -r requirements.txt
```

**Install the Node.js dependencies for the server:**

```
npm install
```

**Change into the client directory and install the Node.js dependencies for the client:**

```
cd ../client
```

```
npm install
```

## How to run locally

### Run backend development server

**Change into the server directory and run the server:**

```
cd ../server
```

```
npm run start
```

### Run frontend development server

* Open a new terminal window so that we can run the frontend's development server

**Change into the client directory and and run the server:**

```
cd DicomViewer3d/client
```

```
npx vite
```

Go to <http://localhost:5173> to access the webpage

Note: after installation, you dont need to activate the python virtual environment
every time. Just run the servers.
