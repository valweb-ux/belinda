import React from "react"
import type { GetServerSideProps } from "next"
import Head from "next/head"
import { useTranslation } from "react-i18next"
import styles from "./Horoscope.module.scss"
import { horoscopeApi, type HoroscopeResponse } from "../../services/api/horoscope"

interface HoroscopePageProps {
  horoscopeData: HoroscopeResponse
}

export default function HoroscopePage({ horoscopeData }: HoroscopePageProps) {
  const { t } = useTranslation()

  return (
    <>
      <Head>
        <title>{t("horoscope.pageTitle")} - Шері ФМ</title>
        <meta name="description" content={t("horoscope.pageDescription")} />
      </Head>

      <div className={styles.container}>
        <h1>{t("horoscope.title")}</h1>
        <div className={styles.currentDate}>{horoscopeData.date}</div>

        <div className={styles.signsGrid}>
          {horoscopeData.signs.map((sign, index) => {
            // Add an ad block after every third sign
            const adBlock =
              (index + 1) % 3 === 0 ? (
                <div
                  key={`ad-${index}`}
                  className="c-block-display__inner js-block-display-inner"
                  id={`displayAd${index}`}
                ></div>
              ) : null

            return (
              <React.Fragment key={sign.id}>
                <div className={styles.signCard}>
                  <div className={styles.signImage}>
                    <img src={sign.image || "/placeholder.svg"} alt={sign.name} />
                  </div>
                  <div className={styles.signContent}>
                    <h2>{sign.name}</h2>
                    <div className={styles.dates}>{sign.dates}</div>
                    <p className={styles.prediction}>{sign.prediction}</p>
                  </div>
                </div>
                {adBlock}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  try {
    const horoscopeData = await horoscopeApi.getDailyHoroscope(locale || "uk")

    return {
      props: {
        horoscopeData,
      },
    }
  } catch (error) {
    console.error("Error fetching horoscope data:", error)
    return {
      props: {
        horoscopeData: {
          date: new Date().toLocaleDateString(locale, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          signs: [],
        },
      },
    }
  }
}

