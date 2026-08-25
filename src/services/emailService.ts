import emailjs, { send, init } from '@emailjs/browser';

export interface SendDermaVisionEmailParams {
  toEmail: string;
  name?: string;
  notificationTitle: string;
  message: string;
  appointmentDate?: string;
  appointmentTime?: string;
  doctorName?: string;
  conditionName?: string;
  confidence?: number | string;
  riskLevel?: string;
  scanDate?: string;
}

export interface SendDermaVisionEmailResult {
  success: boolean;
  recipientEmail: string;
  status?: string;
  error?: string;
}

// Read EmailJS credentials from Vite environment variables (Updated: service_4n9sk5l, template_xf71trs)
const metaEnv = (import.meta as any).env || {};
const SERVICE_ID = metaEnv.VITE_EMAILJS_SERVICE_ID || 'service_4n9sk5l';
const TEMPLATE_ID = metaEnv.VITE_EMAILJS_TEMPLATE_ID || 'template_xf71trs';
const PUBLIC_KEY = metaEnv.VITE_EMAILJS_PUBLIC_KEY || 'xhkqRY1oAMS-7kYwe';

let isInitialized = false;

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return 'un***@invalid';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local.slice(0, 3)}***@${domain}`;
}

export function initEmailJS(): void {
  if (!isInitialized && PUBLIC_KEY) {
    try {
      if (typeof init === 'function') {
        init({ publicKey: PUBLIC_KEY });
      } else if (emailjs && typeof emailjs.init === 'function') {
        emailjs.init({ publicKey: PUBLIC_KEY });
      }
      isInitialized = true;
    } catch (e) {
      console.warn('[EMAILJS NOTICE] Initialization warning:', e);
    }
  }
}

/**
 * Core Dual-Engine EmailJS Dispatch Service (SDK + Direct HTTP Fetch Fallback).
 * Includes safe debug logging for tracing user actions -> send execution -> API response.
 */
export async function sendDermaVisionEmail({
  toEmail,
  name,
  notificationTitle,
  message,
  appointmentDate,
  appointmentTime,
  doctorName,
  conditionName,
  confidence,
  riskLevel,
  scanDate
}: SendDermaVisionEmailParams): Promise<SendDermaVisionEmailResult> {
  console.log('[EMAILJS DEBUG] EMAIL TRIGGER STARTED');
  console.log('[EMAILJS DEBUG] EMAILJS FUNCTION CALLED');
  console.log(`[EMAILJS DEBUG] SERVICE CONFIGURED: ${Boolean(SERVICE_ID)}`);
  console.log(`[EMAILJS DEBUG] TEMPLATE CONFIGURED: ${Boolean(TEMPLATE_ID)}`);
  console.log(`[EMAILJS DEBUG] PUBLIC KEY CONFIGURED: ${Boolean(PUBLIC_KEY)}`);

  const hasUserEmail = Boolean(toEmail && typeof toEmail === 'string' && toEmail.includes('@') && toEmail.trim().length >= 5);
  const recipientEmail = hasUserEmail ? toEmail.trim() : '';

  if (!hasUserEmail) {
    console.warn('[EMAILJS DEBUG] EMAILJS SKIPPED: Recipient email unavailable or invalid:', toEmail);
    return {
      success: false,
      recipientEmail: toEmail || '',
      error: 'Missing or invalid recipient email address'
    };
  }

  const recipientName = name || 'DermaVision Patient';
  const title = notificationTitle || 'Notification';

  const templateParams = {
    to_email: recipientEmail,
    user_email: recipientEmail,
    recipient_email: recipientEmail,
    email: recipientEmail,
    
    to_name: recipientName,
    user_name: recipientName,
    name: recipientName,
    from_name: 'DermaVision AI',

    notification_title: title,
    subject: title,
    message: message,

    appointment_date: appointmentDate || '',
    appointment_time: appointmentTime || '',
    doctor_name: doctorName || 'Dr. Sarah Smith, MD',
    condition_name: conditionName || '',
    condition: conditionName || '',
    confidence: confidence ? String(confidence) : '',
    risk_level: riskLevel || '',
    scan_date: scanDate || new Date().toLocaleDateString()
  };

  console.log('[EMAILJS DEBUG] EMAILJS SEND STARTED');

  // Engine 1: Official @emailjs/browser SDK
  try {
    initEmailJS();
    const sendFn = typeof send === 'function' ? send : (emailjs && emailjs.send ? emailjs.send : null);
    if (sendFn) {
      let res;
      try {
        res = await sendFn(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      } catch (e1) {
        res = await sendFn(SERVICE_ID, TEMPLATE_ID, templateParams, { publicKey: PUBLIC_KEY });
      }
      console.log(`[EMAILJS DEBUG] EMAILJS RESPONSE STATUS: ${res.status}`);
      console.log(`[EMAILJS DEBUG] EMAILJS RESPONSE TEXT: ${res.text || 'OK'}`);
      return {
        success: res.status === 200,
        recipientEmail,
        status: res.text || 'OK'
      };
    }
  } catch (sdkError: any) {
    console.warn('[EMAILJS DEBUG] SDK engine notice, attempting Direct HTTP Engine:', sdkError?.text || sdkError?.message || sdkError);
  }

  // Engine 2: Direct HTTP Fetch API Fallback
  try {
    const httpRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params: templateParams
      })
    });

    const respText = await httpRes.text();
    console.log(`[EMAILJS DEBUG] EMAILJS RESPONSE STATUS: ${httpRes.status}`);
    console.log(`[EMAILJS DEBUG] EMAILJS RESPONSE TEXT: ${respText}`);

    if (httpRes.ok) {
      return {
        success: true,
        recipientEmail,
        status: respText || 'OK'
      };
    } else {
      console.error(`[EMAILJS DEBUG] EMAILJS ERROR:\nHTTP ${httpRes.status}: ${respText}`);
      return {
        success: false,
        recipientEmail,
        error: `HTTP ${httpRes.status}: ${respText}`
      };
    }
  } catch (httpErr: any) {
    const errorMsg = httpErr?.message || String(httpErr);
    console.error(`[EMAILJS DEBUG] EMAILJS ERROR:\n${errorMsg}`);
    return {
      success: false,
      recipientEmail,
      error: errorMsg
    };
  }
}

/**
 * Appointment Confirmation Helper
 */
export async function sendAppointmentConfirmation(data: {
  patientEmail: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorName?: string;
}): Promise<SendDermaVisionEmailResult> {
  const doctor = data.doctorName || 'Dr. Sarah Smith, MD';
  const bodyMessage =
    `Hello ${data.patientName},\n\n` +
    `Your DermaVision AI dermatologist consultation appointment has been successfully confirmed.\n\n` +
    `Doctor: ${doctor}\n` +
    `Date: ${data.appointmentDate}\n` +
    `Time: ${data.appointmentTime}\n\n` +
    `Please log in to your DermaVision AI patient account to view your appointment details.\n\n` +
    `Regards,\nDermaVision AI Team`;

  return sendDermaVisionEmail({
    toEmail: data.patientEmail,
    name: data.patientName,
    notificationTitle: 'Appointment Confirmed',
    message: bodyMessage,
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,
    doctorName: doctor
  });
}

/**
 * Appointment Reminder Helper
 */
export async function sendAppointmentReminder(data: {
  patientEmail: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorName?: string;
}): Promise<SendDermaVisionEmailResult> {
  const doctor = data.doctorName || 'Dr. Sarah Smith, MD';
  const bodyMessage =
    `Hello ${data.patientName},\n\n` +
    `This is a reminder that your DermaVision AI doctor consultation is scheduled for ${data.appointmentDate} at ${data.appointmentTime} with ${doctor}.\n\n` +
    `Please keep your account accessible for the consultation.\n\n` +
    `Regards,\nDermaVision AI Team`;

  return sendDermaVisionEmail({
    toEmail: data.patientEmail,
    name: data.patientName,
    notificationTitle: 'Appointment Reminder',
    message: bodyMessage,
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,
    doctorName: doctor
  });
}

/**
 * Screening Report Available Helper
 */
export async function sendReportNotification(data: {
  patientEmail: string;
  patientName: string;
  condition: string;
  confidence: number;
  riskLevel: string;
  scanDate?: string;
}): Promise<SendDermaVisionEmailResult> {
  const bodyMessage =
    `Hello ${data.patientName},\n\n` +
    `Your DermaVision AI skin screening report is ready.\n\n` +
    `Finding: ${data.condition}\n` +
    `Confidence: ${data.confidence}%\n` +
    `Risk Level: ${data.riskLevel}\n\n` +
    `Please log in to review your complete report.\n\n` +
    `Regards,\nDermaVision AI Team`;

  return sendDermaVisionEmail({
    toEmail: data.patientEmail,
    name: data.patientName,
    notificationTitle: 'Screening Report Available',
    message: bodyMessage,
    conditionName: data.condition,
    confidence: data.confidence,
    riskLevel: data.riskLevel,
    scanDate: data.scanDate
  });
}
