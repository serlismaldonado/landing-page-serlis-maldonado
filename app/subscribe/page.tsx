import SubscribeForm from "../../components/SubscribeForm";

export const metadata = {
  title: "Suscribirse al Newsletter | Serlis Maldonado",
  description: "Unite a mi newsletter para recibir actualizaciones sobre proyectos, tecnología y contenido exclusivo.",
};

export default function SubscribePage() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <a href="/" style={styles.backLink}>
          ← Volver
        </a>
      </header>

      <main style={styles.main}>
        <div style={styles.content}>
          <p style={styles.label}>// newsletter.subscribe()</p>
          <h1 style={styles.heading}>Suscribite al newsletter</h1>
          <p style={styles.description}>
            Recibí mis últimas actualizaciones sobre proyectos, tecnología y contenido exclusivo.
            Sin spam, solo lo importante.
          </p>
          <SubscribeForm showName redirectTo="/" />
          <p style={styles.note}>
            Podés darte de baja en cualquier momento.
          </p>
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
  note: {
    fontSize: "12px",
    color: "#52525b",
    marginTop: "24px",
  },
};