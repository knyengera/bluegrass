import { Resend } from 'resend';

export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmailVerification(email: string, verificationCode: string) {
    try {
      await this.resend.emails.send({
        from: 'Pantry by Marble <noreply@pantrybymarble.com>',
        to: email,
        subject: 'Verify your email address',
        html: `
          <h1>Welcome to Bluegrass!</h1>
          <p>Please verify your email address by entering the following code in the app:</p>
          <h2>${verificationCode}</h2>
          <p>This code will expire in 24 hours.</p>
        `
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw error;
    }
  }

  async sendNewOrderNotification(orderId: string, clientEmail: string, adminEmails: string | string[]) {
    try {
      // Send to client
      await this.resend.emails.send({
        from: 'Pantry by Marble <noreply@pantrybymarble.com>',
        to: clientEmail,
        subject: 'Order Confirmation',
        html: `
          <h1>Thank you for your order!</h1>
          <p>Your order #${orderId} has been received and is being processed.</p>
          <p>We'll notify you when your order status changes.</p>
        `
      });

      // Send to admins
      await this.resend.emails.send({
        from: 'Pantry by Marble <noreply@pantrybymarble.com>',
        to: adminEmails,
        subject: 'New Order Received',
        html: `
          <h1>New Order Notification</h1>
          <p>A new order #${orderId} has been placed.</p>
          <p>Please process this order as soon as possible.</p>
        `
      });
    } catch (error) {
      console.error('Failed to send order notification:', error);
      throw error;
    }
  }

  async sendOrderStatusUpdate(orderId: string, emails: string | string[], status: string) {
    try {
      await this.resend.emails.send({
        from: 'Pantry by Marble <noreply@pantrybymarble.com>',
        to: emails,
        subject: 'Order Status Update',
        html: `
          <h1>Order Status Update</h1>
          <p>Order #${orderId} status has been updated to: ${status}</p>
        `
      });
    } catch (error) {
      console.error('Failed to send order status update:', error);
      throw error;
    }
  }

  async sendLowStockNotification(adminEmails: string | string[], products: { name: string; currentStock: number }[]) {
    try {
      const productList = products.map(p => `<li>${p.name} - Current stock: ${p.currentStock}</li>`).join('');
      
      await this.resend.emails.send({
        from: 'Pantry by Marble <noreply@pantrybymarble.com>',
        to: adminEmails,
        subject: 'Low Stock Alert',
        html: `
          <h1>Low Stock Alert</h1>
          <p>The following products are running low on stock:</p>
          <ul>
            ${productList}
          </ul>
          <p>Please restock these items as soon as possible.</p>
        `
      });
    } catch (error) {
      console.error('Failed to send low stock notification:', error);
      throw error;
    }
  }

  async sendPasswordReset(email: string, newPassword: string) {
    try {
      await this.resend.emails.send({
        from: 'Pantry by Marble <noreply@pantrybymarble.com>',
        to: email,
        subject: 'Password Reset',
        html: `
          <h1>Password Reset</h1>
          <p>Your password has been reset. Here is your new password:</p>
          <p><strong>${newPassword}</strong></p>
          <p>Please change this password after logging in.</p>
        `
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw error;
    }
  }
} 