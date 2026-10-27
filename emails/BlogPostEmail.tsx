import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Link,
} from '@react-email/components'

interface BlogPostEmailProps {
  title: string
  description: string
  date: string
  slug: string
  coverImage?: string
  tags?: string[]
  siteUrl: string
}

export function BlogPostEmail({
  title,
  description,
  date,
  slug,
  coverImage,
  tags = [],
  siteUrl,
}: BlogPostEmailProps) {
  const postUrl = `${siteUrl}/blog/${slug}`

  return (
    <Html>
      <Head />
      <Preview>{title} — {description}</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={brandText}>Serlis Maldonado</Text>
          </Section>

          {/* Cover image */}
          {coverImage && (
            <Section style={{ padding: '0' }}>
              <Img
                src={coverImage}
                alt={title}
                width="600"
                style={coverStyle}
              />
            </Section>
          )}

          {/* Content */}
          <Section style={content}>
            {/* Date */}
            <Text style={dateText}>{date}</Text>

            {/* Title */}
            <Heading style={titleStyle}>{title}</Heading>

            {/* Author */}
            <Row style={authorSection}>
              <Column style={{ width: '38px' }}>
                <Img
                  src={`${siteUrl}/avatar.jpg`}
                  alt="Serlis Maldonado"
                  width="28"
                  height="28"
                  style={avatarStyle}
                />
              </Column>
              <Column>
                <Text style={authorName}>Serlis Maldonado</Text>
              </Column>
            </Row>

            {/* Description */}
            <Text style={descriptionStyle}>{description}</Text>

            {/* Tags */}
            {tags.length > 0 && (
              <Section style={tagsContainer}>
                {tags.map((tag) => (
                  <span key={tag} style={tagStyle}>
                    {tag}
                  </span>
                ))}
              </Section>
            )}

            {/* CTA Button */}
            <Section style={buttonSection}>
              <Button href={postUrl} style={button}>
                Leer post →
              </Button>
            </Section>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Recibiste este email porque te suscribiste al blog de{' '}
              <Link href={siteUrl} style={footerLink}>
                Serlis Maldonado
              </Link>
              .
            </Text>
            <Text style={footerText}>
              <Link href="{{{RESEND_UNSUBSCRIBE_URL}}}" style={unsubscribeLink}>
                Cancelar suscripción
              </Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

// Styles
const body = {
  backgroundColor: '#09090b',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

const container = {
  margin: '0 auto',
  maxWidth: '600px',
  backgroundColor: '#09090b',
}

const header = {
  padding: '32px 40px 24px',
  borderBottom: '1px solid #27272a',
}

const brandText = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#ffffff',
  margin: '0',
  letterSpacing: '-0.01em',
}

const coverStyle = {
  width: '100%',
  maxWidth: '600px',
  height: '240px',
  objectFit: 'cover' as const,
  display: 'block',
  filter: 'grayscale(100%) brightness(0.7) contrast(1.6)',
}

const content = {
  padding: '32px 40px',
}

const dateText = {
  fontSize: '11px',
  color: '#52525b',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  fontFamily: 'monospace',
  margin: '0 0 12px',
}

const titleStyle = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#ffffff',
  lineHeight: '1.2',
  letterSpacing: '-0.02em',
  margin: '0 0 16px',
}

const descriptionStyle = {
  fontSize: '16px',
  color: '#a1a1aa',
  lineHeight: '1.7',
  margin: '0 0 24px',
}

const tagsContainer = {
  marginBottom: '28px',
}

const tagStyle = {
  display: 'inline-block',
  fontSize: '11px',
  color: '#52525b',
  border: '1px solid #27272a',
  borderRadius: '4px',
  padding: '2px 8px',
  marginRight: '6px',
  fontFamily: 'monospace',
}

const buttonSection = {
  marginTop: '8px',
}

const button = {
  backgroundColor: '#ffffff',
  color: '#09090b',
  fontSize: '13px',
  fontWeight: '600',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
}

const divider = {
  borderColor: '#27272a',
  margin: '0 40px',
}

const footer = {
  padding: '24px 40px 32px',
}

const footerText = {
  fontSize: '12px',
  color: '#52525b',
  lineHeight: '1.6',
  margin: '0 0 8px',
}

const footerLink = {
  color: '#71717a',
  textDecoration: 'underline',
}

const unsubscribeLink = {
  color: '#52525b',
  textDecoration: 'underline',
}

const authorSection = {
  marginBottom: '24px',
}

const avatarStyle = {
  borderRadius: '50%',
  display: 'block',
}

const authorName = {
  fontSize: '13px',
  color: '#a1a1aa',
  margin: '0',
  fontWeight: '500' as const,
  lineHeight: '28px',
}
