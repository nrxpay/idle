import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Edit, Save, X } from "lucide-react";

interface TeamRow {
  user_id: string;
  username?: string | null;
  team_members: number;
  total_earned: number;
  direct_referrals?: number;
}

export default function TeamManagement() {
  const { user } = useAuth();
  const [rows, setRows] = useState<TeamRow[]>([]);
  const [debug, setDebug] = useState<{ isAdmin?: boolean | null; lastError?: string | null }>({ isAdmin: null, lastError: null });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [localEdits, setLocalEdits] = useState<Record<string, Partial<TeamRow>>>({});
  const { toast } = useToast();

  const fetchRows = async () => {
    setLoading(true);
    try {
      // First fetch team_stats rows only (avoid relational selects which can fail under some RLS setups)
      const { data: stats, error: statsError, count } = await supabase
        .from("team_stats")
        .select('user_id, team_members, total_earned, direct_referrals', { count: 'exact' })
        .order('total_earned', { ascending: false });

      console.log('team_stats response', { stats, statsError, count });

      if (statsError) {
        setDebug(d => ({ ...d, lastError: statsError.message }));
        throw statsError;
      } else {
        setDebug(d => ({ ...d, lastError: null }));
      }

      const userIds = (stats || []).map((s: any) => s.user_id).filter(Boolean);

      let usersMap: Record<string, string | null> = {};
      if (userIds.length) {
        // Fetch usernames in a separate call
        const { data: users, error: usersError } = await supabase
          .from('user_data')
          .select('user_id, username')
          .in('user_id', userIds);

        if (usersError) {
          // Non-fatal: continue without usernames
          console.warn('Could not fetch usernames for team_stats', usersError);
        } else {
          usersMap = (users || []).reduce((acc: any, u: any) => ({ ...acc, [u.user_id]: u.username }), {});
        }
      }

      const formatted = (stats || []).map((r: any) => ({
        user_id: r.user_id,
        username: usersMap[r.user_id] ?? null,
        team_members: r.team_members ?? 0,
        total_earned: r.total_earned ?? 0,
        direct_referrals: r.direct_referrals ?? 0,
      }));

      // Use only team_stats + usernames for admin listing (teams table is optional)
      setRows(formatted as any);

      // Also check is_admin RPC for the current user (helpful for debugging RLS)
      try {
        if (user?.id) {
          const { data: isAdminData, error: rpcError } = await supabase.rpc('is_admin', { check_user_id: user.id });
          if (rpcError) {
            console.warn('is_admin RPC error', rpcError);
            setDebug(d => ({ ...d, isAdmin: null, lastError: rpcError.message }));
          } else {
            setDebug(d => ({ ...d, isAdmin: !!isAdminData, lastError: null }));
          }
        }
      } catch (e: any) {
        console.warn('is_admin rpc failed', e);
        setDebug(d => ({ ...d, isAdmin: null, lastError: e?.message || String(e) }));
      }
    } catch (err) {
      console.error('Failed to fetch team stats', err);
      toast({ title: 'Error', description: 'Unable to fetch team stats', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRows(); }, []);

  const startEdit = (id: string) => {
    setEditingId(id);
    const current = rows.find(r => r.user_id === id);
    setLocalEdits(prev => ({ ...prev, [id]: { team_members: current?.team_members, total_earned: current?.total_earned } }));
  };

  const cancelEdit = (id: string) => {
    setEditingId(null);
    setLocalEdits(prev => { const copy = { ...prev }; delete copy[id]; return copy; });
  };

  const saveEdit = async (id: string) => {
    const changes = localEdits[id];
    if (!changes) return;

    try {
      const { error } = await supabase
        .from('team_stats')
        .upsert({ user_id: id, ...changes }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({ title: 'Saved', description: 'Team stats updated' });
      setEditingId(null);
      setLocalEdits(prev => { const copy = { ...prev }; delete copy[id]; return copy; });
      fetchRows();
    } catch (err) {
      console.error('Failed to save', err);
      toast({ title: 'Error', description: 'Failed to save changes', variant: 'destructive' });
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
  );

  return (
    <>
      <div className="max-w-3xl mx-auto p-4">
        <div className="rounded-md bg-slate-50 border p-3 text-sm text-slate-800">
          <div><strong>Debug</strong></div>
          <div>Current user id: {user?.id ?? 'not-signed-in'}</div>
          <div>is_admin RPC: {debug.isAdmin === null ? 'unknown' : debug.isAdmin ? 'true' : 'false'}</div>
          <div>Fetched rows: {rows.length}</div>
          {debug.lastError && <div className="text-red-600">Last error: {debug.lastError}</div>}
        </div>
      </div>
      {/* If only one row is visible and it belongs to current user, hint that session may not be admin */}
      {user && rows.length <= 1 && rows[0] && rows[0].user_id === user.id && (
        <div className="max-w-3xl mx-auto p-4">
          <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-900">
            It looks like you're only seeing your own team stats. This usually means your session is not an admin and RLS is limiting visibility.
            To make a user an admin run the following SQL in Supabase (replace &lt;USER_UUID&gt;):
            <pre className="mt-2 p-2 bg-white rounded text-xs text-muted-foreground">INSERT INTO public.user_roles (user_id, role) VALUES ('&lt;USER_UUID&gt;', 'admin') ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;</pre>
            After running it, sign out and sign back in to refresh your session.
          </div>
        </div>
      )}
      <Card>
      <CardHeader>
        <CardTitle>Team Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Team Members</TableHead>
                <TableHead>Total Earned</TableHead>
                <TableHead>Direct Referrals</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row: any) => (
                <TableRow key={row.user_id}>
                  <TableCell className="font-medium">{row.username || row.user_id}</TableCell>
                  <TableCell>
                    {editingId === row.user_id ? (
                      <Input
                        type="number"
                        value={localEdits[row.user_id]?.team_members as any || ''}
                        onChange={(e) => setLocalEdits(prev => ({ ...prev, [row.user_id]: { ...prev[row.user_id], team_members: parseInt(e.target.value || '0') } }))}
                        className="w-24"
                      />
                    ) : (
                      <div>
                        <div>{row.team_members}</div>
                        {row.explicit_members && row.explicit_members.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Members: {row.explicit_members.map((m: any) => m.name).join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === row.user_id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={localEdits[row.user_id]?.total_earned as any || ''}
                        onChange={(e) => setLocalEdits(prev => ({ ...prev, [row.user_id]: { ...prev[row.user_id], total_earned: parseFloat(e.target.value || '0') } }))}
                        className="w-32"
                      />
                    ) : (
                      row.total_earned
                    )}
                  </TableCell>
                  <TableCell>{row.direct_referrals ?? 0}</TableCell>
                  <TableCell>
                    {editingId === row.user_id ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveEdit(row.user_id)}><Save className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => cancelEdit(row.user_id)}><X className="h-4 w-4" /></Button>
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => startEdit(row.user_id)}><Edit className="h-4 w-4" /></Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      </Card>
    </>
  );
}
