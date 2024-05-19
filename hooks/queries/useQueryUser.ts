import { getUser } from '@/lib/actions/user.actions';
import { UserDefinition } from '@/lib/types/user.types';
import { useQuery } from '@tanstack/react-query';

export function useQueryUser(userID: string | undefined) {
  return useQuery({
      queryKey: ['users', userID],
      queryFn: async () => {
          if (!userID) throw new Error('User ID is required');
          return await getUser(userID);
      },
      enabled: !!userID, 
  });
}