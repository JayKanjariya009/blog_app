import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

const CommentSection = ({ blogId }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
  }, [blogId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blogs/${blogId}/comments`);
      setComments(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await api.post(`/blogs/${blogId}/comments`, {
        content: newComment
      });
      
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment. Please try again.');
    }
  };

  return (
    <div className="mt-12 border-t border-theme pt-8">
      <h3 className="text-2xl font-bold mb-6 text-theme">Comments</h3>
      
      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="mb-4">
            <textarea
              className="w-full p-3 border border-theme bg-theme text-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <div className="bg-theme-secondary p-4 rounded-lg mb-8">
          <p className="text-theme">Please log in to leave a comment.</p>
        </div>
      )}
      
      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg">
          {error}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-theme-muted">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-theme-secondary p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="font-bold text-theme">{comment.user?.username || 'Anonymous'}</div>
                <div className="text-sm text-theme-muted">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
              </div>
              <p className="text-theme-secondary">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;