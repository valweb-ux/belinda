import type React from "react"
import { useState } from "react"
import Head from "next/head"
import { useTranslation } from "react-i18next"
import styles from "./Support.module.scss"

interface DonationAmount {
  value: number
  label: string
}

export default function SupportPage() {
  const { t } = useTranslation()
  const [amount, setAmount] = useState<number>(0)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("")

  const donationAmounts: DonationAmount[] = [
    { value: 100, label: "100 ₴" },
    { value: 200, label: "200 ₴" },
    { value: 500, label: "500 ₴" },
    { value: 1000, label: "1000 ₴" },
  ]

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalAmount = customAmount ? Number.parseFloat(customAmount) : amount

    try {
      // Тут буде логіка обробки платежу
      console.log("Processing donation:", { amount: finalAmount, method: paymentMethod })
    } catch (error) {
      console.error("Donation error:", error)
    }
  }

  return (
    <>
      <Head>
        <title>{t("support.pageTitle")} - Шері ФМ</title>
        <meta name="description" content={t("support.pageDescription")} />
      </Head>

      <div className={styles.container}>
        <h1>{t("support.title")}</h1>
        <p className={styles.description}>{t("support.description")}</p>

        <form onSubmit={handleDonate} className={styles.donationForm}>
          <div className={styles.amountSection}>
            <h2>{t("support.selectAmount")}</h2>
            <div className={styles.amountButtons}>
              {donationAmounts.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={amount === option.value ? styles.active : ""}
                  onClick={() => {
                    setAmount(option.value)
                    setCustomAmount("")
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className={styles.customAmount}>
              <label>{t("support.customAmount")}</label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  setAmount(0)
                }}
                placeholder={t("support.enterAmount")}
                min="1"
              />
            </div>
          </div>

          <div className={styles.paymentSection}>
            <h2>{t("support.selectPayment")}</h2>
            <div className={styles.paymentMethods}>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                {t("support.creditCard")}
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                PayPal
              </label>
            </div>
          </div>

          <button type="submit" className={styles.submitButton} disabled={!paymentMethod || (!amount && !customAmount)}>
            {t("support.donateButton")}
          </button>
        </form>
      </div>
    </>
  )
}

