import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCodeAuth } from '../hooks/useCodeAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useCodeAuth();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate({ to: '/connect' });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await login(code.trim());
      navigate({ to: '/connect' });
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid code. Please check your code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-gradient-to-br from-coral to-teal p-3">
              <LogIn className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Enter your unique code to access your chats</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Your Unique Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter your code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-coral to-teal text-white"
              disabled={isLoading || !code.trim()}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have a code?{' '}
                <button
                  type="button"
                  onClick={() => navigate({ to: '/register' })}
                  className="font-medium text-coral hover:underline"
                >
                  Register here
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
