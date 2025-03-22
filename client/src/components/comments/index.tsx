import React, { useState } from "react";
import { Check, Edit3, Trash3, Woman2 } from "assets";
import Image from "next/image";

interface CommentInputProps {
  placeholder?: string;
  value?: string;
  userId: string; 
  comments: Comment[]; 
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>; 
}

interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
}

export function CommentInput({
  placeholder = "Adicione um comentário...",
  value,
  userId,
  comments,
  setComments
}: CommentInputProps) {
  const [comment, setComment] = useState(value || ""); 
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  

 
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault(); 

    if (comment.trim() !== "") {
      const newComment = {
        id: new Date().toISOString(),
        content: comment,
        authorId: userId,
        authorName: "Usuário Atual",
        authorPhoto: Woman2,
      };

      setComments((prevComments) => [...prevComments, newComment]); // Atualiza o estado com o novo comentário
      setComment(""); // Limpa o campo de entrada
    }
  }
};

  const handleDeleteComment = (id: string) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  const handleEditComment = (id: string, content: string) => {
    setEditingCommentId(id);
    setEditedContent(content);
  };


  const handleSaveEdit = (id: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === id ? { ...comment, content: editedContent } : comment
      )
    );
    setEditingCommentId(null);
    setEditedContent("");
  };


  return (
    <div className="flex-col items-center">
      <div className="flex items-start">
        <textarea
          placeholder={placeholder}
          value={comment}
          onChange={(e) => setComment(e.target.value)} 
          onKeyDown={handleKeyDown}
          className="w-[351px] min-h-[67px] max-h-[200px] font-nunito text-graphiteGray border-none bg-gray rounded-[20px] p-2 resize-none overflow-y-auto text-[14px]"
        />
      </div>

      <div className="mt-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-between items-center w-[351px] p-2 bg-gray rounded-[20px] mt-2">
            <Image
              src={comment.authorPhoto}  
              alt="author"
              width={50} 
              height={51} 
              className="rounded-full mr-3 ml-2"  
            />
            <div className="flex flex-col justify-between flex-grow break-words overflow-hidden">
              <span className="font-nunito text-[16px] font-semibold text-graphiteGray text-black">
                {comment.authorName}
              </span>
              {editingCommentId === comment.id ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="text-[14px] font-nunito resize-none text-graphiteGray w-full bg-transparent border border-gray-300 rounded p-1 focus:outline-none focus:border-gray-500"
                />
              ) : (
                <p className="text-[14px] font-nunito text-graphiteGray">
                  {comment.content}
                </p>
              )}
            </div>

            {comment.authorId === userId && (
              <div className="flex ml-auto">
                {editingCommentId === comment.id ? (
                  <button
                    onClick={() => handleSaveEdit(comment.id)}
                    className="flex-shrink-0 w-8 h-8 text-white rounded-full p-1"
                  >
                    <Image src={Check} alt="check" width={24} height={24} />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="flex-shrink-0 w-8 h-8 p-1"
                    >
                      <Image src={Trash3} alt="trash" width={24} height={24} />
                    </button>
                    <button
                      onClick={() => handleEditComment(comment.id, comment.content)}
                      className="flex-shrink-0 w-8 h-8"
                    >
                      <Image src={Edit3} alt="edit" width={32} height={32} />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
