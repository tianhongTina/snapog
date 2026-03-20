import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateApiKey, hashApiKey, getKeyPrefix } from '@/lib/utils';
import type { ApiKeyListItem, ApiKeyCreateResponse } from '@/types';

// GET /api/keys - list all API keys for the authenticated user
export const GET = async (_request: NextRequest): Promise<NextResponse> => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: keys, error } = await supabase
    .from('api_keys')
    .select('id, name, key_prefix, created_at, last_used_at, is_active')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('API keys fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch API keys', detail: error.message }, { status: 500 });
  }

  const result: ApiKeyListItem[] = (keys || []).map((k) => ({
    id: k.id as string,
    name: k.name as string,
    key_prefix: k.key_prefix as string,
    created_at: k.created_at as string,
    last_used_at: k.last_used_at as string | undefined,
    is_active: k.is_active as boolean,
  }));

  return NextResponse.json(result);
};

// POST /api/keys - create a new API key
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as { name?: string };
  const { name } = body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return NextResponse.json({ error: 'Key name is required' }, { status: 400 });
  }

  // Generate a new API key
  const plainKey = `sog_${generateApiKey()}`;
  const keyHash = await hashApiKey(plainKey);
  const keyPrefix = getKeyPrefix(plainKey);

  const { data: newKey, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: user.id,
      name: name.trim(),
      key_prefix: keyPrefix,
      key_hash: keyHash,
      is_active: true,
    })
    .select('id, name, key_prefix, created_at')
    .single();

  if (error || !newKey) {
    console.error('API key create error:', error);
    return NextResponse.json({ error: 'Failed to create API key', detail: error?.message }, { status: 500 });
  }

  const response: ApiKeyCreateResponse = {
    id: newKey.id as string,
    name: newKey.name as string,
    key: plainKey, // Plain text key - shown only once
    key_prefix: newKey.key_prefix as string,
    created_at: newKey.created_at as string,
  };

  return NextResponse.json(response, { status: 201 });
};

// DELETE /api/keys - delete an API key
export const DELETE = async (request: NextRequest): Promise<NextResponse> => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Key ID is required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('api_keys')
    .update({ is_active: false })
    .eq('id', id)
    .eq('user_id', user.id); // Ensure user owns the key

  if (error) {
    return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
};
