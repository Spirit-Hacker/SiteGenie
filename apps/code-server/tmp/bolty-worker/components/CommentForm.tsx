import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface CommentFormProps {
  postId: string;
  onCommentAdded: () => void;
}

type FormData = {
  author: string;
  content: string;
};

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        reset();
        onCommentAdded();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
      <div>
        <label htmlFor="author" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          type="text"
          id="author"
          className="w-full px-3 py-2 border rounded-md"
          disabled={isSubmitting}
          {...register('author', { required: 'Name is required' })}
        />
        {errors.author && (
          <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          Comment
        </label>
        <textarea
          id="content"
          rows={4}
          className="w-full px-3 py-2 border rounded-md"
          disabled={isSubmitting}
          {...register('content', { required: 'Comment is required' })}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Post Comment'}
      </button>
    </form>
  );
}