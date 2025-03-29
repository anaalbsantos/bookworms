import React, { useState } from "react";
import { Check, Edit3, Trash3} from "assets";
import Image from "next/image";
import api from "services/api";


interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  score: number;
  bio: string;
  image: string;
  groupId: string;
}

interface CommentInputProps {
  placeholder?: string;
  value?: string;
  userId: string; 
  user: User | null;
  comments: Comment[]; 
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>; 
  postId: string | null;
}

// Interface única para comentários
interface Comment {
  id: string;
  text: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  createdAt?: string;
}

// interface ApiResponse {
//   data: User[];
// }

export function CommentInput({
  placeholder = "Adicione um comentário...",
  value,
  userId,
  user,
  comments,
  setComments,
  postId
}: CommentInputProps) {
  const [comment, setComment] = useState(value || ""); 
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
  
      if (comment.trim() !== "") {
        try {
          const res = await api.post<{ data: Comment }>("/comments", {
            postId,
            authorId: userId,
            text: comment,
          });
  
          setComments((prevComments) => [
            ...prevComments,
            {
              id: res.data.data.id, 
              text: comment,
              authorId: userId,
              author: {
                id: userId,
                name: user?.name || 'Usuário Desconhecido',
                image: user?.image || '/default-avatar.png'
              }
            }
          ]);

          setComment("");
        } catch (error) {
          console.error("Erro ao criar comentário:", error);
        }
      }
    }
  };


  const handleDeleteComment = async (id: string) => {
    try {
      console.log("Tentando deletar comentário com ID:", id);
      const response = await api.delete(`/comments/${id}`);
      console.log("Resposta da deleção:", response);
      
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== id));
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
    }
  };
  

  const handleEditComment = (id: string, content: string) => {
    setEditingCommentId(id);
    setEditedContent(content);
  };

  const handleSaveEdit = async (id: string) => {
    if (editedContent.trim() !== "") {
      try {
        await api.put(`/comments/${id}`, {
          text: editedContent,
        });
  
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === id
              ? {
                  ...comment,
                  content: editedContent,
                }
              : comment
          )
        );
  
        setEditingCommentId(null);
        setEditedContent("");
      } catch (error) {
        console.error("Erro ao editar comentário:", error);
      }
    }
  };
  


  return (
    <div className="flex-col items-center">
      <div className="mt-4">
        {Array.isArray(comments) && comments.map((comment) => (
          <div key={comment.id} className="flex space-between items-center w-[351px] h-[67px] p-2 bg-gray rounded-[20px] mt-2">
            <Image
              src={comment.author.image  || '/default-avatar.png'}  
              alt="author"
              width={50} 
              height={51} 
              className=" w-[50px] h-[51px] rounded-full mr-3 ml-2"  
            />
            <div className="flex flex-col justify-between flex-grow break-words overflow-hidden">
              <span className="font-nunito text-[16px] font-semibold text-graphiteGray text-black">
                {comment.author.name}
              </span>
              {editingCommentId === comment.id ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="text-[14px] font-nunito resize-none text-graphiteGray w-full bg-transparent border border-gray-300 rounded p-1 focus:outline-none focus:border-gray-500"
                />
              ) : (
                <p className="text-[14px] font-nunito text-graphiteGray">
                  {comment.text}
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
                      onClick={() => handleEditComment(comment.id, comment.text)}
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
      <div className="flex items-start mt-2">
        <textarea
          placeholder={placeholder}
          value={comment}
          onChange={(e) => setComment(e.target.value)} 
          onKeyDown={handleKeyDown}
          className="w-[351px] min-h-[67px] max-h-[200px] font-nunito text-graphiteGray border-none bg-gray rounded-[20px] p-2 resize-none overflow-y-auto text-[14px]"
        />
      </div>
    </div>
  );
}
