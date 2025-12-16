import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md border-0 shadow-lg ring-1 ring-slate-100 dark:ring-slate-800">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-xl w-fit mb-2">
            <Briefcase className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Enter your username to access your Job Tracker
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base">
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>Mock Authentication: Enter any username to continue.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
