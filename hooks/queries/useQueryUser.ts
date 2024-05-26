import { getUser } from '@/lib/actions/user.actions';
import { useQuery } from '@tanstack/react-query';

export function useQueryUser(userID: string) {
  return useQuery({
      queryKey: ['users', userID],
      queryFn: async () => {
          if (!userID) throw new Error('User ID is required');
          return await getUser(userID);
      },
      enabled: !!userID, 
  });
}