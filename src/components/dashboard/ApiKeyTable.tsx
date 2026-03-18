'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Trash2, Plus, Copy, Check } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { ApiKeyListItem } from '@/types';

interface ApiKeyTableProps {
  apiKeys: ApiKeyListItem[];
  onCreateKey: (name: string) => Promise<{ key: string } | null>;
  onDeleteKey: (id: string) => Promise<void>;
}

export const ApiKeyTable = ({ apiKeys, onCreateKey, onDeleteKey }: ApiKeyTableProps) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;
    setLoading(true);
    const result = await onCreateKey(newKeyName.trim());
    if (result) {
      setCreatedKey(result.key);
      setNewKeyName('');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (!createdKey) return;
    navigator.clipboard.writeText(createdKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseCreate = () => {
    setShowCreate(false);
    setCreatedKey(null);
    setNewKeyName('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">API Keys</h2>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Key
        </Button>
      </div>

      {apiKeys.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
          <p className="mb-3">No API keys yet</p>
          <Button variant="outline" size="sm" onClick={() => setShowCreate(true)}>
            Create your first API key
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Key</th>
                <th className="text-left px-4 py-3 font-medium">Created</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key, i) => (
                <tr
                  key={key.id}
                  className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
                >
                  <td className="px-4 py-3 font-medium">{key.name}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">
                    {key.key_prefix}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(key.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={key.is_active ? 'default' : 'secondary'}>
                      {key.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDeleteKey(key.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Key Dialog */}
      <Dialog open={showCreate} onOpenChange={handleCloseCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {createdKey ? 'API Key Created' : 'Create New API Key'}
            </DialogTitle>
          </DialogHeader>

          {createdKey ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your API key has been created. Copy it now — it won&apos;t be shown again.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 bg-muted rounded text-sm font-mono break-all">
                  {createdKey}
                </code>
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Key Name</label>
                <Input
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Production, My App"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            {createdKey ? (
              <Button onClick={handleCloseCreate}>Done</Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCloseCreate}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={loading || !newKeyName.trim()}>
                  {loading ? 'Creating...' : 'Create Key'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
