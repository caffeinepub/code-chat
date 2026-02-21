import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { MessageCircle, LogOut } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const { identity, login, clear, loginStatus } = useInternetIdentity();

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
          {identity ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/register' })}
              >
                Register
              </Button>
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
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button
              onClick={login}
              disabled={loginStatus === 'logging-in'}
              className="bg-gradient-to-r from-coral to-teal text-white"
            >
              {loginStatus === 'logging-in' ? 'Connecting...' : 'Login'}
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
