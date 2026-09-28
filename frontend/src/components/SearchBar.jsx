import React, { useState, useEffect } from 'react';
import { Search, Filter, Tag } from 'lucide-react';

const CATEGORIES = ['Education', 'Entertainment', 'Training', 'Fun', 'General', 'Other'];
const POPULAR_TAGS = ['Java', 'Python', 'DSA', 'Cricket', 'Movies', 'Mathematics', 'Science', 'Spring Boot'];

export const SearchBar = ({ onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // DEBOUNCING: Trigger search only after 300ms pause in typing (Rule 33)
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange({
        query: searchTerm,
        category: selectedCategory,
        tag: selectedTag,
      });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, selectedCategory, selectedTag]);

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div className="form-row">
        <div style={{ flex: 2 }}>
          <label className="form-label">Search Quizzes</label>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Search by title or description (e.g. Java, Math)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="form-label">Category Filter</label>
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Tag Filter</label>
          <select
            className="form-control"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="">All Tags</option>
            {POPULAR_TAGS.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Tag Chips */}
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Popular Tags:</span>
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`btn btn-sm ${selectedTag === tag ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '999px', fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
            onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
          >
            #{tag}
          </button>
        ))}
        {(selectedCategory || selectedTag || searchTerm) && (
          <button
            type="button"
            className="btn btn-sm btn-outline"
            style={{ borderRadius: '999px', fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedTag('');
            }}
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
