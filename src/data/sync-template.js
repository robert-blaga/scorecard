import chokidar from 'chokidar';
import path from 'path';
import { promises as fs } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_FILE = 'template.json';
const JSON_EXT = '.json';

// Deep merge objects without overwriting existing values
function deepMergeTemplate(template, target) {
    // Handle null or non-object target
    if (!target || typeof target !== 'object') {
        return JSON.parse(JSON.stringify(template));
    }

    // Create a new object with template as base
    const merged = JSON.parse(JSON.stringify(template));
    
    // Merge existing values from target
    for (const key in target) {
        if (key in template) {
            if (
                template[key] && typeof template[key] === 'object' &&
                !Array.isArray(template[key]) &&
                target[key] && typeof target[key] === 'object' &&
                !Array.isArray(target[key])
            ) {
                // Recursively merge nested objects
                merged[key] = deepMergeTemplate(template[key], target[key]);
            } else {
                // Keep target's value for existing fields
                merged[key] = target[key];
            }
        } else {
            // Keep any additional fields from target
            merged[key] = target[key];
        }
    }
    
    return merged;
}

// Format file path for logging
function formatPath(filePath) {
    return chalk.cyan(path.basename(filePath));
}

// Main sync function
async function syncWithTemplate(templatePath, changedFile = null) {
    try {
        // Read template
        const templateContent = await fs.readFile(templatePath, 'utf8');
        const template = JSON.parse(templateContent);
        
        // Get all JSON files in directory
        const dir = path.dirname(templatePath);
        const files = await fs.readdir(dir);
        const jsonFiles = files.filter(file => 
            path.extname(file) === JSON_EXT && 
            file !== TEMPLATE_FILE &&
            !file.startsWith('.')
        );
        
        // Process each JSON file
        for (const file of jsonFiles) {
            const filePath = path.join(dir, file);
            
            try {
                // Read and parse JSON file
                const content = await fs.readFile(filePath, 'utf8');
                const json = JSON.parse(content);
                
                // Merge with template
                const merged = deepMergeTemplate(template, json);
                
                // Check if anything changed
                if (JSON.stringify(merged) !== JSON.stringify(json)) {
                    // Write back if changed
                    await fs.writeFile(filePath, JSON.stringify(merged, null, 2));
                    console.log(chalk.green(`✓ Updated ${formatPath(file)} with template structure`));
                } else {
                    console.log(chalk.gray(`• ${formatPath(file)} already in sync`));
                }
            } catch (err) {
                console.error(chalk.red(`✗ Error processing ${formatPath(file)}:`), err.message);
            }
        }
        
        if (changedFile) {
            console.log(chalk.yellow(`\nTemplate sync triggered by changes to ${formatPath(changedFile)}`));
        }
    } catch (err) {
        console.error(chalk.red('✗ Template sync failed:'), err.message);
    }
}

// Watch template file for changes
const watcher = chokidar.watch(TEMPLATE_FILE, {
    cwd: __dirname,
    ignoreInitial: false,
    persistent: true
});

// Handle template changes
watcher.on('change', (changedFile) => {
    console.log(chalk.yellow('\nTemplate changed, syncing all files...'));
    syncWithTemplate(path.join(__dirname, TEMPLATE_FILE), changedFile);
});

// Handle initial run
watcher.on('ready', () => {
    console.log(chalk.blue('\nWatching for template changes...'));
});

// Handle errors
watcher.on('error', (error) => {
    console.error(chalk.red('✗ Watch error:'), error.message);
});

// Clean up on exit
process.on('SIGINT', () => {
    watcher.close().then(() => {
        console.log(chalk.blue('\nStopped watching template'));
        process.exit(0);
    });
}); 