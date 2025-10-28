import emailjs from "@emailjs/browser";

// CONFIGURACIÓN EMAILJS - ¡YA CONFIGURADO! ✅
export const EMAIL_CONFIG = {
  serviceId: "service_6tjijy5",
  templateId: "template_asv05s7",
  publicKey: "QF950Kd0ialrkapaS",
  toEmail: "brajalf@invictustechnologytic.com",
};

export interface Response {
  id?: number;
  answer: "yes" | "no";
  timestamp: string;
  message: string;
  user_agent?: string;
  created_at?: string;
}

// Función para enviar respuesta por EMAIL directo
export const saveResponseRemote = async (response: Response) => {
  try {
    // Inicializar EmailJS
    emailjs.init(EMAIL_CONFIG.publicKey);

    // Preparar datos para el email
    const emailData = {
      to_email: EMAIL_CONFIG.toEmail,
      respuesta: response.answer === "yes" ? "✅ SÍ ACEPTA" : "❌ NO ACEPTA",
      mensaje: response.message,
      fecha: new Date(response.timestamp).toLocaleString("es-ES"),
      dispositivo: navigator.userAgent.substring(0, 100),
      timestamp_raw: response.timestamp,
      created_at: new Date().toLocaleString("es-ES"),
    };

    // Enviar email
    const result = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId,
      emailData
    );

    if (result.status === 200) {
      return { success: true, error: null };
    } else {
      throw new Error(`EmailJS Error: ${result.status}`);
    }
  } catch (error) {
    console.error("EmailJS error:", error);
    return { success: false, error };
  }
};
