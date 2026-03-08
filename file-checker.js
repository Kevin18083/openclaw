const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const workspace = 'C:\\Users\\17589\\.openclaw\\workspace';
const logsDir = 'C:\\Users\\17589\\.openclaw\\logs';
const memoryDir = 'C:\\Users\\17589\\.openclaw\\workspace\\memory';

const results = {
  timestamp: new Date().toISOString(),
  summary: {
    totalFiles: 0,
    checkedFiles: 0,
    jsonFiles: 0,
    jsonValid: 0,
    jsonInvalid: [],
    jsFiles: 0,
    jsValid: 0,
    jsInvalid: [],
    mdFiles: 0,
    mdValid: 0,
    mdIssues: [],
    batFiles: 0,
    batIssues: [],
    shFiles: 0,
    shIssues: [],
    pyFiles: 0,
    pyIssues: [],
    encodingIssues: [],
    pathIssues: [],
    configIssues: []
  },
  details: []
};

function checkFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const relPath = path.relative(workspace, filePath);
  
  results.summary.totalFiles++;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    results.summary.checkedFiles++;
    
    // Check encoding (look for replacement characters or invalid sequences)
    if (content.includes('\uFFFD')) {
      results.summary.encodingIssues.push({ file: relPath, issue: 'Contains replacement characters (possible encoding issue)' });
    }
    
    // JSON validation
    if (ext === '.json') {
      results.summary.jsonFiles++;
      try {
        JSON.parse(content);
        results.summary.jsonValid++;
        results.details.push({ file: relPath, type: 'json', status: 'valid' });
      } catch (e) {
        results.summary.jsonInvalid.push({ file: relPath, error: e.message });
        results.details.push({ file: relPath, type: 'json', status: 'invalid', error: e.message });
      }
    }
    
    // JavaScript syntax check
    if (ext === '.js' || ext === '.jsx' || ext === '.mjs') {
      results.summary.jsFiles++;
      try {
        execSync(`node --check "${filePath}"`, { stdio: 'pipe' });
        results.summary.jsValid++;
        results.details.push({ file: relPath, type: 'javascript', status: 'valid' });
      } catch (e) {
        const error = e.stderr ? e.stderr.toString() : e.message;
        results.summary.jsInvalid.push({ file: relPath, error: error.substring(0, 200) });
        results.details.push({ file: relPath, type: 'javascript', status: 'invalid', error: error.substring(0, 200) });
      }
    }
    
    // Markdown basic check
    if (ext === '.md') {
      results.summary.mdFiles++;
      // Check for basic markdown structure
      const hasContent = content.trim().length > 0;
      const hasHeaders = /^#{1,6}\s+/m.test(content);
      
      if (!hasContent) {
        results.summary.mdIssues.push({ file: relPath, issue: 'Empty file' });
      } else {
        results.summary.mdValid++;
      }
      results.details.push({ file: relPath, type: 'markdown', status: hasContent ? 'valid' : 'empty' });
    }
    
    // Batch file basic check
    if (ext === '.bat' || ext === '.cmd') {
      results.summary.batFiles++;
      // Check for basic batch structure
      if (!content.includes('@echo') && !content.includes('echo')) {
        // Not necessarily an issue, just noting
      }
      // Check for obvious syntax issues
      if (content.includes('()') && !content.includes('if') && !content.includes('for')) {
        results.summary.batIssues.push({ file: relPath, issue: 'Possible unbalanced parentheses' });
      }
      results.details.push({ file: relPath, type: 'batch', status: 'checked' });
    }
    
    // Shell script basic check
    if (ext === '.sh') {
      results.summary.shFiles++;
      // Check for shebang
      if (!content.startsWith('#!')) {
        results.summary.shIssues.push({ file: relPath, issue: 'Missing shebang' });
      }
      results.details.push({ file: relPath, type: 'shell', status: 'checked' });
    }
    
    // Python file basic check
    if (ext === '.py') {
      results.summary.pyFiles++;
      try {
        execSync(`python -m py_compile "${filePath}"`, { stdio: 'pipe' });
        results.details.push({ file: relPath, type: 'python', status: 'valid' });
      } catch (e) {
        const error = e.stderr ? e.stderr.toString() : e.message;
        results.summary.pyIssues.push({ file: relPath, error: error.substring(0, 200) });
        results.details.push({ file: relPath, type: 'python', status: 'invalid', error: error.substring(0, 200) });
      }
    }
    
    // Check for path references (basic check for common patterns)
    if (ext === '.js' || ext === '.json' || ext === '.md') {
      // Check for Windows path issues (mixed slashes)
      const mixedSlashes = /C:\\[^"]*\//.test(content);
      if (mixedSlashes) {
        // This is just informational, not necessarily an error
      }
    }
    
  } catch (e) {
    results.details.push({ file: relPath, type: 'unknown', status: 'error', error: e.message.substring(0, 200) });
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    // Skip node_modules
    if (file === 'node_modules') return;
    
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else {
      checkFile(filePath);
    }
  });
}

console.log('Starting file system check...');
console.log('Checking workspace:', workspace);

// Check workspace
walkDir(workspace);

// Check logs directory
if (fs.existsSync(logsDir)) {
  console.log('Checking logs directory:', logsDir);
  const logFiles = fs.readdirSync(logsDir);
  logFiles.forEach(file => {
    const filePath = path.join(logsDir, file);
    if (fs.statSync(filePath).isFile()) {
      checkFile(filePath);
    }
  });
}

// Check memory directory
if (fs.existsSync(memoryDir)) {
  console.log('Checking memory directory:', memoryDir);
  // Already checked in workspace walk
}

console.log('\nCheck complete!');
console.log('Summary:', JSON.stringify(results.summary, null, 2));

// Write results
const resultPath = path.join(logsDir, 'jack-file-check-result.json');
fs.writeFileSync(resultPath, JSON.stringify(results, null, 2));
console.log('\nResults written to:', resultPath);
