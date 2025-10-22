import { formatDate } from '@/lib/utils';

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
}

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>;
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b pb-4">
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="font-medium">{comment.author}</h3>
            <span className="text-sm text-gray-500">{formatDate(new Date(comment.createdAt))}</span>
          </div>
          <p className="text-gray-700">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}