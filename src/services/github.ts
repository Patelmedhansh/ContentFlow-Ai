import { BlogPost, GitHubCommitResponse } from '../types';
import { generateMarkdown } from '../utils/markdown';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER;
const GITHUB_BLOG_REPO = import.meta.env.VITE_GITHUB_BLOG_REPO;

export class GitHubService {
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    if (!GITHUB_TOKEN) {
      throw new Error('GitHub token not configured. Please add VITE_GITHUB_TOKEN to your environment variables.');
    }

    const response = await fetch(`https://api.github.com${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    return response;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private generateFileName(title: string): string {
    const date = new Date().toISOString().split('T')[0];
    const slug = this.generateSlug(title);
    return `${date}-${slug}.md`;
  }

  async checkIfFileExists(fileName: string): Promise<boolean> {
    try {
      const response = await this.makeRequest(
        `/repos/${GITHUB_OWNER}/${GITHUB_BLOG_REPO}/contents/posts/${fileName}`
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  async commitBlogPost(blogPost: BlogPost): Promise<GitHubCommitResponse> {
    try {
      if (!GITHUB_OWNER || !GITHUB_BLOG_REPO) {
        throw new Error('GitHub repository configuration missing. Please check VITE_GITHUB_OWNER and VITE_GITHUB_BLOG_REPO.');
      }

      const fileName = this.generateFileName(blogPost.title);
      const filePath = `posts/${fileName}`;
      
      // Check if file already exists
      const fileExists = await this.checkIfFileExists(fileName);
      if (fileExists) {
        throw new Error(`A post with this title already exists. Please modify the title or delete the existing post.`);
      }

      // Generate markdown content
      const markdownContent = generateMarkdown(blogPost);
      const encodedContent = btoa(unescape(encodeURIComponent(markdownContent)));

      // Create the file
      const response = await this.makeRequest(
        `/repos/${GITHUB_OWNER}/${GITHUB_BLOG_REPO}/contents/${filePath}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            message: `Add new blog post: ${blogPost.title}`,
            content: encodedContent,
            branch: 'main',
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`GitHub API error: ${error.message || 'Unknown error'}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        url: result.content?.html_url || `https://github.com/${GITHUB_OWNER}/${GITHUB_BLOG_REPO}/blob/main/${filePath}`,
      };
    } catch (error) {
      console.error('Error committing to GitHub:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async checkRepositoryAccess(): Promise<{ hasAccess: boolean; error?: string }> {
    try {
      const response = await this.makeRequest(`/repos/${GITHUB_OWNER}/${GITHUB_BLOG_REPO}`);
      
      if (response.status === 404) {
        return {
          hasAccess: false,
          error: `Repository ${GITHUB_OWNER}/${GITHUB_BLOG_REPO} not found or not accessible`,
        };
      }
      
      if (!response.ok) {
        const error = await response.json();
        return {
          hasAccess: false,
          error: `GitHub API error: ${error.message || 'Unknown error'}`,
        };
      }

      return { hasAccess: true };
    } catch (error) {
      return {
        hasAccess: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }
}

export const githubService = new GitHubService();