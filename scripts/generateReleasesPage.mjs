/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '../');
const changelogPath = path.join(workspaceRoot, 'CHANGELOG.md');
const releasesPagePath = path.join(
  workspaceRoot,
  'docs/src/app/(public)/(content)/react/overview/releases/page.mdx'
);

/**
 * Parses CHANGELOG.md and extracts release sections
 * @param {string} changelogContent - Content of CHANGELOG.md
 * @returns {Array<{version: string, date: string, content: string}>}
 */
function parseChangelog(changelogContent) {
  const releases = [];

  // Split by release headers (## [version])
  const sections = changelogContent.split(/^## \[([^\]]+)\]/m);

  // Skip the first section (header/intro)
  for (let i = 1; i < sections.length; i += 2) {
    const version = sections[i];
    const content = sections[i + 1] || '';

    // Extract date (format: **Date**)
    const dateMatch = content.match(/^\*\*([^*]+)\*\*/);
    const date = dateMatch ? dateMatch[1].trim() : '';

    // Extract content after date (remove the date line)
    const contentStart = dateMatch
      ? content.indexOf('**', dateMatch.index + dateMatch[0].length) + 2
      : 0;
    let releaseContent = content.substring(contentStart).trim();

    // Remove leading newlines
    releaseContent = releaseContent.replace(/^\n+/, '');

    releases.push({ version, date, content: releaseContent });
  }

  return releases;
}

/**
 * Generates the releases page MDX content
 * @param {Array<{version: string, date: string, content: string}>} releases
 * @returns {string}
 */
function generateReleasesPage(releases) {
  const header = `# Releases

<Subtitle>Changelogs for each Anchor UI release.</Subtitle>
<Meta name="description" content="Changelogs for each Anchor UI release." />

`;

  const releasesContent = releases
    .map((release) => {
      const dateLine = release.date ? `**${release.date}**\n\n` : '';
      return `## [${release.version}]

${dateLine}${release.content}`;
    })
    .join('\n\n');

  return header + releasesContent;
}

try {
  // Read CHANGELOG.md
  if (!fs.existsSync(changelogPath)) {
    throw new Error(`CHANGELOG.md not found at ${changelogPath}`);
  }

  const changelogContent = fs.readFileSync(changelogPath, 'utf-8');
  const releases = parseChangelog(changelogContent);

  if (releases.length === 0) {
    console.warn('⚠️  No releases found in CHANGELOG.md');
    process.exit(0);
  }

  // Generate releases page
  const releasesPageContent = generateReleasesPage(releases);

  // Ensure directory exists
  const releasesPageDir = path.dirname(releasesPagePath);
  if (!fs.existsSync(releasesPageDir)) {
    fs.mkdirSync(releasesPageDir, { recursive: true });
  }

  // Write releases page
  fs.writeFileSync(releasesPagePath, releasesPageContent, 'utf-8');
  console.log(`✅ Generated releases page from CHANGELOG.md (${releases.length} releases)`);
} catch (error) {
  console.error('❌ Error generating releases page:', error.message);
  process.exit(1);
}

