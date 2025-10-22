'use client';

import { useState, useEffect } from 'react';
import CommentList from '@/components/CommentList';
import CommentForm from '@/components/CommentForm';

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${postId}/comments`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      setComments(data);
      setError(null);
    } catch (err) {
      setError('There was a problem loading comments.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <section className="border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      
      {loading ? (
        <p>Loading comments...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <CommentList comments={comments} />
      )}
      
      <h3 className="text-xl font-semibold mt-10 mb-4">Leave a comment</h3>
      <CommentForm postId={postId} onCommentAdded={fetchComments} />
    </section>
  );
}