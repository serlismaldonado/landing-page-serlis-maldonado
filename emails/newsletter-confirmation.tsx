import React from "react";
import { render } from "@react-email/components";
import { BaseEmailTemplate, Header, Footer, CTAButton } from "./base-template";

interface NewsletterConfirmationProps {
  email: string;
  name?: string;
}

export function NewsletterConfirmationTemplate({ email, name }: NewsletterConfirmationProps) {
  return (
    <BaseEmailTemplate>
      <Header />
      <div style={styles.content}>
        <h1 style={styles.heading}>
          {name ? `Gracias ${name}!` : "Gracias por suscribirte!"}
        </h1>
        <p style={styles.text}>
          Tu email <strong>{email}</strong> ha sido agregado a mi newsletter.
        </p>
        <p style={styles.text}>
          Vas a recibir actualizaciones sobre nuevos proyectos, tecnologías y contenido exclusivo.
        </p>
        <CTAButton href={process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"} label="Volver al sitio" />
      </div>
      <Footer socialLinks={[
        { label: "GitHub", href: "https://github.com/serlismaldonado" },
        { label: "LinkedIn", href: "https://linkedin.com/in/serlismaldonado" },
      ]} />
    </BaseEmailTemplate>
  );
}

export async function renderNewsletterConfirmation(props: NewsletterConfirmationProps): Promise<string> {
  return render(<NewsletterConfirmationTemplate {...props} />);
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
};