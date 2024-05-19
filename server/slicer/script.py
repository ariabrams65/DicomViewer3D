from DICOMLib import DICOMUtils
import sys
import os
import vtk

def load_and_filter_rtstruct(db, seriesUID, unwantedKeywords):
    loadedNodeIDs = DICOMUtils.loadSeriesByUID([seriesUID])
    for nodeID in loadedNodeIDs:
        node = slicer.mrmlScene.GetNodeByID(nodeID)
        if node and node.GetClassName() == 'vtkMRMLSegmentationNode':
            segmentation = node.GetSegmentation()
            segmentIDs = [segmentation.GetNthSegmentID(i) for i in range(segmentation.GetNumberOfSegments())]
            for segmentID in segmentIDs:
                segment = segmentation.GetSegment(segmentID)
                segmentName = segment.GetName()
                if any(keyword.lower() in segmentName.lower() for keyword in unwantedKeywords):
                    segmentation.RemoveSegment(segmentID)
    
    return loadedNodeIDs

def main(inputFolder, outputFolder):
    dicomDataDir = inputFolder  # input folder with DICOM files
    loadedNodeIDs = []  # this list will contain the list of all loaded node IDs

    with DICOMUtils.TemporaryDICOMDatabase() as db:
        DICOMUtils.importDicom(dicomDataDir, db)
        patientUIDs = db.patients()
        for patientUID in patientUIDs:
            studies = db.studiesForPatient(patientUID)
            for study in studies:
                series = db.seriesForStudy(study)
                for serie in series:
                    files = db.filesForSeries(serie)
                    if not files:
                        continue
                    modality = db.fileValue(files[0], '0008,0060')  # DICOM tag for modality
                    if modality == 'CT':
                        loadedNodeIDs.extend(DICOMUtils.loadSeriesByUID([serie]))
                    elif modality == 'RTSTRUCT':
                        unwantedKeywords = ['Avoid', 'Couch', 'PTV', 'ITV', 'GTV']  # Keywords for segments to remove
                        loadedNodeIDs.extend(load_and_filter_rtstruct(db, serie, unwantedKeywords))


    threeDView = slicer.app.layoutManager().threeDWidget(0).threeDView()
    renderWindow = threeDView.renderWindow()
    exporter = vtk.vtkGLTFExporter()
    exporter.SetRenderWindow(renderWindow)
    exporter.SetFileName(os.path.join(outputFolder, 'model.gltf'))
    exporter.Write()

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: script.py <inputFolder> <outputFolder>")
        sys.exit(1)

    inputFolder = sys.argv[1]
    outputFolder = sys.argv[2]
    main(inputFolder, outputFolder)
    sys.exit(0)



