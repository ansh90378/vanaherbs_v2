export default function handler(req, res) {
    const number = process.env.WHATSAPP_NUMBER;
  
    if (!number) {
      res.status(500).send("WhatsApp number not configured.");
      return;
    }
  
    const text = typeof req.query.text === "string" ? req.query.text : "";
    const target = `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
  
    res.writeHead(302, { Location: target });
    res.end();
  }