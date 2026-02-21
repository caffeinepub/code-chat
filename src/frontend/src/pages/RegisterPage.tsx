import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCodeAuth } from '../hooks/useCodeAuth';
import { useRegisterUser, useGetUserByCode } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useCodeAuth();
  const registerMutation = useRegisterUser();
  const [displayName, setDisplayName] = useState('');
  const [registeredUserId, setRegisteredUserId] = useState<bigint | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch user data to get the auth code
  const { data: userData } = useGetUserByCode(registeredUserId);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    try {
      const userId = await registerMutation.mutateAsync(displayName.trim());
      setRegisteredUserId(userId);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleContinue = () => {
    if (registeredUserId !== null && userData?.authCode) {
      // Automatically authenticate the user
      setAuth(registeredUserId, userData.authCode);
      navigate({ to: '/connect' });
    }
  };

  const handleCopyCode = () => {
    if (userData?.authCode) {
      navigator.clipboard.writeText(userData.authCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (registeredUserId !== null && userData) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <Card className="w-full max-w-md border-2 border-coral/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-gradient-to-br from-coral to-teal p-4">
                <CheckCircle2 className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Registration Successful!</CardTitle>
            <CardDescription>Your unique code is ready to use</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-xl bg-gradient-to-br from-coral/10 to-teal/10 p-6 text-center">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Your Unique Code</p>
              <p className="mb-4 text-5xl font-bold tracking-tight text-foreground">
                {userData.authCode}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>

            <Alert>
              <AlertDescription>
                Save this code! You'll use it to log in from any device. Share it with people you want to connect with.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-coral to-teal text-white"
            >
              Continue to Chat
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
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>Choose a display name to get your unique code</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Enter your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                disabled={registerMutation.isPending}
              />
            </div>

            {registerMutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Registration failed. Please try again.
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-coral to-teal text-white"
              disabled={registerMutation.isPending || !displayName.trim()}
            >
              {registerMutation.isPending ? 'Registering...' : 'Get My Code'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have a code?{' '}
                <button
                  type="button"
                  onClick={() => navigate({ to: '/login' })}
                  className="font-medium text-teal hover:underline"
                >
                  Login here
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
