import "../styles/globals.css"
import type { AppProps } from "next/app"
import { I18nextProvider } from "react-i18next"
import i18n from "../services/i18n"
import Header from "../components/layout/Header/Header"
import Footer from "../components/layout/Footer/Footer"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </I18nextProvider>
  )
}

export default MyApp

