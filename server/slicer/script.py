from DICOMLib import DICOMUtils
import sys
import os
import vtk
import slicer
import shutil
import re

def load_and_filter_rtstruct(db, seriesUID, unwantedKeywords, outputFolder):
    loadedNodeIDs = DICOMUtils.loadSeriesByUID([seriesUID])
    for nodeID in loadedNodeIDs:
        node = slicer.mrmlScene.GetNodeByID(nodeID)
        print(f"Processing node: {node.GetName() if node else 'None'}")
        if node and node.GetClassName() == 'vtkMRMLSegmentationNode':
            segmentation = node.GetSegmentation()
            displayNode = node.GetDisplayNode()
            if not displayNode:
                displayNode = slicer.mrmlScene.AddNewNodeByClass('vtkMRMLSegmentationDisplayNode')
                node.SetAndObserveDisplayNodeID(displayNode.GetID())
            displayNode.SetVisibility3D(True)
            displayNode.SetVisibility2DFill(True)
            displayNode.SetVisibility2DOutline(True)
            segmentIDs = [segmentation.GetNthSegmentID(i) for i in range(segmentation.GetNumberOfSegments())]
            for segmentID in segmentIDs:
                segment = segmentation.GetSegment(segmentID)
                segmentName = segment.GetName()
                print(f"Processing segment: {segmentName}")
                if any(keyword.lower() in segmentName.lower() for keyword in unwantedKeywords if keyword.lower() != 'test') and not any(re.search(r'\btest\b', segmentName.lower()) for keyword in unwantedKeywords):
                    print(f"Removing segment: {segmentName}")
                    segmentation.RemoveSegment(segmentID)
                elif "ptv" in segmentName.lower():  # Check if "ptv" is a substring of the segment name
                    print(f"Removing segment: {segmentName}")
                    segmentation.RemoveSegment(segmentID)

                elif segmentName.lower() == 'body':  
                    print(f"Setting opacity for segment: {segmentName}")
                    #displayNode.SetSegmentOpacity3D(segmentID, 0.1)  
                    #displayNode.SetSegmentOpacity2DFill(segmentID, 0.1)  
                    #displayNode.SetSegmentOpacity2DOutline(segmentID, 0.1)  

                    skinColor = [1.0, 0.8, 0.6]  # Example of a skin-like color
                    segment.SetColor(skinColor)

                    displayNode.Modified()
                    segmentation.Modified()
                    segment_names_path = os.path.join(outputFolder, 'segment_names.txt')
                    with open(segment_names_path, 'a') as f:
                        f.write(segmentName + '\n')
                    #print(f"3D Opacity for 'Body': {displayNode.GetSegmentOpacity3D(segmentID)}")
                    #print(f"2D Fill Opacity for 'Body': {displayNode.GetSegmentOpacity2DFill(segmentID)}")
                    #print(f"2D Outline Opacity for 'Body': {displayNode.GetSegmentOpacity2DOutline(segmentID)}")
                
                else:

                    segment_names_path = os.path.join(outputFolder, 'segment_names.txt')
                    with open(segment_names_path, 'a') as f:
                        f.write(segmentName + '\n')

                    #if segmentation.GetSegment(segmentID).GetRepresentation() != slicer.vtkSegmentationConverter.GetSegmentationBinaryLabelmapRepresentationName():
                        #segmentation.CreateRepresentation(slicer.vtkSegmentationConverter.GetSegmentationBinaryLabelmapRepresentationName(), segmentID)
                    # Apply Gaussian smoothing to the segment
                    '''print(f"Applying Gaussian smoothing to segment: {segmentName}")
                    segmentEditorWidget = slicer.qMRMLSegmentEditorWidget()
                    segmentEditorWidget.setMRMLScene(slicer.mrmlScene)
                    segmentEditorNode = slicer.vtkMRMLSegmentEditorNode()
                    slicer.mrmlScene.AddNode(segmentEditorNode)
                    segmentEditorWidget.setMRMLSegmentEditorNode(segmentEditorNode)
                    segmentEditorWidget.setSegmentationNode(node)
                    segmentEditorWidget.setMasterVolumeNode(slicer.mrmlScene.GetFirstNodeByClass("vtkMRMLScalarVolumeNode"))
                    segmentEditorWidget.setCurrentSegmentID(segmentID)
                    segmentEditorWidget.setActiveEffectByName("Smoothing")
                    effect = segmentEditorWidget.activeEffect()
                    effect.setParameter("SmoothingMethod", "Gaussian")
                    effect.setParameter("GaussianStandardDeviationMm", 3.0)  # Adjust the value as needed
                    effect.self().onApply()'''
    
    return loadedNodeIDs

def disable_orientation_marker_and_axis_labels():
    # Access the 3D view controller
    threeDView = slicer.app.layoutManager().threeDWidget(0).threeDView()
    viewNode = threeDView.mrmlViewNode()
    
    # Disable the orientation marker (3D cube)
    viewNode.SetBoxVisible(False)
    # Disable the axis labels
    viewNode.SetAxisLabelsVisible(False)
    
    # Apply changes and ensure they're fully propagated
    viewNode.Modified()
    slicer.app.processEvents()

def export_scene_to_obj(outputFolder):
    threeDView = slicer.app.layoutManager().threeDWidget(0).threeDView()
    renderWindow = threeDView.renderWindow()

    # Create OBJ exporter
    exporter = vtk.vtkOBJExporter()
    exporter.SetInput(renderWindow)
    exporter.SetFilePrefix(os.path.join(outputFolder, 'scene'))
    exporter.Write()

def main(inputFolder, outputFolder):
    dicomDataDir = inputFolder
    loadedNodeIDs = []

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
                    modality = db.fileValue(files[0], '0008,0060')
                    if modality == 'CT':
                        loadedNodeIDs.extend(DICOMUtils.loadSeriesByUID([serie]))
                    elif modality == 'RTSTRUCT':
                        unwantedKeywords = ['Avoid', 'Couch', 'PTV', 'ITV', 'GTV', 'test']
                        loadedNodeIDs.extend(load_and_filter_rtstruct(db, serie, unwantedKeywords, outputFolder))

    disable_orientation_marker_and_axis_labels()

    export_scene_to_obj(outputFolder)

    

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: script.py <inputFolder> <outputFolder>")
        sys.exit(1)

    inputFolder = sys.argv[1]
    outputFolder = sys.argv[2]
    main(inputFolder, outputFolder)
    sys.exit(0)