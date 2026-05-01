import Link from "next/link";

export const metadata = {
  title: "Suscripción confirmada | Serlis Maldonado",
};

export default function SubscribeSuccessPage() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link href="/" style={styles.backLink}>
          ← Volver al sitio
        </Link>
      </header>

      <main style={styles.main}>
        <div style={styles.content}>
          <div style={styles.icon}>✓</div>
          <p style={styles.label}>// subscription.confirmed</p>
          <h1 style={styles.heading}>Suscripción confirmada!</h1>
          <p style={styles.description}>
            Revisá tu inbox. Te envié un email de confirmación para verificar que tu dirección sea correcta.
          </p>
          <div style={styles.info}>
            <p style={styles.infoText}>
              Una vez confirmado, vas a empezar a recibir mis actualizaciones.
            </p>
          </div>
          <Link href="/" style={styles.button}>
            Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100dvh",
    backgroundColor: "#09090b",
    color: "#ededed",
  },
  header: {
    padding: "24px",
  },
  backLink: {
    color: "#71717a",
    textDecoration: "none",
    fontFamily: "monospace",
    fontSize: "14px",
    transition: "color 0.2s",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
  },
  content: {
    maxWidth: "480px",
    width: "100%",
    textAlign: "center",
  },
  icon: {
    width: "64px",
    height: "64px",
    backgroundColor: "#22c55e",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    color: "#0a0a0a",
    fontWeight: "bold",
    margin: "0 auto 24px",
  },
  label: {
    color: "#22c55e",
    fontFamily: "monospace",
    fontSize: "12px",
    marginBottom: "16px",
  },
  heading: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: "16px",
  },
  description: {
    fontSize: "16px",
    color: "#a1a1aa",
    lineHeight: "1.6",
    marginBottom: "32px",
  },
  info: {
    backgroundColor: "#18181b",
    border: "1px solid #27272a",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "32px",
  },
  infoText: {
    fontSize: "14px",
    color: "#71717a",
    lineHeight: "1.6",
    margin: 0,
  },
  button: {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: "#22c55e",
    color: "#0a0a0a",
    textDecoration: "none",
    fontFamily: "monospace",
    fontSize: "14px",
    fontWeight: "bold",
    borderRadius: "8px",
    transition: "background-color 0.2s",
  },
};