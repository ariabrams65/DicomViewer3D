const child_process = require("child_process");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const AdmZip = require("adm-zip");
const config = require("../../config");
const obj2gltf = require("obj2gltf");


async function generateModels(inputFolder) {
	//create the folder where the models will be stored
	const modelId = uuidv4();
	const outputFolder = createOutputFolder(modelId);

	//run the script to create the model
	const command = getScriptCommand(inputFolder, outputFolder);
	const result = child_process.execSync(command);
	console.log(result.toString());

	// Check if OBJ files are generated successfully
    const objFilePath = path.join(outputFolder, 'scene.obj');
    if (!fs.existsSync(objFilePath)) {
        console.error('Failed to generate OBJ files.');
        return null;
    }

    // Convert OBJ to GLTF
    await convertObjToGltf(objFilePath, outputFolder);

    return modelId;
}

function createOutputFolder(modelId) {
	//Creating the folder where the model will live
	const folder = path.join(config.modelFolder, modelId);
	fs.mkdirSync(folder, { recursive: true });
	return folder;
}

function getScriptCommand(inputFolder, outputFolder) {
	const scriptPath = `${path.join(__dirname, "../slicer/script.py")}`;
	const scriptArgs = `${inputFolder} ${outputFolder}`;
	return `"${process.env.SLICER_EXECUTABLE}" --python-script ${scriptPath} ${scriptArgs}`;
}

async function convertObjToGltf(objFilePath, outputFolder) {
    try {
        // Define the output file path for the GLTF file
        const gltfFilePath = path.join(outputFolder, 'scene.gltf');

        // Convert OBJ to GLTF
        const options = {}; // You can pass options here if needed
        const gltf = await obj2gltf(objFilePath, options);

        // Write the GLTF data to the output file
        const data = Buffer.from(JSON.stringify(gltf));
        fs.writeFileSync(gltfFilePath, data);

        console.log('Conversion successful:', gltfFilePath);
    } catch (error) {
        console.error('Error occurred during conversion:', error);
    }
}

function isValid(dicomFolder) {
	//returns false if there aren't enough .dcm files in folder
	return true;
}

function filterDicom(dicomFolder) {
	// filter folder to only contain dcm files
	// result should remove non dcm files
}

function isZip(file) {
	//returns true if the given file is a zip archive
	return true;
}

function unzip(zipFile) {
	//unzips file into config.dicomFolder and returns the subfolder path
	const zip = new AdmZip(zipFile);
	const targetFolder = path.join(config.dicomFolder, uuidv4());
	fs.mkdirSync(targetFolder, { recursive: true });

	zip.extractAllTo(targetFolder, true);
	return targetFolder;
}

module.exports = { generateModels, isValid, unzip, isZip, filterDicom, convertObjToGltf };
