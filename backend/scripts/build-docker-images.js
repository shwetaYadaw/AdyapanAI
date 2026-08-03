const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const languages = ['cpp', 'java', 'python', 'javascript'];
const dockerDir = path.join(__dirname, '..', 'docker');

console.log('🐳 Building Docker images for language runners...\n');

let successCount = 0;
let failCount = 0;

for (const lang of languages) {
  const langDir = path.join(dockerDir, lang);
  const dockerfile = path.join(langDir, 'Dockerfile');

  if (!fs.existsSync(dockerfile)) {
    console.log(`❌ Dockerfile not found for ${lang}`);
    failCount++;
    continue;
  }

  try {
    console.log(`📦 Building adyapan/runner-${lang}:latest...`);
    
    execSync(
      `docker build -t adyapan/runner-${lang}:latest -f "${dockerfile}" "${langDir}"`,
      { stdio: 'inherit', cwd: langDir }
    );

    console.log(`✅ Successfully built adyapan/runner-${lang}:latest\n`);
    successCount++;
  } catch (error) {
    console.log(`❌ Failed to build adyapan/runner-${lang}:latest\n`);
    failCount++;
  }
}

console.log('\n' + '='.repeat(50));
console.log(`✅ Success: ${successCount}/${languages.length}`);
console.log(`❌ Failed: ${failCount}/${languages.length}`);
console.log('='.repeat(50));

if (failCount > 0) {
  process.exit(1);
}
