const PLACEHOLDER_TOKENS = ['placeholder', 'your_supabase', 'your_'];

function isMissingOrPlaceholder(value?: string): boolean {
  if (!value) return true;

  const normalized = value.trim().toLowerCase();
  if (!normalized) return true;

  return PLACEHOLDER_TOKENS.some((token) => normalized.includes(token));
}

export function getSupabaseConfigError(): string | null {
  if (
    isMissingOrPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
    isMissingOrPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  ) {
    return 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.';
  }

  return null;
}
