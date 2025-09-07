import { debug } from './utilities.tsx';

declare var apiBaseUrl: string;
declare var grecaptcha: any;

export const emailValidation = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const sendToEmail = (doc: any, userInfo: Record<string, any>) => {
  const name = userInfo.name;
  const email = userInfo.email;
  const company = userInfo.company;
  const subject = 'Reporte de Auditoría Customer Success de OTO Visual Flow';
  const message = `Hola ${userInfo.name},<br><br>En el archivo adjunto encontrará el reporte de auditoría de Customer Success.<br><br>Saludos cordiales,<br>OTO Visual Flow`;
  const attachment = doc.output('blob');
  const recaptchaResponse = grecaptcha.getResponse();
  if (debug) console.log('>> sendToEmail | recaptchaResponse:', recaptchaResponse);
  if (!recaptchaResponse) {
    alert('Error al verificar el reCAPTCHA. Por favor intenta de nuevo.');
    return;
  }
  // Send to contact.php as a POST
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('company', company);
  formData.append('subject', subject);
  formData.append('message', message);
  formData.append('referrer', document.referrer);
  formData.append('attachment', attachment, `CS_Audit_Report_${userInfo.company}.pdf`);
  formData.append('g-recaptcha-response', recaptchaResponse);
  formData.append('send_type', 'send_content');
  fetch(`${apiBaseUrl}/php/contact.php`, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (debug) console.log('>> sendToEmail | data:', data);
        if (data.result) {
          alert('¡Recursos enviados! Revisa tu email para acceder a contenido exclusivo.');
        } else {
          console.error('>> Error sending email:', data.message);
          alert(data.message);
        }
      })
      .catch(error => {
          console.error('>> Error sending email:', error);
          alert('Error enviando email. Por favor intenta de nuevo.');
      });
}
