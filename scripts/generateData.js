import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const folderName = process.argv[2];

if (!folderName) {
    console.error('❌ Error: Please provide a folder name as an argument');
    console.log('Usage: node script.js <folderName>');
    process.exit(1);
}


function parseMarkdownData(markdownContent) {
    const result = [];
    const lines = markdownContent.split('\n');

    // Regex patterns matching your Python script
    const taskRegexp = /^\s*\*\s+(`.*`)\s+-\s+(.*)$/;
    const categoryRegexp = /^##\s(.*)$/;

    let currentCategory = "";

    for (const line of lines) {
        const taskMatch = taskRegexp.exec(line);

        if (taskMatch) {
            // Parse answers
            let answersString = taskMatch[1];
            answersString = answersString.replace(/```/g, '').replace(/``/g, '');

            const answers = answersString.split(', ').map(answer => {
                const trimmed = answer.trim();
                if (trimmed.startsWith('`') && trimmed.endsWith('`')) {
                    return trimmed.slice(1, -1).trim();
                }
                return trimmed;
            });

            const question = taskMatch[2];
            result.push({
                category: currentCategory,
                question: question,
                solution: answers
            });
        } else {
            const categoryMatch = categoryRegexp.exec(line);
            if (categoryMatch) {
                currentCategory = categoryMatch[1];
            }
        }
    }

    return result;
}

function generateDataFromMarkdown() {
    try {
        // Read the markdown file
        const markdownPath = path.join(__dirname, '..', 'vim-cheatsheet.md');
        const markdownContent = fs.readFileSync(markdownPath, 'utf-8');

        // Parse the markdown content
        const quizData = parseMarkdownData(markdownContent);

        // Ensure the src directory exists
        const srcDir = path.join(__dirname, '..', folderName, 'src');
        if (!fs.existsSync(srcDir)) {
            fs.mkdirSync(srcDir, { recursive: true });
        }

        // Write the parsed data to a JSON file
        const outputPath = path.join(srcDir, 'data.json');
        fs.writeFileSync(outputPath, JSON.stringify(quizData, null, 2));

        console.log(`✅ Generated ${quizData.length} quiz questions from markdown file`);
        console.log(`📝 Data written to: ${outputPath}`);

        // Log some statistics
        const categories = [...new Set(quizData.map(q => q.category))];
        console.log(`📚 Categories found: ${categories.length}`);
        categories.forEach(cat => {
            const count = quizData.filter(q => q.category === cat).length;
            console.log(`   - ${cat}: ${count} questions`);
        });

    } catch (error) {
        console.error('❌ Error generating data from markdown:', error);
        process.exit(1);
    }
}

generateDataFromMarkdown();
