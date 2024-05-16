import { getUser } from '@/lib/actions/user.actions';
import { UserDefinition } from '@/lib/types/user.types';
import { useQuery } from '@tanstack/react-query';

export function useQueryUser(userID: string) {
  return useQuery({
    queryKey: ['users', userID],
    queryFn: async () => await getUser(userID!),
  });
}