import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export type DetectedType = 'string' | 'number' | 'date' | 'boolean' | 'email';

export interface ValidationError {
  row: number; // 2-indexed row (header is row 1)
  column?: string;
  type: 'missing' | 'mismatch' | 'duplicate';
  description: string;
}

/**
 * Unified parser for CSV and Excel files.
 */
export function parseFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const name = file.name.toLowerCase();
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          resolve(rows);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    } else {
      // Default to CSV
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (results) => {
            resolve(results.data);
          },
          error: (err) => {
            reject(err);
          }
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    }
  });
}

/**
 * Silently detects each column's dominant data type based on non-empty sample cells.
 */
export function detectColumnTypes(rows: any[]): Record<string, DetectedType> {
  if (!rows || rows.length === 0) return {};
  const columns = Object.keys(rows[0]);
  const detected: Record<string, DetectedType> = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const booleanValues = new Set(['true', 'false', 'yes', 'no', '1', '0']);

  for (const col of columns) {
    const samples: any[] = [];
    for (const row of rows) {
      const val = row[col];
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        samples.push(val);
        if (samples.length >= 50) break; // Sample size limit of 50
      }
    }

    if (samples.length === 0) {
      detected[col] = 'string';
      continue;
    }

    let emailCount = 0;
    let booleanCount = 0;
    let numberCount = 0;
    let dateCount = 0;

    for (const s of samples) {
      const strVal = String(s).trim();
      
      // Email
      if (emailRegex.test(strVal)) {
        emailCount++;
        continue;
      }

      // Boolean
      if (typeof s === 'boolean' || booleanValues.has(strVal.toLowerCase())) {
        booleanCount++;
        continue;
      }

      // Number coercion check (strip typical currency symbols and commas)
      const cleaned = strVal.replace(/[$,€,£,¥]/g, '').replace(/,/g, '').trim();
      const isNum = !isNaN(Number(cleaned)) && cleaned !== '';
      if (typeof s === 'number' || isNum) {
        numberCount++;
        continue;
      }

      // Date
      const parsedDate = Date.parse(strVal);
      const isDate = !isNaN(parsedDate) && isNaN(Number(strVal)) && strVal.length > 4;
      if (isDate) {
        dateCount++;
        continue;
      }
    }

    const total = samples.length;
    if (emailCount / total > 0.7) {
      detected[col] = 'email';
    } else if (booleanCount / total > 0.7) {
      detected[col] = 'boolean';
    } else if (numberCount / total > 0.7) {
      detected[col] = 'number';
    } else if (dateCount / total > 0.7) {
      detected[col] = 'date';
    } else {
      detected[col] = 'string';
    }
  }

  return detected;
}

/**
 * Validates the parsed rows against the detected schema types.
 */
export function validateDataset(rows: any[], types: Record<string, DetectedType>): ValidationError[] {
  const errors: ValidationError[] = [];
  const seenRows = new Set<string>();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const booleanValues = new Set(['true', 'false', 'yes', 'no', '1', '0']);

  rows.forEach((row, rowIndex) => {
    const rowNum = rowIndex + 2; // header is row 1
    
    // Check duplicate rows
    const rowKey = JSON.stringify(row);
    if (seenRows.has(rowKey)) {
      errors.push({
        row: rowNum,
        type: 'duplicate',
        description: `This row is a duplicate of an earlier record.`
      });
    } else {
      seenRows.add(rowKey);
    }

    // Check each column according to detected types
    Object.keys(types).forEach((col) => {
      const val = row[col];
      const type = types[col];

      // Missing cell check
      if (val === undefined || val === null || String(val).trim() === '') {
        errors.push({
          row: rowNum,
          column: col,
          type: 'missing',
          description: `Value is missing for column "${col}".`
        });
        return;
      }

      const strVal = String(val).trim();

      // Type mismatch checks
      if (type === 'number') {
        const cleaned = strVal.replace(/[$,€,£,¥]/g, '').replace(/,/g, '').trim();
        const isNum = !isNaN(Number(cleaned)) && cleaned !== '';
        if (!isNum) {
          errors.push({
            row: rowNum,
            column: col,
            type: 'mismatch',
            description: `"${val}" is not a valid numerical value.`
          });
        }
      } else if (type === 'date') {
        const parsedDate = Date.parse(strVal);
        const isDate = !isNaN(parsedDate) && isNaN(Number(strVal)) && strVal.length > 4;
        if (!isDate) {
          errors.push({
            row: rowNum,
            column: col,
            type: 'mismatch',
            description: `"${val}" is not a valid date format.`
          });
        }
      } else if (type === 'email') {
        if (!emailRegex.test(strVal)) {
          errors.push({
            row: rowNum,
            column: col,
            type: 'mismatch',
            description: `"${val}" is not a valid email address.`
          });
        }
      } else if (type === 'boolean') {
        if (typeof val !== 'boolean' && !booleanValues.has(strVal.toLowerCase())) {
          errors.push({
            row: rowNum,
            column: col,
            type: 'mismatch',
            description: `"${val}" is not a valid true/false value.`
          });
        }
      }
    });
  });

  return errors;
}

/**
 * Coerces and cleans the dataset automatically (removes duplicates, resolves mismatches and missing values).
 */
export function cleanDataset(rows: any[], types: Record<string, DetectedType>): any[] {
  // 1. Remove duplicate rows keeping the first occurrence
  const uniqueRows: any[] = [];
  const seenKeys = new Set<string>();
  
  rows.forEach((row) => {
    const key = JSON.stringify(row);
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueRows.push({ ...row });
    }
  });

  // 2. Compute column-wise fallbacks (Averages for numbers, Modes/Most-Common for others)
  const columnFallbacks: Record<string, any> = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const booleanValues = new Set(['true', 'false', 'yes', 'no', '1', '0']);

  Object.keys(types).forEach((col) => {
    const type = types[col];
    const validValues: any[] = [];

    uniqueRows.forEach((row) => {
      const val = row[col];
      if (val === undefined || val === null || String(val).trim() === '') return;

      const strVal = String(val).trim();

      if (type === 'number') {
        const cleaned = strVal.replace(/[$,€,£,¥]/g, '').replace(/,/g, '').trim();
        const num = Number(cleaned);
        if (!isNaN(num) && cleaned !== '') {
          validValues.push(num);
        }
      } else if (type === 'date') {
        const parsedDate = Date.parse(strVal);
        const isDate = !isNaN(parsedDate) && isNaN(Number(strVal)) && strVal.length > 4;
        if (isDate) {
          validValues.push(strVal);
        }
      } else if (type === 'email') {
        if (emailRegex.test(strVal)) {
          validValues.push(strVal);
        }
      } else if (type === 'boolean') {
        if (typeof val === 'boolean') {
          validValues.push(val);
        } else if (booleanValues.has(strVal.toLowerCase())) {
          validValues.push(strVal.toLowerCase() === 'true' || strVal.toLowerCase() === 'yes' || strVal.toLowerCase() === '1');
        }
      } else {
        validValues.push(strVal);
      }
    });

    if (type === 'number') {
      if (validValues.length > 0) {
        const sum = validValues.reduce((acc, v) => acc + v, 0);
        columnFallbacks[col] = sum / validValues.length;
      } else {
        columnFallbacks[col] = 0;
      }
    } else {
      if (validValues.length > 0) {
        const counts: Record<string, number> = {};
        let maxVal = validValues[0];
        let maxCount = 0;
        validValues.forEach((v) => {
          const key = String(v);
          counts[key] = (counts[key] || 0) + 1;
          if (counts[key] > maxCount) {
            maxCount = counts[key];
            maxVal = v;
          }
        });
        columnFallbacks[col] = maxVal;
      } else {
        if (type === 'date') {
          columnFallbacks[col] = new Date().toISOString().slice(0, 10);
        } else if (type === 'boolean') {
          columnFallbacks[col] = false;
        } else if (type === 'email') {
          columnFallbacks[col] = 'info@company.com';
        } else {
          columnFallbacks[col] = 'N/A';
        }
      }
    }
  });

  // 3. Coerce values or fill with fallbacks
  const cleanedRows = uniqueRows.map((row) => {
    const cleanedRow = { ...row };

    Object.keys(types).forEach((col) => {
      const val = row[col];
      const type = types[col];
      const fallback = columnFallbacks[col];

      if (val === undefined || val === null || String(val).trim() === '') {
        cleanedRow[col] = fallback;
        return;
      }

      const strVal = String(val).trim();

      if (type === 'number') {
        const cleaned = strVal.replace(/[$,€,£,¥]/g, '').replace(/,/g, '').trim();
        const num = Number(cleaned);
        if (!isNaN(num) && cleaned !== '') {
          cleanedRow[col] = num;
        } else {
          cleanedRow[col] = fallback;
        }
      } else if (type === 'date') {
        const parsedDate = Date.parse(strVal);
        const isDate = !isNaN(parsedDate) && isNaN(Number(strVal)) && strVal.length > 4;
        if (isDate) {
          cleanedRow[col] = strVal;
        } else {
          cleanedRow[col] = fallback;
        }
      } else if (type === 'email') {
        if (emailRegex.test(strVal)) {
          cleanedRow[col] = strVal;
        } else {
          cleanedRow[col] = fallback;
        }
      } else if (type === 'boolean') {
        if (typeof val === 'boolean') {
          cleanedRow[col] = val;
        } else if (booleanValues.has(strVal.toLowerCase())) {
          cleanedRow[col] = strVal.toLowerCase() === 'true' || strVal.toLowerCase() === 'yes' || strVal.toLowerCase() === '1';
        } else {
          cleanedRow[col] = fallback;
        }
      } else {
        cleanedRow[col] = strVal;
      }
    });

    return cleanedRow;
  });

  return cleanedRows;
}
