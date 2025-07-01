import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const EmailPage = () => {
  const [prompt, setPrompt] = useState('');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    // Placeholder for AI generation logic
    setTimeout(() => {
      setSubject(`AI-Generated Subject for: ${prompt}`);
      setBody(`This is an AI-generated email body based on the prompt: "${prompt}". You can edit this text before sending.`);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Email Automation</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="recipient">Recipient's Email</Label>
          <Input id="recipient" type="email" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="prompt">Email Prompt</Label>
          <Input id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., Follow-up on last week's demo" />
        </div>
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Email'}
        </Button>
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="body">Body</Label>
          <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} rows={10} />
        </div>
        <Button>Send Email</Button>
      </div>
    </div>
  );
};

export default EmailPage;
