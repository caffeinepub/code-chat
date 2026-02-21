import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MessageCircle, AlertCircle } from 'lucide-react';

export default function ChatPage() {
  const { identity, login } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please login to access the chat</CardDescription>
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

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-muted p-4">
              <MessageCircle className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Chat Feature Coming Soon</CardTitle>
          <CardDescription>The messaging functionality is currently under development</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Backend Integration Required</AlertTitle>
            <AlertDescription>
              The chat interface requires additional backend methods for sending and retrieving messages.
              Once the backend is updated with message storage and retrieval capabilities, you'll be able to:
            </AlertDescription>
          </Alert>

          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-coral">•</span>
                <span>Send text messages to your connected partner</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-teal">•</span>
                <span>View conversation history in a beautiful thread format</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-coral">•</span>
                <span>See real-time updates when new messages arrive</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-teal">•</span>
                <span>Enjoy private, secure one-to-one conversations</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 text-center text-sm text-muted-foreground">
            <p>In the meantime, you can register and connect with other users.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
