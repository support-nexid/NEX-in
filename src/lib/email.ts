import { Resend } from 'resend';

// Primary key for transactional emails from the platform (e.g. hello@nexid.in)
const primaryResend = new Resend(process.env.RESEND_API_KEY);

// Support key for emails originating from the support subdomain (e.g. help@support.nexid.in)
const supportResend = new Resend(process.env.RESEND_SUPPORT_API_KEY);

interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Sends an email using the primary domain (nexid.in)
 */
export async function sendPrimaryEmail(payload: EmailPayload) {
  try {
    const data = await primaryResend.emails.send({
      from: 'NexId <hello@nexid.in>',
      ...payload,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending primary email:', error);
    return { success: false, error };
  }
}

/**
 * Sends an email using the support subdomain (support.nexid.in) 
 * Used for ticket updates, helpdesk responses, etc.
 */
export async function sendSupportEmail(payload: EmailPayload) {
  try {
    const data = await supportResend.emails.send({
      from: 'NexId Support <help@support.nexid.in>',
      ...payload,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending support email:', error);
    return { success: false, error };
  }
}
