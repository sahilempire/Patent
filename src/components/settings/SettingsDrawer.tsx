
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const SettingsDrawer = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    localStorage.setItem('openrouterApiKey', apiKey);
    toast({
      title: "API Key Saved",
      description: "Your OpenRouter API key has been saved successfully.",
    });
  };

  React.useEffect(() => {
    const savedApiKey = localStorage.getItem('openrouterApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Open settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Configure your API keys and preferences
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openrouterApiKey">OpenRouter API Key</Label>
            <Input
              id="openrouterApiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenRouter API key"
            />
            <p className="text-sm text-muted-foreground">
              Required for AI-powered suggestions and document generation
            </p>
          </div>
          <SheetClose asChild>
            <Button onClick={handleSaveApiKey} className="w-full">
              Save Settings
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsDrawer;
