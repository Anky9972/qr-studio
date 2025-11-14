// Google Sheets Integration for QR Studio

/**
 * Fetches data from a public Google Sheets URL
 * @param {string} sheetUrl - The Google Sheets URL (must be publicly accessible)
 * @returns {Promise<Array>} - Array of row objects
 */
export async function fetchGoogleSheetData(sheetUrl) {
  try {
    // Extract sheet ID from URL
    const sheetIdMatch = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!sheetIdMatch) {
      throw new Error('Invalid Google Sheets URL');
    }
    
    const sheetId = sheetIdMatch[1];
    
    // Extract gid (sheet tab) if present
    const gidMatch = sheetUrl.match(/gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : '0';
    
    // Construct CSV export URL
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    
    // Fetch the CSV data
    const response = await fetch(csvUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'text/csv'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch sheet data. Make sure the sheet is publicly accessible.');
    }
    
    const csvText = await response.text();
    
    // Parse CSV
    const lines = csvText.split('\n');
    if (lines.length < 2) {
      throw new Error('Sheet appears to be empty');
    }
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = parseCSVLine(lines[i]);
      const row = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      data.push(row);
    }
    
    return data;
  } catch (error) {
    console.error('Google Sheets fetch error:', error);
    throw error;
  }
}

/**
 * Parses a CSV line handling quoted values
 * @param {string} line - CSV line
 * @returns {Array<string>} - Array of values
 */
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values;
}

/**
 * Validates if a URL is a valid Google Sheets URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
export function isValidGoogleSheetsUrl(url) {
  return /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/.test(url);
}

/**
 * Generates a shareable link instruction
 * @returns {string} - Instructions for making sheet public
 */
export function getShareInstructions() {
  return `To use Google Sheets integration:
1. Open your Google Sheet
2. Click "Share" button (top right)
3. Click "Change to anyone with the link"
4. Set permission to "Viewer"
5. Click "Copy link"
6. Paste the link here`;
}
