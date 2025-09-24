import React from 'react';
import type { GetEntityInput } from '../../../API/DTOs/Entities';

interface SidebarProps {
    entities: GetEntityInput[];
    onSelect: (entity: GetEntityInput) => void;
    onAdd: () => void;
    onDelete: (entityId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ entities, onSelect, onAdd, onDelete }) => {
    return (
        <div style={{ width: '30%', padding: '20px', borderRight: '1px solid #ccc' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2>Entities</h2>
                <button onClick={onAdd} style={{ fontSize: '1.2rem', padding: '4px 8px', cursor: 'pointer' }}>+</button>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {entities.map(entity => (
                    <li
                        key={entity.entity_id}
                        style={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}
                    >
                        <span
                            onClick={() => onSelect(entity)}
                            style={{ cursor: 'pointer', flex: 1 }}
                        >
                            {entity.title}
                        </span>
                        <button
                            onClick={e => { e.stopPropagation(); onDelete(entity.entity_id); }}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginLeft: '8px' }}
                            aria-label="Delete Entity"
                        >
                            🗑️
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;