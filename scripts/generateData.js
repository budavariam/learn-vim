import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// One shared output for every app (they import it through the `@data` alias). It stays
// committed at this path because the Neovim plugin reads it from the repo checkout.
export const OUTPUT_PATH = path.join(__dirname, '..', 'ui-cheatsheet', 'src', 'data.json');

function generateId(obj) {
  const str = JSON.stringify(obj);
  return crypto.createHash('sha256').update(str).digest('hex').slice(0, 12);
}


function parseMarkdownData(markdownContent) {
    const result = [];
    const lines = markdownContent.split('\n');

    // Regex patterns
    // Format: * LEVEL - `cmd1`, `cmd2` - description
    const taskRegexp = /^\s*\*\s+(\d+)\s+-\s+(`.*`)\s+-\s+(.*)$/;
    // Fallback for entries without a level number (backwards-compatible)
    const taskRegexpNoLevel = /^\s*\*\s+(`.*`)\s+-\s+(.*)$/;
    const categoryRegexp = /^##\s(.*)$/;

    let currentCategory = "";

    for (const line of lines) {
        const taskMatch = taskRegexp.exec(line);
        const taskMatchNoLevel = !taskMatch && taskRegexpNoLevel.exec(line);

        if (taskMatch || taskMatchNoLevel) {
            // Parse answers
            let answersString = taskMatch ? taskMatch[2] : taskMatchNoLevel[1];
            answersString = answersString.replace(/```/g, '').replace(/``/g, '');

            const answers = answersString.split(', ').map(answer => {
                const trimmed = answer.trim();
                if (trimmed.startsWith('`') && trimmed.endsWith('`')) {
                    return trimmed.slice(1, -1).trim();
                }
                return trimmed;
            });

            const level = taskMatch ? parseInt(taskMatch[1], 10) : 0;
            const question = taskMatch ? taskMatch[3] : taskMatchNoLevel[2];
            const item = {
                category: currentCategory,
                question: question,
                solution: answers
            }
            item.id = generateId(item);
            item.level = level;
            result.push(item);
        } else {
            const categoryMatch = categoryRegexp.exec(line);
            if (categoryMatch) {
                currentCategory = categoryMatch[1];
            }
        }
    }

    return result;
}

export function generateDataFromMarkdown() {
    try {
        // Read the markdown file
        const markdownPath = path.join(__dirname, '..', 'vim-cheatsheet.md');
        const markdownContent = fs.readFileSync(markdownPath, 'utf-8');

        // Parse the markdown content
        const quizData = parseMarkdownData(markdownContent);

        // Write the parsed data to a JSON file
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(quizData, null, 2));

        console.log(`✅ Generated ${quizData.length} quiz questions from markdown file`);
        console.log(`📝 Data written to: ${OUTPUT_PATH}`);

        // Log some statistics
        const categories = [...new Set(quizData.map(q => q.category))];
        console.log(`📚 Categories found: ${categories.length}`);
        categories.forEach(cat => {
            const count = quizData.filter(q => q.category === cat).length;
            console.log(`   - ${cat}: ${count} questions`);
        });

        return quizData;
    } catch (error) {
        console.error('❌ Error generating data from markdown:', error);
        throw error;
    }
}

// Run when invoked directly: `node scripts/generateData.js`
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    try {
        generateDataFromMarkdown();
    } catch {
        process.exit(1);
    }
}
