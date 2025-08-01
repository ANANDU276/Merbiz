// // utils/sendEmail.js
// const nodemailer = require("nodemailer");

// const sendOrderConfirmationEmail = async (to, order) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const itemsList = order.items.map(
//     (item) => `<li>${item.name} × ${item.quantity} = ₹${item.price * item.quantity}</li>`
//   ).join("");

//   const mailOptions = {
//     from: `"Merbiz" <${process.env.EMAIL_USER}>`,
//     to,
//     subject: "🛒 Order Confirmation",
//     html: `
//       <h2>Thank you for your order!</h2>
//       <p>Hi ${order.shippingAddress.firstName}, your order has been received.</p>
//       <h4>Order Details:</h4>
//       <ul>${itemsList}</ul>
//       <p><strong>Total:</strong> ₹${order.total}</p>
//       <p>Status: ${order.status}</p>
//       <p>We’ll notify you when it’s shipped.</p>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("✅ Order confirmation email sent to", to);
//   } catch (error) {
//     console.error("❌ Failed to send email:", error);
//   }
// };

// module.exports = sendOrderConfirmationEmail;

const sendOrderConfirmationEmail = async (to, order) => {
  console.log("[Email Disabled] Would send order confirmation to:", to);
  console.log("Order details:", order);
  return; // Exit early without sending
};

// THIS LINE IS STILL NECESSARY
module.exports = sendOrderConfirmationEmail;
