// EntityView.tsx
import React from 'react';
import type { GetEntityInput } from '../../../API/DTOs/Entities';

interface EntityViewProps {
    selectedEntity: GetEntityInput | null;
}

const EntityView: React.FC<EntityViewProps> = ({ selectedEntity }) => {
    if (!selectedEntity) {
        return (
            <div style={{ flex: 1, padding: '20px' }}>
                <p>Please select an entity from the sidebar to view its details.</p>
            </div>
        );
    }

    return (
        <div style={{ flex: 1, padding: '20px' }}>
            <h2>{selectedEntity.title}</h2>
            <p>{selectedEntity.tags ? selectedEntity.tags.join(', ') : ''}</p>
            <p>{selectedEntity.content}</p>
        </div>
    );
};

export default EntityView;