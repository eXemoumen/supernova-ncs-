'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    let error = null;

    if (isLogin) {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      error = signInError;
    } else {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      error = signUpError;
    }

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(isLogin ? 'Logged in successfully!' : 'Sign up successful! Check your email for confirmation.');
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image with blue tones */}
      <div 
        className="absolute inset-0 bg-[url('https://source.unsplash.com/random/1920x1080/?tech,blue,abstract')] bg-cover bg-center"
        aria-hidden="true"
      />
      
      {/* Blue overlay to enhance the background */}
      <div className="absolute inset-0 bg-blue-900/20" />
      
      {/* Form Container - White with blue accents */}
      <div className="absolute right-0 h-full w-[40%] bg-white">
        <div className="h-full flex items-center justify-center p-8">
          <Card className="w-full border-none bg-transparent shadow-none">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-blue-800">
                {isLogin ? 'Welcome Back!' : 'Join OmniDesk'}
              </CardTitle>
              <CardDescription className="text-slate-600">
                {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-slate-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-slate-700">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-auto text-lg font-medium" 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : isLogin ? 'Login' : 'Sign Up'}
                </Button>
              </form>
              <div className="mt-6 text-center text-sm text-slate-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Button
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-800 p-0 h-auto text-sm font-medium"
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </Button>
              </div>
              {message && (
                <p className={`mt-4 text-center text-sm ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}