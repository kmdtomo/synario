import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function checkTeamAccess(
  req: NextRequest, 
  supabase: SupabaseClient,
  userId: string
) {
  const teamId = req.nextUrl.pathname.split('/')[2];
  if (teamId) {
    const { data: teamMember } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .single();

    if (!teamMember) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
  return null;
} 