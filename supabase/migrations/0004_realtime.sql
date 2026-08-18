-- Enable Realtime replication so participants see live project/contribution
-- updates without polling (the actual payoff of moving off localStorage for
-- collaborative projects).
alter publication supabase_realtime add table public.projects;
alter publication supabase_realtime add table public.project_participants;
alter publication supabase_realtime add table public.contributions;
