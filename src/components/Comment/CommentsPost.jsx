/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import * as PostService from '../../services/PostService'
import { useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
import * as message from "../Message/Message"


const Comments = ({ currentUserId, idPost }) => {
  const user = useSelector((state) => state?.user)
  const [backendComments, setBackendComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  // const navigate = useNavigate();
  // const location = useLocation();


  const rootComments = backendComments.filter(
    (backendComment) => backendComment.parentId === null
  );

  console.log('user', user?.id)

  const getReplies = (commentId) =>
    backendComments
      .filter((backendComment) => backendComment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

  const addComment = async (text, parentId) => {
    if (user?.id) {
      try {
        const newComment = {
          id: Math.random().toString(36).substr(2, 9),
          body: text,
          username: user?.name,
          userId: user?.id,
          parentId: parentId || null, 
          createdAt: new Date(),
        }
  
        await PostService.updateCommentPost({
            id: idPost,
            access_token: user?.access_token,
            rests: {
              $push: { comments: newComment } 
            }
        })
  
        fetchPostDetail()
        setActiveComment(null);
      }catch (e) {
        console.log(e)
      }
    }else {
      message.error("Vui lòng đăng nhập trước khi bình luận!")
      // navigate("/sing-in", { state: location?.pathname });  
    }
  };

  const updateComment = async (text, commentId) => {
    try {
        const commentIndex = backendComments.findIndex(comment => comment.id === commentId);
        
        if (commentIndex === -1) {
            console.error("Comment not found");
            return;
        }

        const updatedBackendComments = [...backendComments];
        updatedBackendComments[commentIndex].body = text;

        await PostService.updateCommentPost({
            id: idPost,
            access_token: user?.access_token,
            rests: { comments: updatedBackendComments }
        });

        setBackendComments(updatedBackendComments);
        setActiveComment(null);
    } catch (error) {
        console.error("Error updating comment:", error);
    }
};


  const deleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to remove comment?")) {
      try {
        const updatedBackendComments = backendComments.filter(
          (backendComment) => backendComment.id !== commentId
        );

        setBackendComments(updatedBackendComments);

        await PostService.updateCommentPost({
            id: idPost,
            access_token: user?.access_token,
            rests: {comments: updatedBackendComments}
        });

        fetchPostDetail();
      } catch (error) {
          console.error("Error deleting comment:", error);
      }
    }
  };

  const fetchPostDetail = async () => {
    try {
        const response = await PostService.getDetailPost(idPost); 
        setBackendComments(response?.data?.comments);
    } catch (error) {
        console.error('Error fetching post:', error);
    }
};

  useEffect(() => {
    fetchPostDetail()
  }, []);


  return (
    <div className="comments">
      <h3 className="comments-title">{backendComments?.length} Comments</h3>
      <CommentForm submitLabel="Write" handleSubmit={addComment} />
      <div className="comments-container">
        {rootComments.map((rootComment) => (
          <Comment
            key={rootComment.id}
            comment={rootComment}
            replies={getReplies(rootComment.id)}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            addComment={addComment}
            updateComment={updateComment}
            deleteComment={deleteComment}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;