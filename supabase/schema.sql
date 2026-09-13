-- ============================================================================
-- LIFE RPG — SUPABASE POSTGRESQL SCHEMA
-- ============================================================================
-- Run this script in the Supabase SQL Editor to initialize all tables,
-- Row Level Security (RLS) policies, triggers, and helper functions.
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & CHARACTER PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT DEFAULT 'cyber-avatar-1',
  current_xp INTEGER NOT NULL DEFAULT 0 CHECK (current_xp >= 0),
  current_level INTEGER NOT NULL DEFAULT 1 CHECK (current_level >= 1),
  current_streak INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INTEGER NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
  last_activity_date DATE,
  -- Character RPG Attributes
  intellect INTEGER NOT NULL DEFAULT 10 CHECK (intellect >= 0),
  strength INTEGER NOT NULL DEFAULT 10 CHECK (strength >= 0),
  discipline INTEGER NOT NULL DEFAULT 10 CHECK (discipline >= 0),
  knowledge INTEGER NOT NULL DEFAULT 10 CHECK (knowledge >= 0),
  mind INTEGER NOT NULL DEFAULT 10 CHECK (mind >= 0),
  -- Currencies & Inventory
  gold INTEGER NOT NULL DEFAULT 850 CHECK (gold >= 0),
  diamonds INTEGER NOT NULL DEFAULT 40 CHECK (diamonds >= 0),
  equipped_frame TEXT DEFAULT 'Fire Frame',
  equipped_theme TEXT DEFAULT 'Galaxy Theme',
  equipped_badge TEXT DEFAULT '7 Day Warrior',
  inventory JSONB DEFAULT '["frame-fire", "theme-galaxy", "badge-7day"]'::jsonb,
  sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. QUESTS TABLE
CREATE TABLE IF NOT EXISTS public.quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Coding', 'Study', 'Fitness', 'Reading', 'Mindfulness', 'Personal')),
  difficulty VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Epic')),
  xp_reward INTEGER NOT NULL CHECK (xp_reward > 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. QUEST COMPLETIONS TABLE (Logs all completions for XP verification & Streak tracking)
CREATE TABLE IF NOT EXISTS public.quest_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quest_id UUID REFERENCES public.quests(id) ON DELETE CASCADE NOT NULL,
  xp_awarded INTEGER NOT NULL CHECK (xp_awarded > 0),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completion_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_quests_user ON public.quests(user_id);
CREATE INDEX IF NOT EXISTS idx_completions_user ON public.quest_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_completions_date ON public.quest_completions(user_id, completion_date);
CREATE INDEX IF NOT EXISTS idx_completions_quest_date ON public.quest_completions(quest_id, completion_date);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_completions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update only their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Quests: Users can CRUD only their own quests
CREATE POLICY "Users can view own quests" 
  ON public.quests FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quests" 
  ON public.quests FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quests" 
  ON public.quests FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quests" 
  ON public.quests FOR DELETE 
  USING (auth.uid() = user_id);

-- Quest Completions: Users can view and insert their own completions
CREATE POLICY "Users can view own completions" 
  ON public.quest_completions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions" 
  ON public.quest_completions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_uname TEXT;
  final_uname TEXT;
  counter INT := 1;
BEGIN
  -- Get requested username or fallback to email prefix
  base_uname := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
  final_uname := base_uname;

  -- Ensure username is unique so it NEVER causes a unique constraint violation
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_uname AND id != NEW.id) LOOP
    final_uname := base_uname || '_' || counter;
    counter := counter + 1;
  END LOOP;

  -- Insert profile safely
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    final_uname,
    COALESCE(NEW.raw_user_meta_data->>'display_name', final_uname)
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    display_name = EXCLUDED.display_name;

  -- Insert default starter quests for the new adventurer
  INSERT INTO public.quests (user_id, title, description, category, difficulty, xp_reward)
  VALUES
    (NEW.id, 'Master JavaScript Fundamentals', 'Solve 1 algorithmic puzzle or study modern ES syntax.', 'Coding', 'Medium', 150),
    (NEW.id, 'Read 20 Pages of a Book', 'Deep focus reading without digital distractions.', 'Reading', 'Easy', 80),
    (NEW.id, 'Physical Training Session', '30 minutes of strength or cardio workout.', 'Fitness', 'Medium', 120),
    (NEW.id, 'Deep Mind Meditation', '10 minutes of mindfulness or breathwork.', 'Mindfulness', 'Easy', 75)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Never fail user creation
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger firing on every auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_quests_updated_at ON public.quests;
CREATE TRIGGER set_quests_updated_at
  BEFORE UPDATE ON public.quests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
