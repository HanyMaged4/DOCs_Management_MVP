// App.tsx
import React, { useEffect, useState } from 'react';
import Sidebar from './components/EntitiesList';
import EntityView from './components/EntityViews';
import type { GetEntityInput }from '../../API/DTOs/Entities';
import { getAllEntitiesAPI, getAllEntitiesByBookIDAPI } from '../../API/entity';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';


//takes id as prop
interface EntitiesProps {
    id?: string;
}

const EntitiesPage: React.FC<EntitiesProps> = () => {
    const { id } = useParams<{ id: string }>();
    const [selectedEntity, setSelectedEntity] = useState<GetEntityInput | null>(null);
    const [data, setData] = useState<GetEntityInput[]>([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState<string | null>(null);
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

    // show loading or error messages
    if (loading) return <div>Loading entities...</div>;
    if (error)   return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar entities={data} onSelect={handleSelectEntity} />
            <EntityView selectedEntity={selectedEntity} />
        </div>
    );
};

export default EntitiesPage;
