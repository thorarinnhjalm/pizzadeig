import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Ógilt netfang / Invalid email' },
        { status: 400 }
      );
    }

    // 1. Add contact to Resend audience
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (audienceId) {
      await resend.contacts.create({
        email,
        audienceId,
      });
    }

    // 2. Send welcome email
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Pizzadeig.is <noreply@pizzadeig.is>',
      to: email,
      subject: 'Velkomin í Pizzupóstinn! 🍕',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1C1410; color: #F5F0E8; padding: 40px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 32px; color: #D97706; margin: 0;">🍕 Pizzadeig.is</h1>
          </div>
          <h2 style="color: #F5F0E8; font-size: 24px;">Velkomin í Pizzupóstinn!</h2>
          <p style="color: #C4B5A0; font-size: 16px; line-height: 1.6;">
            Þú ert nú skráð/ur á póstlista Pizzadeig.is. Við munum senda þér:<br/><br/>
            🔥 Nýjustu og bestu uppskriftirnar<br/>
            🧑‍🍳 Ráð og leiðbeiningar frá sérfræðingum<br/>
            📍 Nýjustu pizzustaðina á Íslandi<br/>
            🎉 Sértilboð og viðburði
          </p>
          <div style="margin-top: 32px; text-align: center;">
            <a href="https://pizzadeig.is" style="display: inline-block; background: #B91C1C; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Skoða uppskriftir →
            </a>
          </div>
          <p style="color: #8B7D6B; font-size: 12px; margin-top: 40px; text-align: center;">
            Ef þú vilt afskrá þig, smelltu <a href="https://pizzadeig.is/afskra" style="color: #D97706;">hér</a>.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json(
      { error: 'Villa kom upp / An error occurred' },
      { status: 500 }
    );
  }
}
