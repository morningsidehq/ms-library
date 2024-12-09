// Catalog Entry Template Generator
function generateEntryHTML(asset) {
    return `
        <div class="featured-item" data-msoid="${asset.msoid}">
            <img src="${asset.thumbnailUrl}" alt="${asset.title}" class="featured-image">
            <div>
                <h3>${asset.title}</h3>
                <p class="metadata">
                    DOCUMENT SET.............: ${asset.documentSet}<br>
                    CLASSIFICATION..........: ${asset.classification}<br>
                    DATE RANGE..............: ${asset.dateRange.start} to ${asset.dateRange.end}<br>
                    MEDIUM..................: ${asset.medium.join(', ')}<br>
                    PROVENANCE..............: ${asset.provenance}<br>
                    CONDITION...............: ${asset.condition.status}<br>
                    DIGITIZATION SPEC.......: ${asset.digitization.equipment}<br>
                    DIGITIZATION DATE.......: ${formatDateRange(asset.digitization.date)}<br>
                    OPERATOR................: ${asset.digitization.operator}<br>
                    STORAGE LOCATION........: ${asset.storage.physical.location} ${asset.storage.physical.container}<br>
                    DIGITAL FORMAT..........: ${asset.digitization.format}<br>
                    MSOID...................: ${asset.msoid}<br>
                    PRESERVATION STATUS.....: ${asset.preservationStatus}<br>
                    ACCESS LEVEL............: ${asset.accessLevel}
                </p>
                <table class="technical-specs">
                    <tr>
                        <td>DIGITAL CHECKSUM:</td>
                        <td>${asset.storage.digital.checksum}</td>
                    </tr>
                    <tr>
                        <td>STORAGE REQUIREMENTS:</td>
                        <td>${asset.storage.digital.size}</td>
                    </tr>
                    <tr>
                        <td>COLLECTION STATUS:</td>
                        <td>${asset.preservationStatus}</td>
                    </tr>
                </table>
                <a href="${asset.url}" target="_blank">ACCESS DIGITAL COLLECTION</a>
            </div>
        </div>
    `;
}

// Helper function to format date ranges
function formatDateRange(dateRange) {
    const start = new Date(dateRange.start).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    const end = new Date(dateRange.end).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    return `${start} - ${end}`;
}

// Load and display catalog entries
async function loadCatalog() {
    try {
        const response = await fetch('/data/assets.json');
        const data = await response.json();
        
        const catalogContainer = document.getElementById('catalogEntries');
        catalogContainer.innerHTML = ''; // Clear loading message
        
        data.assets.forEach(asset => {
            catalogContainer.innerHTML += generateEntryHTML(asset);
        });
    } catch (error) {
        console.error('Error loading catalog:', error);
        document.getElementById('catalogEntries').innerHTML = 
            '<div class="error-message">ERROR: UNABLE TO LOAD CATALOG DATA</div>';
    }
}

// Search functionality
function searchCatalog(query) {
    const entries = document.querySelectorAll('.featured-item');
    const searchTerm = query.toLowerCase();
    
    entries.forEach(entry => {
        const text = entry.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            entry.style.display = 'flex';
        } else {
            entry.style.display = 'none';
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadCatalog();
    
    const searchInput = document.getElementById('catalogSearch');
    const searchButton = document.getElementById('searchButton');
    
    searchButton.addEventListener('click', () => {
        searchCatalog(searchInput.value);
    });
    
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchCatalog(searchInput.value);
        }
    });
}); 