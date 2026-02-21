import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { User } from '../backend';

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (displayName: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.registerUser(displayName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useConnectUsers() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ myId, targetId }: { myId: bigint; targetId: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.connectUsers(myId, targetId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connection'] });
    },
  });
}

export function useGetAllUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsConnected(userId1: bigint | null, userId2: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['connection', userId1?.toString(), userId2?.toString()],
    queryFn: async () => {
      if (!actor || userId1 === null || userId2 === null) return false;
      return actor.isConnected(userId1, userId2);
    },
    enabled: !!actor && !isFetching && userId1 !== null && userId2 !== null,
  });
}
