import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCodeAuth } from '../hooks/useCodeAuth';
import { useConnectUsers, useGetAllUsers } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, CheckCircle2 } from 'lucide-react';

export default function ConnectPage() {
  const navigate = useNavigate();
  const { isAuthenticated, userId } = useCodeAuth();
  const connectMutation = useConnectUsers();
  const { data: users } = useGetAllUsers();
  const [targetCode, setTargetCode] = useState('');
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate({ to: '/login' });
    return null;
  }

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCode.trim() || userId === null) return;

    setError(null);

    try {
      // Find the user by their auth code
      const targetUser = users?.find(user => user.authCode === targetCode.trim());
      
      if (!targetUser) {
        setError('User not found. Please check the code and try again.');
        return;
      }

      // Calculate the target user's ID from their auth code
      // Auth code format: 100000 + userId
      const targetUserId = BigInt(parseInt(targetUser.authCode) - 100000);
      
      await connectMutation.mutateAsync({ myId: userId, targetId: targetUserId });
      setConnected(true);
    } catch (error) {
      console.error('Connection failed:', error);
      setError('Connection failed. Please try again.');
    }
  };

  if (connected) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <Card className="w-full max-w-md border-2 border-teal/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-gradient-to-br from-coral to-teal p-4">
                <CheckCircle2 className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Connected Successfully!</CardTitle>
            <CardDescription>You can now chat with this user</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => navigate({ to: '/chat' })}
              className="w-full bg-gradient-to-r from-coral to-teal text-white"
            >
              Start Chatting
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setConnected(false);
                setTargetCode('');
                setError(null);
              }}
              className="w-full"
            >
              Connect with Another User
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-teal/10 p-3">
              <Users className="h-8 w-8 text-teal" />
            </div>
          </div>
          <CardTitle>Connect with Someone</CardTitle>
          <CardDescription>Enter the code of the person you want to chat with</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="targetCode">Their Code</Label>
              <Input
                id="targetCode"
                type="text"
                placeholder="Enter their unique code"
                value={targetCode}
                onChange={(e) => setTargetCode(e.target.value)}
                required
                disabled={connectMutation.isPending}
              />
            </div>

            {(error || connectMutation.isError) && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error || 'Connection failed. Please check the code and try again.'}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-coral to-teal text-white"
              disabled={connectMutation.isPending || !targetCode.trim()}
            >
              {connectMutation.isPending ? 'Connecting...' : 'Connect'}
            </Button>
          </form>

          {users && users.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                Registered Users: {users.length}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
