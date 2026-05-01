import React from "react";
import { render } from "@react-email/components";
import { BaseEmailTemplate, Header, Footer } from "./base-template";

interface NewsletterWelcomeProps {
  name?: string;
}

export function NewsletterWelcomeTemplate({ name }: NewsletterWelcomeProps) {
  return (
    <BaseEmailTemplate>
      <Header />
      <div style={styles.content}>
        <h1 style={styles.heading}>
          {name ? `Bienvenido ${name}!` : "Bienvenido al newsletter!"}
        </h1>
        <p style={styles.text}>
          Gracias por unirte. A partir de ahora vas a recibir mis últimas actualizaciones directamente en tu inbox.
        </p>
        <p style={styles.text}>
          <strong>Qué vas a recibir:</strong>
        </p>
        <ul style={styles.list}>
          <li>Nuevos proyectos y herramientas</li>
          <li>Tutoriales y guías técnicas</li>
          <li>Opiniones sobre tecnología</li>
          <li>Contenido exclusivo</li>
        </ul>
        <p style={styles.text}>
          Podés darte de baja en cualquier momento desde los enlaces en cada email.
        </p>
      </div>
      <Footer socialLinks={[
        { label: "GitHub", href: "https://github.com/serlismaldonado" },
        { label: "LinkedIn", href: "https://linkedin.com/in/serlismaldonado" },
      ]} />
    </BaseEmailTemplate>
  );
}

export async function renderNewsletterWelcome(props: NewsletterWelcomeProps): Promise<string> {
  return render(<NewsletterWelcomeTemplate {...props} />);
}

const styles = {
  content: {
    padding: "32px 0",
  } as React.CSSProperties,
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#22c55e",
    margin: "0 0 24px 0",
  } as React.CSSProperties,
  text: {
    fontSize: "16px",
    color: "#ededed",
    lineHeight: "1.6",
    margin: "0 0 16px 0",
  } as React.CSSProperties,
  list: {
    fontSize: "16px",
    color: "#ededed",
    lineHeight: "1.8",
    margin: "0 0 24px 0",
    paddingLeft: "24px",
  } as React.CSSProperties,
};