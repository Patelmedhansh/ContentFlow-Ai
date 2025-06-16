export interface ContentResult {
  seoTitle: string;
  metaDescription: string;
  summary: string[];
  socialPosts: {
    twitter: string;
    linkedin: string;
  };
}

export interface WorkflowPayload {
  title: string;
  meta: string;
  summary: string[];
  posts: {
    twitter: string;
    linkedin: string;
  };
  original: string;
  tone: string;
}

export type ToneType = 'professional' | 'witty' | 'technical';