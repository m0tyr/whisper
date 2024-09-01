import getFeaturedStickers from '@/lib/actions/stories.actions';
import { useQuery } from '@tanstack/react-query';

export function useQueryFeaturedStickers() {
  return useQuery({
      queryKey: ['stickers', 'WHSTICK'],
      queryFn: () => getFeaturedStickers(),
  });
}