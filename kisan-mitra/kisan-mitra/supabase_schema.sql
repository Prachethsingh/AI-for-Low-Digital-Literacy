create table if not exists user_sessions (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    phone_number text,
    language text default 'en',
    current_state text,
    query text,
    ai_response text
);

create table if not exists scheme_applications (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references user_sessions(id),
    scheme_id text,
    scheme_name text,
    status text default 'pending'
);

create table if not exists analytics_events (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    event_type text,
    event_data jsonb
);

-- Enable realtime
alter publication supabase_realtime add table user_sessions;
alter publication supabase_realtime add table scheme_applications;
