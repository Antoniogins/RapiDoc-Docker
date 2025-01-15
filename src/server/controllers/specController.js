const specService = require('../services/specService');

class SpecController {
    async getAllSpecs(req, res) {
        try {
            const specs = await specService.getAllSpecs();
            const mappedSpecs = specs.map(spec => ({
                id: spec.id,
                name: spec.name,
                file_path: spec.fileName,
                description: spec.description,
                updated_at: spec.updated_at
            }));
            
            console.log('Sending specs:', mappedSpecs); // Debug log
            res.json(mappedSpecs);
        } catch (error) {
            console.error('Error in getAllSpecs:', error); // Debug log
            res.status(500).json({ error: error.message });
        }
    }

    async getSpecById(req, res) {
        try {
            const spec = await specService.getSpecById(req.params.id);
            res.json({
                id: spec.id,
                name: spec.name,
                file_path: spec.fileName,
                description: spec.description,
                updated_at: spec.updated_at
            });
        } catch (error) {
            if (error.message === 'Specification not found') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    async createSpec(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const { name, description } = req.body;
            const id = await specService.createSpec(name, req.file, description);
            res.status(201).json({ id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateSpec(req, res) {
        try {
            const { name, description } = req.body;
            const result = await specService.updateSpec(
                req.params.id,
                name,
                req.file,
                description
            );
            res.json({ id: result._id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteSpec(req, res) {
        try {
            await specService.deleteSpec(req.params.id);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getLatestVersion(req, res) {
        try {
            const version = await specService.getLatestVersion(req.params.id);
            res.json(version);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getRawFile(req, res) {
        try {
            const { filename } = req.params;
            const spec = await specService.getSpecByFilename(filename);
            
            if (!spec) {
                return res.status(404).json({ error: 'File not found' });
            }

            // Set headers for YAML content
            res.setHeader('Content-Type', 'text/yaml');
            res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
            
            // Send the raw YAML content
            res.send(spec.yaml_content);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new SpecController(); 