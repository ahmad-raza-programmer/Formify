import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import Papa from 'papaparse';
import { sendEmail } from '../lib/email';

export const submitResponse = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    const { data } = req.body;
    const ip_address = req.ip || req.headers['x-forwarded-for'] || '';
    const user_agent = req.headers['user-agent'] || '';

    // Verify form exists and is published
    const { data: form, error: formError } = await supabaseAdmin
      .from('forms')
      .select('is_published, response_count, user_id, title')
      .eq('id', formId)
      .single();

    if (formError || !form) return res.status(404).json({ error: 'Form not found' });
    if (!form.is_published) return res.status(403).json({ error: 'Form is not accepting responses' });

    const { data: responseData, error } = await supabaseAdmin
      .from('responses')
      .insert([
        {
          form_id: formId,
          data,
          ip_address,
          user_agent,
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Increment response count manually
    const currentCount = form.response_count || 0;
    await supabaseAdmin
      .from('forms')
      .update({ response_count: currentCount + 1 })
      .eq('id', formId);

    res.status(201).json(responseData);

    // Send email notification asynchronously (don't await to avoid blocking the response)
    try {
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(form.user_id);
      
      if (!userError && userData?.user?.email) {
        const emailContent = `
          <h2>New Response Received!</h2>
          <p>You have received a new response for your form: <strong>${form.title}</strong></p>
          <p>Response details:</p>
          <ul>
            ${Object.entries(data).map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('')}
          </ul>
          <p><a href="${process.env.VITE_APP_URL || 'http://localhost:3000'}/forms/${formId}/responses">View all responses</a></p>
        `;

        await sendEmail(
          userData.user.email,
          `New Response: ${form.title}`,
          `You have received a new response for your form: ${form.title}`,
          emailContent
        );
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
    }

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getResponses = async (req: AuthRequest, res: Response) => {
  try {
    const { formId } = req.params;
    const userId = req.user.id;

    // Check ownership
    const { data: form, error: formError } = await supabaseAdmin
      .from('forms')
      .select('id')
      .eq('id', formId)
      .eq('user_id', userId)
      .single();

    if (formError || !form) return res.status(403).json({ error: 'Unauthorized' });

    const { data, error } = await supabaseAdmin
      .from('responses')
      .select('*')
      .eq('form_id', formId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const exportResponses = async (req: AuthRequest, res: Response) => {
  try {
    const { formId } = req.params;
    const userId = req.user.id;

    // Check ownership and get form fields for headers
    const { data: form, error: formError } = await supabaseAdmin
      .from('forms')
      .select('fields, title')
      .eq('id', formId)
      .eq('user_id', userId)
      .single();

    if (formError || !form) return res.status(403).json({ error: 'Unauthorized' });

    const { data: responses, error } = await supabaseAdmin
      .from('responses')
      .select('*')
      .eq('form_id', formId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    const fields = form.fields as any[];
    
    const csvData = responses.map(response => {
      const row: any = { 'Submitted At': new Date(response.submitted_at).toLocaleString() };
      fields.forEach(field => {
        row[field.label] = response.data[field.id] || '';
      });
      return row;
    });

    const csv = Papa.unparse(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${form.title}-responses.csv"`);
    res.send(csv);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
