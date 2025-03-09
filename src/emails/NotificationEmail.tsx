import { Body, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components"

interface NotificationEmailProps {
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  previewText: string
}

export const NotificationEmail = ({ title, message, type, previewText }: NotificationEmailProps) => {
  const getTypeColor = () => {
    switch (type) {
      case "info":
        return "#1976d2"
      case "warning":
        return "#f57c00"
      case "success":
        return "#2e7d32"
      case "error":
        return "#d32f2f"
      default:
        return "#1976d2"
    }
  }

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Heading
              style={{
                ...heading,
                color: getTypeColor(),
              }}
            >
              {title}
            </Heading>
            <Text style={text}>{message}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
}

const section = {
  padding: "0 48px",
}

const heading = {
  fontSize: "32px",
  fontWeight: "600",
  margin: "48px 0",
  padding: "0",
}

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
}

export default NotificationEmail

