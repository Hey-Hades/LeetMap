import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import Papa from 'papaparse';

const REPO_URL = 'https://github.com/liquidslr/leetcode-company-wise-problems.git';
const TEMP_DIR = path.resolve('.temp_scrape_source');
const OUTPUT_DATA_DIR = path.resolve('public/data/companies');
const COMPANIES_JSON_PATH = path.resolve('src/services/companies.json');

const TIME_FILES = [
  '1. Thirty Days.csv',
  '2. Three Months.csv',
  '3. Six Months.csv',
  '4. More Than Six Months.csv',
  '5. All.csv'
];

/**
 * Normalizes company name into a filesystem & URL-safe key
 */
export function getSafeKey(name) {
  return name.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
}

/**
 * Normalizes difficulty to capitalized form (Easy, Medium, Hard)
 */
function normalizeDifficulty(val) {
  if (!val) return 'Medium';
  const str = String(val).trim().toUpperCase();
  if (str.includes('EASY')) return 'Easy';
  if (str.includes('HARD')) return 'Hard';
  return 'Medium';
}

/**
 * Parse a single CSV file into Problem objects
 */
function parseCsvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.trim()) return [];

  const parsed = Papa.parse(content, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true
  });

  return parsed.data.map((row, index) => {
    let topics = [];
    if (row['Topics']) {
      topics = String(row['Topics'])
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
    }

    const freqRaw = row['Frequency'];
    const frequency = typeof freqRaw === 'number'
      ? Math.round(freqRaw)
      : Math.round(parseFloat(freqRaw) || 0);

    return {
      id: index + 1,
      title: row['Title'] || 'Unknown Problem',
      difficulty: normalizeDifficulty(row['Difficulty']),
      frequency: Number.isNaN(frequency) ? 0 : frequency,
      url: row['Link'] || '#',
      topics
    };
  });
}

/**
 * Main scraping function
 */
async function runScraper() {
  const args = process.argv.slice(2);
  const targetCompanyArg = args.find((_, i) => args[i - 1] === '--company') || null;
  const keepTemp = args.includes('--keep-temp');
  const cleanOnly = args.includes('--clean');

  if (cleanOnly) {
    if (fs.existsSync(TEMP_DIR)) {
      console.log('Cleaning up temporary directory...');
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }
    console.log('Done.');
    return;
  }

  const startTime = Date.now();
  console.log('==================================================');
  console.log('🗺️  LeetMap Automatic Questions Scraper');
  console.log('==================================================');

  // Step 1: Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DATA_DIR)) {
    fs.mkdirSync(OUTPUT_DATA_DIR, { recursive: true });
  }

  // Step 2: Clone or update source repo
  if (!fs.existsSync(TEMP_DIR)) {
    console.log(`📥 Shallow cloning source repo: ${REPO_URL}...`);
    execSync(`git clone --depth 1 ${REPO_URL} "${TEMP_DIR}"`, { stdio: 'inherit' });
  } else {
    console.log('🔄 Reusing existing clone in temp folder...');
    try {
      execSync(`git -C "${TEMP_DIR}" pull --depth 1`, { stdio: 'ignore' });
    } catch {
      // Ignore git pull errors if offline
    }
  }

  // Step 3: Discover companies
  let folders = fs.readdirSync(TEMP_DIR, { withFileTypes: true })
    .filter(item => item.isDirectory() && !item.name.startsWith('.'))
    .map(item => item.name);

  if (targetCompanyArg) {
    folders = folders.filter(name => name.toLowerCase() === targetCompanyArg.toLowerCase());
    if (folders.length === 0) {
      console.error(`❌ Company "${targetCompanyArg}" not found in source repository.`);
      process.exit(1);
    }
  }

  console.log(`📦 Processing ${folders.length} companies...`);

  // Load existing companies.json if doing a single company update
  let database = [];
  if (targetCompanyArg && fs.existsSync(COMPANIES_JSON_PATH)) {
    try {
      database = JSON.parse(fs.readFileSync(COMPANIES_JSON_PATH, 'utf8'));
    } catch {
      database = [];
    }
  }

  let totalQuestionsSaved = 0;

  for (let i = 0; i < folders.length; i++) {
    const name = folders[i];
    const companyFolderPath = path.join(TEMP_DIR, name);
    const safeKey = getSafeKey(name);

    const companyProblems = {};
    let allTimeCount = 0;
    let easy = 0;
    let med = 0;
    let hard = 0;

    for (const timeFile of TIME_FILES) {
      const csvPath = path.join(companyFolderPath, timeFile);
      const problems = parseCsvFile(csvPath);
      companyProblems[timeFile] = problems;

      if (timeFile === '5. All.csv') {
        allTimeCount = problems.length;
        problems.forEach(p => {
          if (p.difficulty === 'Easy') easy++;
          else if (p.difficulty === 'Medium') med++;
          else if (p.difficulty === 'Hard') hard++;
        });
      }
    }

    totalQuestionsSaved += allTimeCount;

    // Save company questions JSON
    const companyData = {
      name,
      slug: name,
      dataKey: safeKey,
      updatedAt: new Date().toISOString(),
      problems: companyProblems
    };

    const outJsonPath = path.join(OUTPUT_DATA_DIR, `${safeKey}.json`);
    fs.writeFileSync(outJsonPath, JSON.stringify(companyData, null, 2));

    const hue = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;

    const companyMeta = {
      id: String(i + 1),
      name,
      slug: name,
      dataKey: safeKey,
      problemCount: allTimeCount,
      easy,
      med,
      hard,
      color: `hsl(${hue}, 40%, 60%)`,
      init: name.charAt(0).toUpperCase()
    };

    if (targetCompanyArg) {
      const existingIdx = database.findIndex(c => c.name.toLowerCase() === name.toLowerCase());
      if (existingIdx >= 0) {
        database[existingIdx] = { ...database[existingIdx], ...companyMeta };
      } else {
        database.push(companyMeta);
      }
    } else {
      database.push(companyMeta);
    }

    if ((i + 1) % 50 === 0 || i === folders.length - 1) {
      console.log(`  [${i + 1}/${folders.length}] Saved questions for ${name}`);
    }
  }

  // Save updated companies list
  fs.writeFileSync(COMPANIES_JSON_PATH, JSON.stringify(database, null, 2));

  // Step 4: Cleanup
  if (!keepTemp && fs.existsSync(TEMP_DIR)) {
    console.log('🧹 Cleaning up temporary repository...');
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('==================================================');
  console.log(`✅ Scraping complete in ${duration}s!`);
  console.log(`📊 Total companies: ${database.length}`);
  console.log(`📝 Total problems indexed: ${totalQuestionsSaved}`);
  console.log(`📁 Questions stored in: public/data/companies/*.json`);
  console.log(`📄 Company index saved: src/services/companies.json`);
  console.log('==================================================');
}

runScraper().catch(err => {
  console.error('Scraping error:', err);
  process.exit(1);
});