import { useStore } from 'effector-react'
import { $mode } from '@/context/mode'
import styles from '@/styles/about/index.module.scss'

const AboutPage = () => {
  const mode = useStore($mode)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  return (
    <section className={styles.about}>
      <div className="container">
        <h2 className={`${styles.about__title} ${darkModeClass}`}>
          О компании
        </h2>
        <div className={styles.about__inner}>
          <div className={`${styles.about__info} ${darkModeClass}`}>
            <p>
                Ключевая задача команды &quot;Pilot&quot;  – развитие профессиональных компетенций у линейного персонала, менеджеров среднего и высшего звена с учётом специфики отрасли  IT .
            </p>
            <p>
                Это платформа  разработана для изучения основ программирования с нуля &quot;Pilot&quot; был создан разработчиками для того, чтобы любой желающий мог начать изучать в любом направлении IT сфере и заложить правильный фундамент для новой профессии, основанный не на запоминании специфики, а на понимании системы в целом.
            </p>
          </div>
          <div className={`${styles.about__img} ${styles.about__img__top}`}>
            <img src="/img/logo.svg" alt="image-1" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPage