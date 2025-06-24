
import { useState, useEffect } from 'react';
import { Creator } from '../types/Creator';
import { creatorAPI, CreateCreatorData, UpdateCreatorData } from '../services/api';
import { useToast } from './use-toast';

export const useCreators = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCreators = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await creatorAPI.getAll();
      setCreators(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch creators';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCreator = async (data: CreateCreatorData) => {
    try {
      const newCreator = await creatorAPI.create(data);
      setCreators(prev => [...prev, newCreator]);
      toast({
        title: "Success",
        description: "Creator created successfully",
      });
      return newCreator;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create creator';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateCreator = async (id: string, data: UpdateCreatorData) => {
    try {
      const updatedCreator = await creatorAPI.update(id, data);
      setCreators(prev => prev.map(creator => 
        creator.id === id ? updatedCreator : creator
      ));
      toast({
        title: "Success",
        description: "Creator updated successfully",
      });
      return updatedCreator;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update creator';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteCreator = async (id: string) => {
    try {
      await creatorAPI.delete(id);
      setCreators(prev => prev.filter(creator => creator.id !== id));
      toast({
        title: "Success",
        description: "Creator deleted successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete creator';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  return {
    creators,
    loading,
    error,
    fetchCreators,
    createCreator,
    updateCreator,
    deleteCreator,
  };
};
