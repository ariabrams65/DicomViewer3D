const modelService = require('../services/model');

async function validateModelId(req, res, next) {
    try {
        if (!req.body.modelId) {
            res.status(400).json('Missing modelId');
        }
        const isValid = modelService.exists();
        res.status(200).json(isValid);

    } catch (e) {
        console.log(e)
        next(e);
    }
}

module.exports = { validateModelId };
