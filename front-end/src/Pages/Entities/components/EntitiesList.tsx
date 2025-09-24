import React from 'react';
import type { GetEntityInput } from '../../../API/DTOs/Entities';

interface SidebarProps {
    entities: GetEntityInput[];
    onSelect: (entity: GetEntityInput) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ entities, onSelect }) => {
    return (
        <div style={{ width: '30%', padding: '20px', borderRight: '1px solid #ccc' }}>
            <h2>Entities</h2>
            <ul>
                {entities.map(entity => (
                    <li
                        key={entity.entity_id}
                        onClick={() => onSelect(entity)}
                        style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #eee' }}
                    >
                        {entity.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;