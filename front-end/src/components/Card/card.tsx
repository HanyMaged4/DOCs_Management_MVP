import React from 'react';
import './card.css';

export interface CardProps {
  title: string;
  description: string;
  tags: string[];
}

const Card: React.FC<CardProps> = ({ title, description, tags }) => {
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      <p className="card-description">{description}</p>
      <div className="card-tags">
        {tags.map((tag, index) => (
          <span key={index} className="card-tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Card;
