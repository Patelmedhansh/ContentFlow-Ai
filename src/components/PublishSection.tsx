import React, { useState } from 'react';
import { Github, Eye, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { ContentResult, BlogPost, GitHubCommitResponse } from '../types';
import { BlogPostEditor } from './BlogPostEditor';
import { MarkdownPreview } from './MarkdownPreview';
import { generateSlug, generateTags, generateMarkdownPreview } from '../utils/markdown';
import { githubService } from '../services/github';

interface PublishSectionProps {
  results: ContentResult;
  originalContent: string;
  isVisible: boolean;
}

export const PublishSection: React.FC<PublishSectionProps> = ({ 
  results, 
  originalContent, 
  isVisible 
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<GitHubCommitResponse | null>(null);

  const [blogPost, setBlogPost] = useState<BlogPost>(() => ({
    title: results.seoTitle,
    meta: results.metaDescription,
    summary: results.summary,
    socialPosts: results.socialPosts,
    content: originalContent,
    tags: generateTags(originalContent, results.summary),
    slug: generateSlug(results.seoTitle),
    date: new Date().toISOString().split('T')[0],
  }));

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishResult(null);

    try {
      const result = await githubService.commitBlogPost(blogPost);
      setPublishResult(result);
      
      if (result.success) {
        // Reset the editor after successful publish
        setTimeout(() => {
          setShowEditor(false);
        }, 3000);
      }
    } catch (error) {
      setPublishResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const markdownPreview = generateMarkdownPreview(blogPost);

  if (!isVisible) return null;

  return (
    <div className="max-w-6xl mx-auto mt-8 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to Publish Your Blog Post?
          </h2>
          <p className="text-gray-600 mb-6">
            Review and customize your blog post before publishing to your GitHub repository.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setShowEditor(!showEditor)}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center space-x-2 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Github className="w-5 h-5" />
              <span>{showEditor ? 'Hide Editor' : 'Customize & Publish'}</span>
            </button>
            
            <button
              onClick={() => setShowPreview(true)}
              className="bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Eye className="w-5 h-5" />
              <span>Preview Markdown</span>
            </button>
          </div>
        </div>

        {showEditor && (
          <div className="border-t border-gray-200 pt-8">
            <BlogPostEditor
              initialPost={blogPost}
              onChange={setBlogPost}
            />
            
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <p>This will create a new file in your blog repository:</p>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  posts/{blogPost.date}-{blogPost.slug}.md
                </code>
              </div>
              
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-8 rounded-lg font-semibold flex items-center space-x-2 hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Publish to GitHub</span>
                  </>
                )}
              </button>
            </div>

            {publishResult && (
              <div className={`mt-4 p-4 rounded-lg flex items-center space-x-3 ${
                publishResult.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {publishResult.success ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-800">
                        Blog post published successfully!
                      </p>
                      {publishResult.url && (
                        <a
                          href={publishResult.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-700 hover:text-green-800 underline text-sm"
                        >
                          View on GitHub →
                        </a>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-800">
                        Failed to publish blog post
                      </p>
                      <p className="text-red-700 text-sm">
                        {publishResult.error}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <MarkdownPreview
        preview={markdownPreview}
        isVisible={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
};