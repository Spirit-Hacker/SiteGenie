import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    _count?: {
      comments: number;
    };
  };
}

export default function PostCard({ post }: PostCardProps) {
  // Truncate content for preview
  const excerpt = post.content.length > 150 
    ? post.content.substring(0, 150) + '...' 
    : post.content;

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <Link href={`/posts/${post.id}`}>
          <h2 className="text-xl font-semibold hover:text-blue-600 mb-2">{post.title}</h2>
        </Link>
        <p className="text-sm text-gray-500 mb-3">{formatDate(new Date(post.createdAt))}</p>
        <p className="text-gray-700 mb-4">{excerpt}</p>
        <div className="flex justify-between items-center">
          <Link href={`/posts/${post.id}`} className="text-blue-600 hover:underline">
            Read more
          </Link>
          {post._count && (
            <span className="text-sm text-gray-500">
              {post._count.comments} comment{post._count.comments !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}