import React from 'react';
import './card.css';
import { useNavigate } from 'react-router-dom';

export interface ActionCardProps {
  book_id: number;
  title: string;
  description: string;
  tags: string[];
  onEdit: () => void;
  onDelete: () => void;
}
const ActionCard: React.FC<ActionCardProps> = ({ book_id ,title, description, tags, onEdit, onDelete }) => {
  const navigate = useNavigate();
  return (
    <div className="card action-card">
      <div className="card-content" onClick={() => navigate(`/book/${book_id}`)}>
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>
      </div>
    <div className="card-tags">
      {tags.map((tag, idx) => (
        <span key={idx} className="card-tag">{tag}</span>
      ))}
    </div>
    {/* inline action icons after content */}
    <div className="card-action-inline-icons">
      <svg onClick={onEdit} className="card-icon-inline edit-icon-inline" role="button" aria-label="Edit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.41l-2.34-2.34a1.003 1.003 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
      </svg>
      <svg onClick={onDelete} className="card-icon-inline delete-icon-inline" role="button" aria-label="Delete" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
        <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z" />
      </svg>
    </div>
  </div>
);
};
export default ActionCard;
