from DICOMLib import DICOMUtils
import sys
import os

if __name__ == '__main__':
    

    dicomDataDir = sys.argv[1] # input folder with DICOM files
    loadedNodeIDs = []  # this list will contain the list of all loaded node IDs

    with DICOMUtils.TemporaryDICOMDatabase() as db:
        DICOMUtils.importDicom(dicomDataDir, db)
        patientUIDs = db.patients()
        for patientUID in patientUIDs:
            loadedNodeIDs.extend(DICOMUtils.loadPatientByUID(patientUID))


    exporter = vtk.vtkGLTFExporter()
    exporter.SetRenderWindow(slicer.app.layoutManager().threeDWidget(0).threeDView().renderWindow())
    exporter.SetFileName(os.path.join(sys.argv[2], 'model.gltf'))
    exporter.Write()

    sys.exit(0)
