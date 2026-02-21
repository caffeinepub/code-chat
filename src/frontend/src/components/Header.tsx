import { useNavigate } from '@tanstack/react-router';
import { useCodeAuth } from '../hooks/useCodeAuth';
import { Button } from '@/components/ui/button';
import { MessageCircle, LogOut } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, authCode } = useCodeAuth();

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="rounded-lg bg-gradient-to-br from-coral to-teal p-2">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">Code Chat</span>
        </button>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/connect' })}
              >
                Connect
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/chat' })}
              >
                Chat
              </Button>
              <div className="hidden items-center gap-2 rounded-lg border border-border bg-muted px-3 py-1.5 text-sm md:flex">
                <span className="text-muted-foreground">Code:</span>
                <span className="font-mono font-semibold">{authCode}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/login' })}
              >
                Login
              </Button>
              <Button
                onClick={() => navigate({ to: '/register' })}
                className="bg-gradient-to-r from-coral to-teal text-white"
              >
                Register
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
