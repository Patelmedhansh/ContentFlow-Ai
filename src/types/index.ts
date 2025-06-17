export interface ContentResult {
  seoTitle: string;
  metaDescription: string;
  summary: string[];
  socialPosts: {
    twitter: string;
    linkedin: string;
  };
}

export interface BlogPost {
  title: string;
  meta: string;
  summary: string[];
  socialPosts: {
    twitter: string;
    linkedin: string;
  };
  content: string;
  tags: string[];
  coverImage?: string;
  slug: string;
  date: string;
}

export interface MarkdownPreview {
  frontmatter: string;
  content: string;
  fullMarkdown: string;
}

export type ToneType = 'professional' | 'witty' | 'technical';

export interface GitHubCommitResponse {
  success: boolean;
  url?: string;
  error?: string;
}