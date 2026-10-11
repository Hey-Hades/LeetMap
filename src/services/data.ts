import Papa from 'papaparse';
import type { Company, Problem } from '../types';

// 1. IMPORT LOCAL DATABASE
import companiesData from './companies.json';

// 2. INSTANT LOAD FOR HOME PAGE
export const getCompanies = async (): Promise<Company[]> => {
  return companiesData as Company[];
};

/**
 * Normalizes company name into a filesystem & URL-safe key
 */
export const getSafeKey = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
};

// 3. FETCH FOR INDIVIDUAL COMPANY PAGES
// Checks pre-scraped static dataset first for instant load, with seamless fallback to live GitHub raw CSV
export const getProblemsForCompany = async (companyName: string, timeFile: string = '5. All.csv'): Promise<Problem[]> => {
  const safeKey = getSafeKey(companyName);

  // Strategy A: Load from pre-scraped local static JSON (Fastest & most reliable)
  try {
    const localRes = await fetch(`/data/companies/${safeKey}.json`);
    if (localRes.ok) {
      const data = await localRes.json();
      if (data?.problems && Array.isArray(data.problems[timeFile])) {
        return data.problems[timeFile];
      }
    }
  } catch {
    // If not found or failed, continue to fallback below
  }

  // Strategy B: Fallback live fetch from raw GitHub CSV
  const safeName = encodeURIComponent(companyName);
  const safeFile = encodeURIComponent(timeFile);
  const url = `https://raw.githubusercontent.com/liquidslr/leetcode-company-wise-problems/main/${safeName}/${safeFile}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not fetch data for ${companyName}`);
    
    const csvText = await response.text();

    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<Record<string, unknown>>) => {
          const problems: Problem[] = results.data.map((row, index) => ({
            id: index + 1, 
            title: String(row['Title'] || 'Unknown Problem'),
            difficulty: String(row['Difficulty'] || 'Medium'),
            frequency: Math.round(parseFloat(String(row['Frequency']))) || 0,
            url: String(row['Link'] || '#'),
            topics: row['Topics'] ? String(row['Topics']).split(',').map(t => t.trim()).filter(Boolean) : []
          }));
          resolve(problems);
        },
        error: (error: Error) => {
          console.error("Error parsing CSV:", error);
          resolve([]); 
        }
      });
    });
  } catch (error) {
    console.error(error);
    return []; 
  }
};