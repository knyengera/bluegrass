import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class EmailService {
  private resend: Resend;
  private orderConfirmationTemplate: string;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY as string);
    this.orderConfirmationTemplate = fs.readFileSync(
      path.join(__dirname, '../templates/order_confirmation.html'),
      'utf-8'
    );
  }

  private formatCurrency(amount: number): string {
    return amount.toFixed(2);
  }

  private generateOrderItemsHTML(items: Array<{ name: string; quantity: number; price: number }>): string {
    return items.map(item => {
      const subtotal = item.quantity * item.price;
      return `
        <tr class="order-item">
          <td style="text-align: left; padding: 10px;">${item.name}</td>
          <td style="text-align: center; padding: 10px;">${item.quantity}</td>
          <td style="text-align: right; padding: 10px;">R${this.formatCurrency(item.price)}</td>
          <td style="text-align: right; padding: 10px;">R${this.formatCurrency(subtotal)}</td>
        </tr>
      `;
    }).join('');
  }

  private formatAddress(address: {
    address1?: string | null;
    address2?: string | null;
    city?: string | null;
    province?: string | null;
    postalCode?: string | null;
    country?: string | null;
  }): string {
    const parts = [
      address.address1,
      address.address2,
      address.city,
      address.province,
      address.postalCode,
      address.country
    ].filter(Boolean);
    return parts.join(', ');
  }

  async sendEmailVerification(email: string, verificationCode: string) {
    try {
      await this.resend.emails.send({
        from: `Pantry by Marble <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: 'Verify your email address',
        html: `
          <h1>Welcome to Pantry by Marble!</h1>
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

  async sendNewOrderNotification(
    orderId: string, 
    clientEmail: string, 
    adminEmails: string | string[], 
    orderItems: Array<{ name: string; quantity: number; price: number }>,
    userAddress: {
      address1?: string | null;
      address2?: string | null;
      city?: string | null;
      province?: string | null;
      postalCode?: string | null;
      country?: string | null;
    }
  ) {
    try {
      // Calculate order totals
      const subtotal = orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      const deliveryFee = subtotal * 0.1; // 10% delivery fee
      const total = subtotal + deliveryFee;

      // Generate order items HTML
      const orderItemsHTML = this.generateOrderItemsHTML(orderItems);

      // Format addresses
      const formattedAddress = this.formatAddress(userAddress);

      // Replace template placeholders
      const emailHTML = this.orderConfirmationTemplate
        .replace('{{order_items}}', orderItemsHTML)
        .replace('{{order_number}}', orderId)
        .replace('{{subtotal}}', this.formatCurrency(subtotal))
        .replace('{{delivery_fee}}', this.formatCurrency(deliveryFee))
        .replace('{{total}}', this.formatCurrency(total))
        .replace('{{shipping_address}}', formattedAddress)
        .replace('{{billing_address}}', formattedAddress);

      // Send to client
      await this.resend.emails.send({
        from: `Pantry by Marble <${process.env.FROM_EMAIL}>`,
        to: clientEmail,
        subject: 'Order Confirmation',
        html: emailHTML
      });

      // Send to admins
      await this.resend.emails.send({
        from: `Pantry by Marble <${process.env.FROM_EMAIL}>`,
        to: adminEmails,
        subject: 'New Order Received',
        html: emailHTML.replace(
          '<h1 style="margin: 0; color: #001942; font-size: 32px;">Order Confirmation</h1>',
          '<h1 style="margin: 0; color: #001942; font-size: 32px;">New Order Notification</h1>'
        ).replace(
          '<p style="color: #53627a; margin-top: 20px;">Thank you for your order!</p>',
          '<p style="color: #53627a; margin-top: 20px;">A new order has been placed. Please process it as soon as possible.</p>'
        )
      });
    } catch (error) {
      console.error('Failed to send order notification:', error);
      throw error;
    }
  }

  async sendOrderStatusUpdate(orderId: string, emails: string | string[], status: string) {
    try {
      await this.resend.emails.send({
        from: `Pantry by Marble <${process.env.FROM_EMAIL}>`,
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
        from: `Pantry by Marble <${process.env.FROM_EMAIL}>`,
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
        from: `Pantry by Marble <${process.env.FROM_EMAIL}>`,
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

  async sendNewUserNotification(adminEmails: string | string[], userEmail: string, userName: string) {
    try {
      await this.resend.emails.send({
        from: `Pantry by Marble <${process.env.FROM_EMAIL}>`,
        to: adminEmails,
        subject: 'New User Registration',
        html: `
          <h1>New User Registration</h1>
          <p>A new user has registered on the platform:</p>
          <ul>
            <li>Name: ${userName}</li>
            <li>Email: ${userEmail}</li>
          </ul>
          <p>Please verify their account if required.</p>
        `
      });
    } catch (error) {
      console.error('Failed to send new user notification:', error);
      throw error;
    }
  }
} 