import React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Section,
  Text,
} from "@react-email/components";

interface BaseEmailProps {
  children: React.ReactNode;
  previewText?: string;
}

export function BaseEmailTemplate({ children, previewText }: BaseEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>{children}</Body>
    </Html>
  );
}

interface HeaderProps {
  logoText?: string;
}

export function Header({ logoText = "Serlis Maldonado" }: HeaderProps) {
  return (
    <Section style={styles.headerSection}>
      <Text style={styles.headerText}>{logoText}</Text>
      <Hr style={styles.hr} />
    </Section>
  );
}

interface FooterProps {
  socialLinks?: { label: string; href: string }[];
}

export function Footer({ socialLinks }: FooterProps) {
  return (
    <Section style={styles.footerSection}>
      <Hr style={styles.hr} />
      <Text style={styles.footerText}>
        © {new Date().getFullYear()} Serlis Maldonado. Todos los derechos reservados.
      </Text>
      {socialLinks && (
        <Text style={styles.socialLinks}>
          {socialLinks.map((link, index) => (
            <span key={link.label}>
              <Link href={link.href} style={styles.link}>
                {link.label}
              </Link>
              {index < socialLinks.length - 1 && " • "}
            </span>
          ))}
        </Text>
      )}
    </Section>
  );
}

interface CTAButtonProps {
  href: string;
  label: string;
}

export function CTAButton({ href, label }: CTAButtonProps) {
  return (
    <Section style={styles.ctaSection}>
      <Button href={href} style={styles.ctaButton}>
        {label}
      </Button>
    </Section>
  );
}

const styles = {
  body: {
    backgroundColor: "#0a0a0a",
    color: "#ededed",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  headerSection: {
    padding: "32px 0 16px",
  },
  headerText: {
    fontFamily: "monospace",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#22c55e",
    margin: "0 0 16px 0",
  },
  footerSection: {
    padding: "16px 0 32px",
  },
  footerText: {
    fontSize: "12px",
    color: "#71717a",
    textAlign: "center" as const,
    margin: "16px 0 0 0",
  },
  socialLinks: {
    fontSize: "12px",
    color: "#a1a1aa",
    textAlign: "center" as const,
    margin: "8px 0 0 0",
  },
  hr: {
    borderColor: "#27272a",
    margin: "0",
  },
  link: {
    color: "#22c55e",
    textDecoration: "none",
  },
  ctaSection: {
    padding: "24px 0",
    textAlign: "center" as const,
  },
  ctaButton: {
    backgroundColor: "#22c55e",
    borderRadius: "8px",
    color: "#0a0a0a",
    fontSize: "14px",
    fontWeight: "bold",
    padding: "12px 24px",
    textDecoration: "none",
  },
};