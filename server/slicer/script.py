from DICOMLib import DICOMUtils
import sys
import os
import vtk
import slicer
import shutil

def load_and_filter_rtstruct(db, seriesUID, unwantedKeywords):
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
                if any(keyword.lower() in segmentName.lower() for keyword in unwantedKeywords):
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
                    #print(f"3D Opacity for 'Body': {displayNode.GetSegmentOpacity3D(segmentID)}")
                    #print(f"2D Fill Opacity for 'Body': {displayNode.GetSegmentOpacity2DFill(segmentID)}")
                    #print(f"2D Outline Opacity for 'Body': {displayNode.GetSegmentOpacity2DOutline(segmentID)}")
                
                '''else:

                    # Apply Gaussian smoothing to the segment
                    print(f"Applying Gaussian smoothing to segment: {segmentName}")
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

def convert_segmentation_to_model(segmentationNode):
    # Get the subject hierarchy node
    shNode = slicer.vtkMRMLSubjectHierarchyNode.GetSubjectHierarchyNode(slicer.mrmlScene)

    # Get the root item ID
    rootItemID = shNode.GetSceneItemID()

    # Create a folder item under the root item
    folderItemID = shNode.CreateFolderItem(rootItemID, "ExportedModels")

    # Export visible segments directly to the folder item
    slicer.modules.segmentations.logic().ExportVisibleSegmentsToModels(segmentationNode, folderItemID)

    return folderItemID


def export_model_to_gltf(outputFolder):
    # Get the subject hierarchy node
    shNode = slicer.vtkMRMLSubjectHierarchyNode.GetSubjectHierarchyNode(slicer.mrmlScene)

    # Ensure the OpenAnatomyExport module is loaded
    if not slicer.util.getModule('OpenAnatomyExport'):
        slicer.util.selectModule('OpenAnatomyExport')

    # Access the module logic
    moduleWidget = slicer.util.getModuleLogic('OpenAnatomyExport')
    

    # Find the "ExportedModels" folder node in the scene by name
    exportedModelsNodeID = shNode.GetItemByName("ExportedModels")

    # Check if the "ExportedModels" folder node is found
    if exportedModelsNodeID:
        print("Found 'ExportedModels' folder node")
    else:
        print("Unable to find 'ExportedModels' folder node")
        return
    

    moduleWidget.exportModel(exportedModelsNodeID, outputFolder)

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
                        loadedNodeIDs.extend(load_and_filter_rtstruct(db, serie, unwantedKeywords))

    disable_orientation_marker_and_axis_labels()

    # Convert segmentation to model
    segmentationNode = slicer.mrmlScene.GetFirstNodeByClass("vtkMRMLSegmentationNode")
    if segmentationNode:
        modelNodes = convert_segmentation_to_model(segmentationNode)
        print(modelNodes)
        if not slicer.util.getModule('OpenAnatomyExport'):
            slicer.util.selectModule('OpenAnatomyExport')

        slicer.app.processEvents()

        export_model_to_gltf(outputFolder)

    

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: script.py <inputFolder> <outputFolder>")
        sys.exit(1)

    inputFolder = sys.argv[1]
    outputFolder = sys.argv[2]
    main(inputFolder, outputFolder)
    sys.exit(0)