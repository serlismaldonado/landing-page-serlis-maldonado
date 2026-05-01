import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Section,
  Text,
} from "@react-email/components";
import { Header, Footer } from "./base-template";

interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
}

export function ContactEmailTemplate({ name, email, message }: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Header />

          <Section style={styles.content}>
            <Heading style={styles.heading}>Nuevo mensaje de contacto</Heading>

            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{name}</Text>

            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>
              <Link href={`mailto:${email}`} style={styles.link}>
                {email}
              </Link>
            </Text>

            <Text style={styles.label}>Mensaje:</Text>
            <Text style={styles.message}>{message}</Text>
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
    fontSize: "20px",
    fontWeight: "bold",
    color: "#ffffff",
    margin: "0 0 24px 0",
  },
  label: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: "16px 0 4px 0",
  },
  value: {
    fontSize: "16px",
    color: "#ededed",
    margin: "0",
  },
  message: {
    fontSize: "16px",
    color: "#ededed",
    margin: "0",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
  },
  link: {
    color: "#22c55e",
    textDecoration: "none",
  },
  hr: {
    borderColor: "#27272a",
  },
};