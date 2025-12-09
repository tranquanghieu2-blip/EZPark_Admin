const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Script để convert Excel file sang JSON
// Chạy: node scripts/convert-inappropriate-words.js

const excelFilePath = path.join(__dirname, '../public/inappropriate-words.xlsx');
const jsonFilePath = path.join(__dirname, '../public/inappropriate-words.json');

try {
  // Đọc file Excel
  const workbook = XLSX.readFile(excelFilePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert sang JSON
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  // Lọc các hàng trống và lấy từ ở cột đầu tiên
  const words = data
    .map(row => row[0])
    .filter(word => word && typeof word === 'string' && word.trim() !== '')
    .map(word => word.trim());
  
  // Ghi ra file JSON
  const jsonData = {
    words: words,
    lastUpdated: new Date().toISOString()
  };
  
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
  
  console.log(`✅ Successfully converted ${words.length} words from Excel to JSON`);
  console.log(`📁 JSON file saved at: ${jsonFilePath}`);
  
} catch (error) {
  console.error('❌ Error converting Excel to JSON:', error.message);
  process.exit(1);
}
