-- Create teams table to store team members for each user (owner)
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(owner_user_id, member_user_id)
);

-- Enable Row Level Security
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Owner policies: owners can manage their team members
CREATE POLICY "Owners can select their team members"
  ON public.teams
  FOR SELECT
  USING (auth.uid() = owner_user_id);

CREATE POLICY "Owners can insert their team members"
  ON public.teams
  FOR INSERT
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Owners can update their team members"
  ON public.teams
  FOR UPDATE
  USING (auth.uid() = owner_user_id)
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Owners can delete their team members"
  ON public.teams
  FOR DELETE
  USING (auth.uid() = owner_user_id);

-- Admins can manage teams (uses existing is_admin function)
CREATE POLICY "Admins can manage teams"
  ON public.teams
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
