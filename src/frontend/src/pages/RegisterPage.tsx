import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useRegisterUser } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const registerMutation = useRegisterUser();
  const [displayName, setDisplayName] = useState('');
  const [registeredCode, setRegisteredCode] = useState<bigint | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    try {
      const code = await registerMutation.mutateAsync(displayName.trim());
      setRegisteredCode(code);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleCopyCode = () => {
    if (registeredCode !== null) {
      navigator.clipboard.writeText(registeredCode.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!identity) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please login to register and get your unique code</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={login} className="w-full">
              Login with Internet Identity
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (registeredCode !== null) {
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
            <CardDescription>Your unique code is ready to share</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-xl bg-gradient-to-br from-coral/10 to-teal/10 p-6 text-center">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Your Unique Code</p>
              <p className="mb-4 text-5xl font-bold tracking-tight text-foreground">
                {registeredCode.toString()}
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
                Share this code with anyone you want to connect with. Keep it safe!
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/connect' })}
                className="flex-1"
              >
                Connect with Someone
              </Button>
              <Button
                onClick={() => navigate({ to: '/chat' })}
                className="flex-1 bg-gradient-to-r from-coral to-teal text-white"
              >
                Go to Chat
              </Button>
            </div>
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
