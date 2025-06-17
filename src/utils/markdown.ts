import { BlogPost, MarkdownPreview } from '../types';
import yaml from 'js-yaml';

export function generateMarkdown(blogPost: BlogPost): string {
  const frontmatter = {
    title: blogPost.title,
    description: blogPost.meta,
    date: blogPost.date,
    tags: blogPost.tags,
    slug: blogPost.slug,
    summary: blogPost.summary,
    social: {
      twitter: blogPost.socialPosts.twitter,
      linkedin: blogPost.socialPosts.linkedin,
    },
    ...(blogPost.coverImage && { coverImage: blogPost.coverImage }),
  };

  const yamlFrontmatter = yaml.dump(frontmatter, {
    indent: 2,
    lineWidth: -1,
  });

  return `---
${yamlFrontmatter}---

${blogPost.content}
`;
}

export function generateMarkdownPreview(blogPost: BlogPost): MarkdownPreview {
  const fullMarkdown = generateMarkdown(blogPost);
  const [frontmatterSection, ...contentSections] = fullMarkdown.split('---\n').slice(1);
  
  return {
    frontmatter: frontmatterSection.trim(),
    content: contentSections.join('---\n').trim(),
    fullMarkdown,
  };
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function generateTags(content: string, summary: string[]): string[] {
  const commonTags = ['blog', 'content'];
  const contentLower = (content + ' ' + summary.join(' ')).toLowerCase();
  
  const techTags = ['javascript', 'react', 'nodejs', 'typescript', 'python', 'ai', 'machine-learning', 'web-development', 'frontend', 'backend'];
  const businessTags = ['productivity', 'marketing', 'seo', 'social-media', 'automation', 'workflow'];
  
  const detectedTags = [...techTags, ...businessTags].filter(tag => 
    contentLower.includes(tag.replace('-', ' ')) || contentLower.includes(tag)
  );

  return [...commonTags, ...detectedTags.slice(0, 3)];
}