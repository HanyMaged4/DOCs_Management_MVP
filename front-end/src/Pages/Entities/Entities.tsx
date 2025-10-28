import React, { useEffect, useState } from 'react';
import Sidebar from './components/EntitiesList';
import EntityView from './components/EntityViews';
import AddEntity from './components/Add_entity';
import type { GetEntityInput }from '../../API/DTOs/Entities';
import { getAllEntitiesByBookIDAPI, deleteEntityByIdAPI } from '../../API/entity';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
//import css 
import './Entities.css';
import './components/Add_entity.css'

interface EntitiesProps {
    id?: string;
}

const EntitiesPage: React.FC<EntitiesProps> = () => {
    const { id } = useParams<{ id: string }>();
    const [selectedEntity, setSelectedEntity] = useState<GetEntityInput | null>(null);
    const [data, setData] = useState<GetEntityInput[]>([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState<string | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const { logout } = useAuth();
    
    useEffect(() => {
        getAllEntitiesByBookIDAPI(id!)
          .then(setData)
          .catch(err => {
            if (err.message === "Unauthorized") {
              logout();
            } else {
              setError(err.message);
            }
          })
          .finally(() => setLoading(false));
      }, []);

    const handleSelectEntity = (entity: GetEntityInput) => {
        setSelectedEntity(entity);
    };
    // delete an entity and update list
    const handleDeleteEntity = (entityId: number) => {
        deleteEntityByIdAPI(String(entityId))
          .then(() => setData(prev => prev.filter(e => e.entity_id !== entityId)))
          .catch(err => setError(err.message || 'Failed to delete entity'));
    };

    if (loading) return <div>Loading entities...</div>;
    if (error)   return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar
                entities={data}
                onSelect={handleSelectEntity}
                onAdd={() => setShowAdd(true)}
                onDelete={handleDeleteEntity}
            />
            <div style={{ flex: 1, padding: '20px' }}>
                {showAdd ? (
                    <AddEntity
                        onCancel={() => setShowAdd(false)}
                        onAdd={entity => {
                            setData(prev => [...prev, entity]);
                            setShowAdd(false);
                        }}
                    />
                ) : (
                    <EntityView selectedEntity={selectedEntity} />
                )}
            </div>
        </div>
    );
};

export default EntitiesPage;
