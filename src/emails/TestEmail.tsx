import { Body, Container, Head, Heading, Html, Preview, Section, Text, Button } from "@react-email/components"

interface TestEmailProps {
  previewText: string
  userName: string
}

export const TestEmail = ({ previewText, userName }: TestEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Heading style={heading}>Тестове повідомлення</Heading>
            <Text style={text}>Вітаємо, {userName}!</Text>
            <Text style={text}>
              Це тестове повідомлення для перевірки налаштувань SMTP сервера. Якщо ви отримали цей лист, значить
              налаштування працюють коректно.
            </Text>
            <Button pX={20} pY={12} style={button} href={process.env.NEXT_PUBLIC_APP_URL}>
              Перейти до адмін-панелі
            </Button>
            <Text style={footer}>Це автоматичне повідомлення, будь ласка, не відповідайте на нього.</Text>
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
  color: "#484848",
  margin: "48px 0",
  padding: "0",
  textAlign: "center" as const,
}

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  marginBottom: "20px",
}

const button = {
  backgroundColor: "#1976d2",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  marginTop: "32px",
  marginBottom: "32px",
}

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  marginTop: "32px",
}

export default TestEmail

