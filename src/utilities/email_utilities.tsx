// import { debug } from './utilities.tsx';
const debug = true;

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
  const message = `Hola ${userInfo.name},<br><br>En el archivo adjunto encontrará el reporte de auditoría de Customer Success.<br><br>Saludos,<br>OTO Visual Flow`;
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
      // .then(response => response.json())
      .then(data => {
        if (data.ok) {
          if (data.url) {
            const urlParams = data.url.split('?')[1];
            const urlParamsArray = urlParams.split('&');
            const responseStatusRaw = urlParamsArray.find(param => param.startsWith('status='));
            const responseStatus = responseStatusRaw ? decodeURIComponent(responseStatusRaw.split('=')[1]) : null;
            if (debug) console.log('>> responseStatus:', responseStatus);
            if (responseStatus && responseStatus.startsWith('Error')) {
              if (debug) console.error('>> Error sending email:', data.statusText);
              alert(responseStatus);
            } else {
              if (debug) console.log('>> Email send response:', data);
              alert('¡Recursos enviados! Revisa tu email para acceder a contenido exclusivo.');
            }
          } else {
            console.error('>> Error sending email:', data.statusText);
            alert('Error enviando email. Por favor intenta de nuevo.');
          }
        } else {
          console.error('>> Error sending email:', data.statusText);
          alert('Error enviando email. Por favor intenta de nuevo.');
        }
      })
      .catch(error => {
          console.error('>> Error sending email:', error);
          alert('Error enviando email. Por favor intenta de nuevo.');
      });
}
