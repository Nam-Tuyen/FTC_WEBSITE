-- Create forum schema
create type public.forum_category as enum (
  'CLUB',      -- Hỏi về câu lạc bộ
  'MAJOR',     -- Hỏi về ngành học
  'DISCUSSION' -- Thảo luận
);

-- Profiles table (for users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  student_id text check (student_id ~ '^K\d{9}$'),
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Questions table
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category forum_category not null default 'GENERAL',
  author_id uuid not null references public.profiles(id) on delete cascade,
  is_anonymous boolean not null default false,
  likes int not null default 0,
  replies_count int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.questions enable row level security;

create policy "Questions are viewable by everyone"
  on questions for select
  using (true);

create policy "Authenticated users can insert questions"
  on questions for insert
  with check (auth.uid() = author_id);

create policy "Users can update own questions"
  on questions for update
  using (auth.uid() = author_id);

-- Replies table
create table public.replies (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  content text not null,
  author_id uuid not null references public.profiles(id) on delete cascade,
  is_anonymous boolean not null default false,
  likes int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.replies enable row level security;

create policy "Replies are viewable by everyone"
  on replies for select
  using (true);

create policy "Authenticated users can insert replies"
  on replies for insert
  with check (auth.uid() = author_id);

create policy "Users can update own replies"
  on replies for update
  using (auth.uid() = author_id);

-- Likes table for both questions and replies
create table public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  question_id uuid references public.questions(id) on delete cascade,
  reply_id uuid references public.replies(id) on delete cascade,
  created_at timestamptz default now(),
  check (
    (question_id is null and reply_id is not null) or
    (question_id is not null and reply_id is null)
  )
);
alter table public.likes enable row level security;

create unique index likes_question_user_idx on public.likes (user_id, question_id) where question_id is not null;
create unique index likes_reply_user_idx on public.likes (user_id, reply_id) where reply_id is not null;

create policy "Likes are viewable by everyone"
  on likes for select
  using (true);

create policy "Authenticated users can insert likes"
  on likes for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own likes"
  on likes for delete
  using (auth.uid() = user_id);

-- Functions
create or replace function public.toggle_like_question(qid uuid)
returns table (liked boolean, like_count int) language plpgsql security definer as $$
declare
  v_user_id uuid := auth.uid();
  v_exists boolean;
begin
  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  select exists(
    select 1 from public.likes
    where user_id = v_user_id and question_id = qid
  ) into v_exists;

  if v_exists then
    delete from public.likes
    where user_id = v_user_id and question_id = qid;

    update public.questions
    set likes = likes - 1
    where id = qid;

    liked := false;
  else
    insert into public.likes (user_id, question_id)
    values (v_user_id, qid);

    update public.questions
    set likes = likes + 1
    where id = qid;

    liked := true;
  end if;

  select likes from public.questions where id = qid into like_count;
  return next;
end;
$$;

create or replace function public.toggle_like_reply(rid uuid)
returns table (liked boolean, like_count int) language plpgsql security definer as $$
declare
  v_user_id uuid := auth.uid();
  v_exists boolean;
begin
  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  select exists(
    select 1 from public.likes
    where user_id = v_user_id and reply_id = rid
  ) into v_exists;

  if v_exists then
    delete from public.likes
    where user_id = v_user_id and reply_id = rid;

    update public.replies
    set likes = likes - 1
    where id = rid;

    liked := false;
  else
    insert into public.likes (user_id, reply_id)
    values (v_user_id, rid);

    update public.replies
    set likes = likes + 1
    where id = rid;

    liked := true;
  end if;

  select likes from public.replies where id = rid into like_count;
  return next;
end;
$$;

-- Triggers for reply count
create or replace function update_question_reply_count()
returns trigger language plpgsql security definer as $$
begin
  if TG_OP = 'INSERT' then
    update public.questions
    set replies_count = replies_count + 1
    where id = NEW.question_id;
  elsif TG_OP = 'DELETE' then
    update public.questions
    set replies_count = replies_count - 1
    where id = OLD.question_id;
  end if;
  return null;
end;
$$;

create trigger update_question_reply_count
after insert or delete on public.replies
for each row execute function update_question_reply_count();

-- Updated timestamp trigger
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$;

create trigger questions_updated_at
before update on public.questions
for each row execute function update_updated_at();

create trigger replies_updated_at
before update on public.replies
for each row execute function update_updated_at();
