-- Create forms table
CREATE TABLE public.forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'Untitled Form',
    description TEXT,
    public_slug TEXT UNIQUE NOT NULL,
    fields JSONB DEFAULT '[]'::jsonb NOT NULL,
    settings JSONB DEFAULT '{}'::jsonb NOT NULL,
    is_published BOOLEAN DEFAULT false NOT NULL,
    response_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create responses table
CREATE TABLE public.responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE NOT NULL,
    data JSONB NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- Create policies for forms
CREATE POLICY "Users can view their own forms" ON public.forms
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own forms" ON public.forms
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forms" ON public.forms
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forms" ON public.forms
    FOR DELETE USING (auth.uid() = user_id);

-- Anyone can view published forms (for the public form page)
CREATE POLICY "Anyone can view published forms" ON public.forms
    FOR SELECT USING (is_published = true);

-- Create policies for responses
CREATE POLICY "Users can view responses to their forms" ON public.responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.forms
            WHERE forms.id = responses.form_id AND forms.user_id = auth.uid()
        )
    );

-- Anyone can insert responses to published forms
CREATE POLICY "Anyone can insert responses" ON public.responses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.forms
            WHERE forms.id = responses.form_id AND forms.is_published = true
        )
    );

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('form-uploads', 'form-uploads', true);

-- Storage policies
CREATE POLICY "Anyone can upload files" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'form-uploads');

CREATE POLICY "Anyone can view files" ON storage.objects
    FOR SELECT USING (bucket_id = 'form-uploads');

-- Realtime
alter publication supabase_realtime add table public.responses;
alter publication supabase_realtime add table public.forms;
