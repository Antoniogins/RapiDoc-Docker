const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const specController = require('../controllers/specController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../data/specs'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.yaml' || ext === '.yml') {
            cb(null, true);
        } else {
            cb(new Error('Only YAML files are allowed'));
        }
    }
});

// API Routes
router.get('/specs', specController.getAllSpecs.bind(specController));
router.get('/specs/:id', specController.getSpecById.bind(specController));
router.post('/specs', upload.single('file'), specController.createSpec.bind(specController));
router.put('/specs/:id', upload.single('file'), specController.updateSpec.bind(specController));
router.delete('/specs/:id', specController.deleteSpec.bind(specController));
router.get('/specs/:id/latest', specController.getLatestVersion.bind(specController));

// Add new raw file endpoint
router.get('/file/raw/:filename', specController.getRawFile.bind(specController));

module.exports = router; 