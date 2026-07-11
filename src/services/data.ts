import Papa from 'papaparse';
import type { Company, Problem } from '../types';

// 1. IMPORT YOUR BRAND NEW LOCAL DATABASE!
import companiesData from './companies.json';

// 2. INSTANT LOAD FOR HOME PAGE
export const getCompanies = async (): Promise<Company[]> => {
  // Just return the perfectly formatted local JSON. No API limits, instant load!
  return companiesData as Company[];
};

// 3. LIVE FETCH FOR INDIVIDUAL COMPANY PAGES (Loads on demand)
export const getProblemsForCompany = async (companyName: string, timeFile: string = '5. All.csv'): Promise<Problem[]> => {
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
        complete: (results) => {
          const problems = results.data.map((row: any, index) => ({
            id: index + 1, 
            title: row['Title'] || 'Unknown Problem',
            difficulty: row['Difficulty'] || 'Medium',
            frequency: Math.round(parseFloat(row['Frequency'])) || 0,
            url: row['Link'] || '#',
            // THIS IS THE MAGIC LINE: Grabbing the tags and cleaning up the spacing
            topics: row['Topics'] ? String(row['Topics']).split(',').map(t => t.trim()) : []
          }));
          resolve(problems);
        },
        error: (error: any) => {
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