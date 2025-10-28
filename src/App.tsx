import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Coffee, Star, X } from "lucide-react";
import { saveResponseRemote } from "./firebase";
import "./App.css";

interface Response {
  answer: "yes" | "no";
  timestamp: string;
  message: string;
}

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [response, setResponse] = useState<Response | null>(null);
  const [roses, setRoses] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);

  useEffect(() => {
    // Cargar respuesta guardada si existe
    const savedResponse = localStorage.getItem("lunch-invitation-response");
    if (savedResponse) {
      setResponse(JSON.parse(savedResponse));
    }

    // Generar rosas flotantes
    const roseArray = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setRoses(roseArray);
  }, []);

  const handleResponse = async (answer: "yes" | "no") => {
    const newResponse: Response = {
      answer,
      timestamp: new Date().toISOString(),
      message:
        answer === "yes"
          ? "¡Excelente! Estaré muy emocionado de conocerte mejor 😊"
          : "Entiendo perfectamente, respeto tu decisión. ¡Que tengas un gran día! 😊",
    };

    setResponse(newResponse);

    // Guardar localmente (para respaldo)
    localStorage.setItem(
      "lunch-invitation-response",
      JSON.stringify(newResponse)
    );

    // Guardar remotamente con EmailJS (sin mensajes)
    try {
      await saveResponseRemote(newResponse);
    } catch (error) {
      console.error("Error sending email:", error);
    }

    setShowModal(false);
  };

  return (
    <div className="app">
      {/* Rosas flotantes de fondo */}
      <div className="roses-container">
        {roses.map((rose) => (
          <motion.div
            key={rose.id}
            className="floating-rose"
            style={{
              left: `${rose.x}%`,
              top: `${rose.y}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: rose.delay,
              ease: "easeInOut",
            }}
          >
            🌹
          </motion.div>
        ))}
      </div>

      {/* Contenido principal */}
      <motion.div
        className="main-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Botón de información */}
        <motion.button
          className="info-button"
          onClick={() => setShowInfoModal(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="info-icon-text">i</span>
        </motion.button>

        {/* Título principal */}
        <motion.div
          className="title-container"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            type: "spring",
            bounce: 0.3,
          }}
        >
          <h1 className="main-title">
            Una Invitación Especial
            <motion.div
              className="heart-icon"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Heart fill="red" color="red" size={30} />
            </motion.div>
          </h1>
        </motion.div>

        {/* Referencia al botón de info */}
        <motion.p
          className="info-reference"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
        >
          💡 Haz clic en <span className="inline-info-button">(i)</span> para
          más detalles
        </motion.p>

        {/* Mensaje principal */}
        <motion.div
          className="message-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <p className="main-message">
            Hola! 👋 Sé que he intentado invitarte antes por WhatsApp y quizás
            no has podido responder. Esta vez quise crear algo especial como
            desarrollador para tener una respuesta clara.
          </p>

          <p className="honest-message">
            Me interesas mucho y me gustaría conocerte mejor. Entiendo que
            puedes estar ocupada, pero esta será mi última invitación para no
            molestarte más.
          </p>

          <motion.p
            className="invitation-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            ¿Te gustaría almorzar conmigo?
            <Coffee className="coffee-icon" size={20} />
          </motion.p>

          <p className="final-note">
            Solo necesito un "Sí" o "No". Respetaré completamente tu decisión.
            💭
          </p>
        </motion.div>

        {/* Botones de respuesta o resultado */}
        {!response ? (
          <motion.div
            className="buttons-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            <motion.button
              className="response-button yes-button"
              onClick={() => setShowModal(true)}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 25px rgba(76, 175, 80, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Star className="button-icon" size={20} />
              ¡Responder!
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="response-result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`result-card ${response.answer}`}>
              <h3>
                {response.answer === "yes"
                  ? "¡Fantástico! 🎉"
                  : "Respuesta recibida 💝"}
              </h3>
              <p>{response.message}</p>
              <small>
                Respondido el: {new Date(response.timestamp).toLocaleString()}
              </small>
            </div>
          </motion.div>
        )}

        {/* Estrellas decorativas */}
        <div className="stars-container">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal de respuesta */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Mi última invitación 💫</h2>
              <p>
                Solo quiero una respuesta clara. No hay presión, solo
                honestidad. Sea cual sea tu decisión, la respetaré
                completamente.
              </p>

              <div className="modal-buttons">
                <motion.button
                  className="modal-button yes"
                  onClick={() => handleResponse("yes")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sí, almorcemos 😊
                </motion.button>

                <motion.button
                  className="modal-button no"
                  onClick={() => handleResponse("no")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  No, gracias 🙏
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal informativo */}
      <AnimatePresence>
        {showInfoModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInfoModal(false)}
          >
            <motion.div
              className="modal-content info-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setShowInfoModal(false)}
              >
                <X size={20} />
              </button>

              <h2>¿Por qué esta página? 💭</h2>
              <div className="info-content">
                <p>
                  <strong>Mis intentos anteriores:</strong>
                  <br />
                  Te he escrito por WhatsApp antes, pero nunca he tenido una
                  respuesta clara. Quizás no supiste qué decir o simplemente no
                  era el momento.
                </p>

                <p>
                  <strong>Esta es mi última carta:</strong>
                  <br />
                  Como desarrollador, quise crear algo especial para tener una
                  respuesta definitiva. Después de esto, no volveré a insistir.
                  Solo quiero saber qué piensas realmente.
                </p>

                <p>
                  <strong>Sin presión:</strong>
                  <br />
                  Si es "no", lo entenderé completamente y podremos seguir como
                  antes, ya que fuimos compañeros de trabajo. Si es "sí", me
                  haría muy feliz conocerte mejor.
                </p>

                <p>
                  <strong>Agradecimiento:</strong>
                  <br />
                  Independientemente de tu respuesta, agradezco mucho que te
                  hayas tomado el tiempo de leer esto y responder. Significa
                  mucho para mí.
                </p>

                <p className="tech-note">
                  <strong>Sobre tu respuesta:</strong> Tu decisión queda
                  guardada localmente en esta página para que yo pueda verla
                  cuando revise la página. Es completamente privada entre
                  nosotros dos. Nadie más tendrá acceso a tu respuesta.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
