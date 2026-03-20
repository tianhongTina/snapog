'use client';

import { useEffect, useState, useCallback } from 'react';
import { ApiKeyTable } from '@/components/dashboard/ApiKeyTable';
import { toast } from '@/components/ui/use-toast';
import type { ApiKeyListItem } from '@/types';

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKeyListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKeys = useCallback(async () => {
    try {
      const response = await fetch('/api/keys');
      if (!response.ok) {
        const err = await response.json().catch(() => ({})) as { error?: string; detail?: string };
        throw new Error(err.detail || err.error || `HTTP ${response.status}`);
      }
      const data = await response.json() as ApiKeyListItem[];
      setApiKeys(data);
    } catch (err) {
      toast({
        title: 'Failed to load API keys',
        description: String(err instanceof Error ? err.message : 'Unknown error'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleCreateKey = async (name: string): Promise<{ key: string } | null> => {
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({})) as { error?: string; detail?: string };
        throw new Error(err.detail || err.error || `HTTP ${response.status}`);
      }

      const data = await response.json() as { key: string };

      // Refresh the list
      await fetchKeys();

      return { key: data.key };
    } catch (err) {
      toast({
        title: 'Failed to create API key',
        description: String(err instanceof Error ? err.message : 'Unknown error'),
        variant: 'destructive',
      });
      return null;
    }
  };

  const handleDeleteKey = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/keys?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete key');

      setApiKeys((prev) => prev.filter((k) => k.id !== id));
      toast({
        title: 'Key deleted',
        description: 'API key has been deactivated.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete API key.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">API Keys</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage your API keys for programmatic access to SnapOG.
        </p>
      </div>

      {/* API Usage Example */}
      <div className="mb-8 p-4 rounded-lg bg-muted/30 border border-border">
        <h3 className="text-sm font-medium mb-2">Quick Start</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Use your API key in the request headers or as a query parameter:
        </p>
        <code className="text-xs font-mono block bg-background p-3 rounded border border-border">
          {`https://snapog.com/api/og?apiKey=YOUR_KEY&template=tech-dark&title=My+Page`}
        </code>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <ApiKeyTable
          apiKeys={apiKeys}
          onCreateKey={handleCreateKey}
          onDeleteKey={handleDeleteKey}
        />
      )}
    </div>
  );
}
