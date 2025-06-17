import React, { useState, useEffect } from 'react';
import { Calendar, Tag, Image, FileText } from 'lucide-react';
import { BlogPost } from '../types';
import { generateSlug, generateTags } from '../utils/markdown';

interface BlogPostEditorProps {
  initialPost: BlogPost;
  onChange: (post: BlogPost) => void;
}

export const BlogPostEditor: React.FC<BlogPostEditorProps> = ({ initialPost, onChange }) => {
  const [post, setPost] = useState<BlogPost>(initialPost);

  useEffect(() => {
    onChange(post);
  }, [post, onChange]);

  const handleFieldChange = (field: keyof BlogPost, value: any) => {
    const updatedPost = { ...post, [field]: value };
    
    // Auto-generate slug when title changes
    if (field === 'title') {
      updatedPost.slug = generateSlug(value);
    }
    
    setPost(updatedPost);
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    handleFieldChange('tags', tags);
  };

  const autoGenerateTags = () => {
    const generatedTags = generateTags(post.content, post.summary);
    handleFieldChange('tags', generatedTags);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Blog Title
            </label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter blog post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug
            </label>
            <input
              type="text"
              value={post.slug}
              onChange={(e) => handleFieldChange('slug', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="url-friendly-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Publish Date
            </label>
            <input
              type="date"
              value={post.date}
              onChange={(e) => handleFieldChange('date', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                <Tag className="w-4 h-4 inline mr-1" />
                Tags (comma-separated)
              </label>
              <button
                onClick={autoGenerateTags}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Auto-generate
              </button>
            </div>
            <input
              type="text"
              value={post.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="react, javascript, tutorial"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Image className="w-4 h-4 inline mr-1" />
              Cover Image URL (optional)
            </label>
            <input
              type="url"
              value={post.coverImage || ''}
              onChange={(e) => handleFieldChange('coverImage', e.target.value || undefined)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              value={post.meta}
              onChange={(e) => handleFieldChange('meta', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="SEO meta description"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Blog Content
        </label>
        <textarea
          value={post.content}
          onChange={(e) => handleFieldChange('content', e.target.value)}
          rows={12}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
          placeholder="Write your blog post content here..."
        />
      </div>
    </div>
  );
};