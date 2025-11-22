import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendVerificationCode(email: string, code: string): Promise<void> {
    // TODO: Implementar envio real de email (SendGrid, AWS SES, etc.)
    // Por agora, apenas log
    this.logger.log(`Verification code for ${email}: ${code}`);
    
    // Exemplo com nodemailer (descomentar quando configurado)
    /*
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Código de Verificação',
      html: `
        <h2>Código de Verificação</h2>
        <p>O seu código de verificação é: <strong>${code}</strong></p>
        <p>Este código expira em 15 minutos.</p>
      `,
    });
    */
  }
}

