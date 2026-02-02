const Sib = require("sib-api-v3-sdk");

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  console.log("Request received:", email);

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    // Initialize Sendinblue
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sendSmtpEmail = {
      to: [{ email: "pratikshawanjari23@gmail.com" }],// send to user email
      sender: { email: "pratikshawanjari23@gmail.com", name: "Expense Tracker" },
      subject: "Password Reset Request",
      htmlContent: `<h3>Password Reset</h3><p>Click <a href="#">here</a> to reset your password.</p>`,
    };

    await tranEmailApi.sendTransacEmail(sendSmtpEmail);

    res.status(200).json({ message: "Password reset link sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending email", error: error.response?.body || error.message });
  }
};
