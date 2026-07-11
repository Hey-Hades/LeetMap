import fs from 'fs';

async function buildDatabase() {
  console.log("Fetching company list...");
  const repoUrl = 'https://api.github.com/repos/liquidslr/leetcode-company-wise-problems/contents';
  
  const headers = {
    'User-Agent': 'LeetMap-Builder'
  };

  const response = await fetch(repoUrl, { headers });
  const data = await response.json();
  
  const folders = data.filter(item => item.type === 'dir' && !item.name.startsWith('.'));
  const database = [];

  for (let i = 0; i < folders.length; i++) {
    const name = folders[i].name;
    console.log(`[${i + 1}/${folders.length}] Scraping ${name}...`);
    
    try {
      const csvUrl = `https://raw.githubusercontent.com/liquidslr/leetcode-company-wise-problems/main/${encodeURIComponent(name)}/5.%20All.csv`;
      const csvRes = await fetch(csvUrl);
      const csvText = await csvRes.text();
      
      const lines = csvText.split('\n');
      let easy = 0, med = 0, hard = 0;
      
      lines.forEach(line => {
        if (line.includes('EASY')) easy++;
        if (line.includes('MEDIUM')) med++;
        if (line.includes('HARD')) hard++;
      });
      
      const hue = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;

      database.push({
        id: String(i + 1),
        name: name,
        slug: name,
        problemCount: easy + med + hard,
        easy,
        med,
        hard,
        color: `hsl(${hue}, 40%, 60%)`,
        init: name.charAt(0).toUpperCase()
      });
      
    } catch (err) {
      console.log(`Failed to parse ${name}`);
    }
  }

  fs.writeFileSync('src/services/companies.json', JSON.stringify(database, null, 2));
  console.log("✅ Done! Real data saved to src/services/companies.json");
}

buildDatabase();