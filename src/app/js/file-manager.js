class FileManager {
    constructor() {
        this.apiUrl = '/api';
        this.fileManagerModal = new bootstrap.Modal(document.getElementById('fileManagerModal'));
        this.fileEditModal = new bootstrap.Modal(document.getElementById('fileEditModal'));
        this.currentEditId = null;
        this.currentFile = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Main buttons
        document.getElementById('createFileBtn').addEventListener('click', () => this.showEditModal());
        document.getElementById('refreshListBtn').addEventListener('click', () => this.refreshFileList());
        document.getElementById('saveFileBtn').addEventListener('click', () => this.saveFile());
        
        // File Manager button in header
        document.getElementById('openFileManager').addEventListener('click', () => {
            this.showFileManager();
        });

        // File upload handling
        const dropZone = document.getElementById('dropZone');
        const fileUpload = document.getElementById('fileUpload');
        const filePath = document.getElementById('filePath');

        // Drag and drop events
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-primary');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-primary');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-primary');
            const file = e.dataTransfer.files[0];
            this.handleFileSelection(file);
        });

        // File input change event
        fileUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            this.handleFileSelection(file);
        });
    }

    handleFileSelection(file) {
        if (file && (file.name.endsWith('.yaml') || file.name.endsWith('.yml'))) {
            this.currentFile = file;
            document.getElementById('filePath').value = file.name;
            document.getElementById('fileName').value = file.name.replace(/\.(yaml|yml)$/, '');
        } else {
            alert('Please select a YAML file');
        }
    }

    async showFileManager() {
        await this.refreshFileList();
        this.fileManagerModal.show();
    }

    async showEditModal(fileId = null) {
        this.currentEditId = fileId;
        const modalTitle = document.getElementById('fileEditModalLabel');
        const form = document.getElementById('fileEditForm');
        
        if (fileId) {
            modalTitle.textContent = 'Edit Specification';
            const response = await fetch(`${this.apiUrl}/specs/${fileId}`);
            const file = await response.json();
            form.fileName.value = file.name;
            form.filePath.value = file.file_path;
            form.fileDescription.value = file.description;
        } else {
            modalTitle.textContent = 'Create New Specification';
            form.reset();
        }

        this.fileEditModal.show();
    }

    async refreshFileList() {
        const tbody = document.getElementById('fileListBody');
        const response = await fetch(`${this.apiUrl}/specs`);
        const files = await response.json();
        
        console.log('Files received:', files);
        
        tbody.innerHTML = files.map(file => {
            console.log('Processing file:', file);
            return `
                <tr>
                    <td>${file.name}</td>
                    <td class="text-truncate" style="max-width: 200px;">${file.file_path}</td>
                    <td>${new Date(file.updated_at).toLocaleString()}</td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-primary" onclick="fileManager.showEditModal(${file.id})" title="Edit">
                                <i class="bi bi-pencil-fill text-white"></i>
                            </button>
                            <button class="btn btn-info" onclick="fileManager.duplicateFile(${file.id})" title="Duplicate">
                                <i class="bi bi-files text-white"></i>
                            </button>
                            <button class="btn btn-danger" onclick="fileManager.deleteFile(${file.id})" title="Delete">
                                <i class="bi bi-trash-fill text-white"></i>
                            </button>
                            <button class="btn btn-secondary" onclick="fileManager.copyPath(${file.id}, event)" title="Copy Path">
                                <i class="bi bi-clipboard-fill text-white"></i>
                            </button>
                            <button class="btn btn-success" onclick="fileManager.loadFile(${file.id})" title="Load">
                                <i class="bi bi-arrow-up-right-square-fill text-white"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    async saveFile() {
        const form = document.getElementById('fileEditForm');
        const formData = new FormData();
        
        formData.append('name', form.fileName.value);
        formData.append('description', form.fileDescription.value);
        formData.append('file', this.currentFile);

        try {
            const url = this.currentEditId 
                ? `${this.apiUrl}/specs/${this.currentEditId}`
                : `${this.apiUrl}/specs`;
                
            const response = await fetch(url, {
                method: this.currentEditId ? 'PUT' : 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            
            this.fileEditModal.hide();
            this.refreshFileList();
        } catch (error) {
            alert(`Error saving file: ${error.message}`);
        }
    }

    async deleteFile(id) {
        if (confirm('Are you sure you want to delete this specification?')) {
            try {
                const response = await fetch(`${this.apiUrl}/specs/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error);
                }

                this.refreshFileList();
            } catch (error) {
                alert(`Error deleting file: ${error.message}`);
            }
        }
    }

    async copyPath(id, event) {
        try {
            const response = await fetch(`${this.apiUrl}/specs/${id}`);
            const file = await response.json();
            await navigator.clipboard.writeText(file.file_path);
            
            // Show a temporary success message
            const btn = event ? event.target.closest('button') : document.querySelector(`button[onclick="fileManager.copyPath(${id})"]`);
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check-lg text-white"></i>';
            setTimeout(() => btn.innerHTML = originalHtml, 1000);
        } catch (error) {
            alert(`Error copying path: ${error.message}`);
        }
    }

    async loadFile(id) {
        try {
            const response = await fetch(`${this.apiUrl}/specs/${id}`);
            const spec = await response.json();
            
            if (spec) {
                const iframe = document.querySelector('iframe');
                const rapidocElement = iframe.contentDocument.querySelector('rapi-doc');
                
                // Set the spec-url to the raw file endpoint
                const rawFileUrl = `${this.apiUrl}/file/raw/${spec.file_path}`;
                console.log('Raw file URL:', rawFileUrl); // Debug log
                rapidocElement.setAttribute('spec-url', rawFileUrl);

                // Close the file manager modal
                this.fileManagerModal.hide();
            }
        } catch (error) {
            alert(`Error loading file: ${error.message}`);
        }
    }

    async duplicateFile(id) {
        try {
            // Get the original file data
            const response = await fetch(`${this.apiUrl}/specs/${id}`);
            const originalFile = await response.json();
            
            // Pre-fill the form with original data
            const form = document.getElementById('fileEditForm');
            form.fileName.value = `${originalFile.name} (Copy)`;
            form.filePath.value = originalFile.file_path;
            form.fileDescription.value = originalFile.description;
            
            // Get the file content
            const contentResponse = await fetch(`${this.apiUrl}/file/raw/${originalFile.file_path}`);
            const content = await contentResponse.blob();
            
            // Create a new file object
            const newFile = new File([content], originalFile.file_path, {
                type: 'application/x-yaml'
            });
            
            // Store the file for later use
            this.currentFile = newFile;
            this.currentEditId = null; // Ensure we're creating a new file
            
            // Show the edit modal
            const modalTitle = document.getElementById('fileEditModalLabel');
            modalTitle.textContent = 'Duplicate Specification';
            this.fileEditModal.show();
        } catch (error) {
            alert(`Error duplicating file: ${error.message}`);
        }
    }
}

// Initialize and expose to window for button onclick handlers
window.fileManager = new FileManager();