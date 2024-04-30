
import { auth } from '@/auth';
import { countActiveNotifications } from '@/lib/actions/notifications.actions';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useNotificationsCountQuery(sessionID: string) {

  return useQuery<number>({
    queryKey: ['users', sessionID, 'notifications', 'count'],
    queryFn: async () => await countActiveNotifications(sessionID!),
      refetchInterval: 5000,
    enabled: !!sessionID,
  });
}