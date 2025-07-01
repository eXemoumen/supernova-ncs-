"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AgiChat = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse("Error communicating with the AGI service.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AGI Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Talk to the AGI..."
          />
          <Button type="submit" disabled={isLoading} className="mt-2">
            {isLoading ? "Thinking..." : "Send"}
          </Button>
        </form>
        {response && (
          <div className="mt-4">
            <p>AGI:</p>
            <p>{response}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgiChat;
