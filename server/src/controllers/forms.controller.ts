import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { nanoid } from 'nanoid';

const VALID_FIELD_TYPES = [
  'short_text', 'long_text', 'email', 'phone', 'number', 'date',
  'dropdown', 'checkbox', 'radio', 'rating', 'file_upload', 'url',
  'heading', 'divider'
];

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

const validateFields = (fields: any[]) => {
  if (!Array.isArray(fields)) {
    throw new ValidationError('Fields must be an array');
  }

  for (const field of fields) {
    if (!field.id || typeof field.id !== 'string') {
      throw new ValidationError('Field id is required and must be a string');
    }
    if (!field.type || !VALID_FIELD_TYPES.includes(field.type)) {
      throw new ValidationError(`Invalid field type: ${field.type}`);
    }
    if (typeof field.label !== 'string') {
      throw new ValidationError('Field label is required and must be a string');
    }
    
    if (field.required !== undefined && typeof field.required !== 'boolean') {
      throw new ValidationError('Field required property must be a boolean');
    }

    if (['dropdown', 'checkbox', 'radio'].includes(field.type)) {
      if (field.options !== undefined) {
        if (!Array.isArray(field.options)) {
          throw new ValidationError(`Options for field ${field.id} must be an array`);
        }
        if (field.options.length > 100) {
          throw new ValidationError(`Field ${field.id} cannot have more than 100 options`);
        }
        for (const option of field.options) {
          if (typeof option !== 'string') {
            throw new ValidationError(`All options for field ${field.id} must be strings`);
          }
        }
      }
    }
  }
};

export const createForm = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, fields, settings } = req.body;
    const userId = req.user.id;
    const publicSlug = nanoid(10);

    let parsedFields = [];
    if (fields) {
      validateFields(fields);
      parsedFields = fields;
    }

    const { data, error } = await supabaseAdmin
      .from('forms')
      .insert([
        {
          user_id: userId,
          title: title || 'Untitled Form',
          description: description || '',
          public_slug: publicSlug,
          fields: parsedFields,
          settings: settings || {},
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    require('fs').appendFileSync('error.log', new Date().toISOString() + ' createForm error: ' + error.message + '\n' + JSON.stringify(error) + '\n');
    res.status(500).json({ error: error.message });
  }
};

export const getForms = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabaseAdmin
      .from('forms')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getForm = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from('forms')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Form not found' });

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateForm = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    if (updates.fields) {
      validateFields(updates.fields);
    }

    const { data, error } = await supabaseAdmin
      .from('forms')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteForm = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { error } = await supabaseAdmin
      .from('forms')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPublicForm = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabaseAdmin
      .from('forms')
      .select('id, title, description, fields, settings, is_published')
      .eq('public_slug', slug)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Form not found' });
    if (!data.is_published) return res.status(403).json({ error: 'This form is not available' });

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
