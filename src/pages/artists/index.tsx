import type { GetServerSideProps } from "next"
import Head from "next/head"
import { useTranslation } from "react-i18next"
import styles from "./Artists.module.scss"

interface ArtistsPageProps {
  artists: {
    [key: string]: Artist[]
  }
}

interface Artist {
  id: string
  name: string
  slug: string
}

export default function ArtistsPage({ artists }: ArtistsPageProps) {
  const { t } = useTranslation()
  const alphabet = Object.keys(artists).sort()

  return (
    <>
      <Head>
        <title>{t("artists.pageTitle")} - Шері ФМ</title>
        <meta name="description" content={t("artists.pageDescription")} />
      </Head>

      <div className={styles.container}>
        <h1>{t("artists.title")}</h1>

        <div className={styles.alphabetNav}>
          {alphabet.map((letter) => (
            <a key={letter} href={`#${letter}`} className={styles.letterLink}>
              {letter}
            </a>
          ))}
        </div>

        <div className={styles.artistsList}>
          {alphabet.map((letter) => (
            <section key={letter} id={letter} className={styles.letterSection}>
              <h2>{letter}</h2>
              <ul>
                {artists[letter].map((artist) => (
                  <li key={artist.id}>
                    <a href={`/artists/${artist.slug}`}>{artist.name}</a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  // Here will be the logic to get the list of artists from the API
  // For now, we'll use mock data
  return {
    props: {
      artists: {
        А: [
          { id: "1", name: "Amel Bent", slug: "amel-bent" },
          { id: "2", name: "Angèle", slug: "angele" },
        ],
        B: [
          { id: "3", name: "Beyoncé", slug: "beyonce" },
          { id: "4", name: "Bruno Mars", slug: "bruno-mars" },
        ],
        // Add more mock data for other letters...
      },
    },
  }
}

