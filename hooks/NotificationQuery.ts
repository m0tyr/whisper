
import { auth } from '@/auth';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export async function useNotificationsCountQuery() {
    const session = await auth()
  const userId = session?.user.id;

  return useQuery<number>({
    queryKey: ['users', userId, 'notifications', 'count'],
/*     queryFn: async () => await isCurrentlyNotified({ userId: userId! }), TODO : make the function to call each 5sec to listen for notification.
 */    refetchInterval: 5000,
    enabled: !!userId,
  });
}
