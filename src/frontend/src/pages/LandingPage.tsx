import { useNavigate } from '@tanstack/react-router';
import { useCodeAuth } from '../hooks/useCodeAuth';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Lock } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useCodeAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate({ to: '/connect' });
    } else {
      navigate({ to: '/login' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-gradient-to-br from-coral to-teal p-6 shadow-lg">
            <MessageCircle className="h-16 w-16 text-white" />
          </div>
        </div>

        <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl">
          Connect with Anyone,
          <br />
          <span className="bg-gradient-to-r from-coral to-teal bg-clip-text text-transparent">
            One Code at a Time
          </span>
        </h1>

        <p className="mb-12 text-xl text-muted-foreground">
          Simple, secure one-to-one conversations. Share your unique code, connect instantly, and start chatting.
        </p>

        <Button
          size="lg"
          onClick={handleGetStarted}
          className="h-14 rounded-full bg-gradient-to-r from-coral to-teal px-8 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          {isAuthenticated ? 'Go to Chat' : 'Get Started'}
        </Button>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-coral/10 p-3">
                <Users className="h-8 w-8 text-coral" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Simple Registration</h3>
            <p className="text-muted-foreground">
              Register once, get your unique code, and you're ready to connect from any device.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-teal/10 p-3">
                <MessageCircle className="h-8 w-8 text-teal" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold">One-to-One Chats</h3>
            <p className="text-muted-foreground">
              Exchange codes with someone and start a private conversation instantly.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-coral/10 p-3">
                <Lock className="h-8 w-8 text-coral" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your conversations are private and secure, accessible only with your unique code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
