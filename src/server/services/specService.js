const db = require('../config/database').getInstance();
const yaml = require('js-yaml');
const fs = require('fs').promises;

class SpecService {
    async getAllSpecs() {
        const specs = db.prepare(`
            SELECT 
                id,
                name,
                file_name as fileName,
                description,
                updated_at
            FROM specs 
            ORDER BY name
        `).all();
        
        console.log('getAllSpecs result:', specs); // Debug log
        return specs;
    }

    async getSpecById(id) {
        const spec = db.prepare(`
            SELECT 
                id,
                name,
                file_name as fileName,
                description,
                updated_at
            FROM specs 
            WHERE id = ?
        `).get(id);
        
        console.log('getSpecById result:', spec); // Debug log
        
        if (!spec) {
            throw new Error('Specification not found');
        }
        return spec;
    }

    async createSpec(name, file, description) {
        try {
            const yamlContent = await fs.readFile(file.path, 'utf8');
            yaml.load(yamlContent); // Validate YAML

            const result = db.prepare(`
                INSERT INTO specs (name, file_name, yaml_content, description)
                VALUES (?, ?, ?, ?)
            `).run(name, file.originalname, yamlContent, description);

            console.log('createSpec result:', result); // Debug log

            // Clean up uploaded file
            await fs.unlink(file.path);
            
            return result.lastInsertRowid;
        } catch (error) {
            // Clean up uploaded file on error
            try {
                await fs.unlink(file.path);
            } catch (unlinkError) {
                console.error('Error cleaning up file:', unlinkError);
            }
            throw error;
        }
    }

    async updateSpec(id, name, file, description) {
        const spec = await this.getSpecById(id);
        
        try {
            if (file) {
                const yamlContent = await fs.readFile(file.path, 'utf8');
                yaml.load(yamlContent); // Validate YAML

                db.prepare(`
                    UPDATE specs 
                    SET name = ?, file_name = ?, yaml_content = ?, description = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                `).run(name, file.originalname, yamlContent, description, id);

                // Clean up uploaded file
                await fs.unlink(file.path);
            } else {
                db.prepare(`
                    UPDATE specs 
                    SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                `).run(name, description, id);
            }

            return { id };
        } catch (error) {
            if (file) {
                try {
                    await fs.unlink(file.path);
                } catch (unlinkError) {
                    console.error('Error cleaning up file:', unlinkError);
                }
            }
            throw error;
        }
    }

    async deleteSpec(id) {
        const result = db.prepare('DELETE FROM specs WHERE id = ?').run(id);
        if (result.changes === 0) {
            throw new Error('Specification not found');
        }
        return { success: true };
    }

    async getLatestVersion(id) {
        const spec = db.prepare(`
            SELECT id as spec_id, yaml_content, created_at
            FROM specs WHERE id = ?
        `).get(id);

        if (!spec) {
            throw new Error('Specification not found');
        }
        return spec;
    }

    async getSpecByFilename(filename) {
        return db.prepare(`
            SELECT id, yaml_content
            FROM specs 
            WHERE file_name = ?
        `).get(filename);
    }
}

module.exports = new SpecService(); 