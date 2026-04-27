import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendRSVPConfirmation({ 
  to, 
  userName, 
  eventTitle, 
  eventDate, 
  eventLocation,
  ticketUrl 
}: { 
  to: string, 
  userName: string, 
  eventTitle: string, 
  eventDate: string,
  eventLocation: string,
  ticketUrl: string
}) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not set. Email not sent.");
    console.log(`Email content summary: RSVP confirmation for ${eventTitle} sent to ${to}`);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Gatherly <onboarding@resend.dev>',
      to: [to],
      subject: `Your Ticket for ${eventTitle}!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h1 style="color: #111827; margin-bottom: 24px;">Gatherly</h1>
          <p style="color: #374151; font-size: 16px;">Hi ${userName},</p>
          <p style="color: #374151; font-size: 16px;">Your RSVP for <strong>${eventTitle}</strong> is confirmed!</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Event Details:</p>
            <p style="margin: 8px 0 0 0; color: #111827; font-weight: 600;">${eventDate}</p>
            <p style="margin: 4px 0 0 0; color: #4b5563;">${eventLocation}</p>
          </div>

          <p style="color: #374151; font-size: 16px;">You can view your ticket and QR code by clicking the link below:</p>
          <a href="${ticketUrl}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">View My Ticket</a>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">See you there,<br>The Gatherly Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
    }
    return data;
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
