import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Hr,
} from "@react-email/components";
import { Header, Footer } from "./base-template";

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmailTemplate({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Header />

          <Section style={styles.content}>
            <Heading style={styles.heading}>Hola, {name}!</Heading>

            <Text style={styles.text}>
              Gracias por visitar mi sitio. Si tienes alguna pregunta o necesitas
              contactarme, no dudes en escribirme.
            </Text>

            <Text style={styles.text}>
              Estoy siempre abierto a nuevas oportunidades y proyectos interesantes.
            </Text>
          </Section>

          <Hr style={styles.hr} />

          <Footer
            socialLinks={[
              { label: "GitHub", href: "https://github.com/serlismaldonado" },
              { label: "LinkedIn", href: "https://linkedin.com/in/serlismaldonado" },
            ]}
          />
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#0a0a0a",
    color: "#ededed",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "0 16px",
  },
  content: {
    padding: "32px 0",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#22c55e",
    margin: "0 0 24px 0",
  },
  text: {
    fontSize: "16px",
    color: "#ededed",
    lineHeight: "1.6",
    margin: "0 0 16px 0",
  },
  hr: {
    borderColor: "#27272a",
  },
};