import { useRouter } from "next/router"
import { useAuth } from "../../hooks/useAuth"
import styles from "./Admin.module.scss"

export default function AdminPanel() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    router.push("/admin/login")
    return null
  }

  return (
    <div className={styles.adminPanel}>
      <aside className={styles.sidebar}>
        <nav>
          <ul>
            <li>
              <a href="/admin/news">Новини</a>
            </li>
            <li>
              <a href="/admin/programs">Програми</a>
            </li>
            <li>
              <a href="/admin/horoscope">Гороскоп</a>
            </li>
            <li>
              <a href="/admin/music">Музика</a>
            </li>
            <li>
              <a href="/admin/artists">Виконавці</a>
            </li>
            <li>
              <a href="/admin/settings">Налаштування</a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className={styles.content}>
        <h1>Панель адміністратора</h1>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Новини</h3>
            <p>Всього: 150</p>
            <p>За сьогодні: 5</p>
          </div>
          <div className={styles.statCard}>
            <h3>Програми</h3>
            <p>Активні: 12</p>
          </div>
          <div className={styles.statCard}>
            <h3>Виконавці</h3>
            <p>Всього: 324</p>
          </div>
          <div className={styles.statCard}>
            <h3>Треки</h3>
            <p>В ротації: 1250</p>
          </div>
        </div>
      </main>
    </div>
  )
}

