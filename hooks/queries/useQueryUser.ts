import { getUser } from '@/lib/actions/user.actions';
import { useQuery } from '@tanstack/react-query';

export function useQueryUser(userID: string) {
  return useQuery({
      queryKey: ['users', userID],
      queryFn: () => getUser(userID),
      enabled: !!userID, 
  });
}