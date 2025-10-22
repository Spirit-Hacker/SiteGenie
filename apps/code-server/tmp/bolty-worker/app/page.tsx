import Link from 'next/link';
import prisma from '@/lib/prisma';
import PostCard from '@/components/PostCard';

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link 
          href="/posts/create" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create New Post
        </Link>
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">No posts yet.</p>
          <p>
            <Link href="/posts/create" className="text-blue-600 hover:underline">
              Create your first blog post
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}