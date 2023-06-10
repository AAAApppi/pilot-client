import { useStore } from 'effector-react'
import LocationSvg from '../LocationSvg/LocationSvg'
import { $mode } from '@/context/mode'
import styles from '@/styles/CityButton/index.module.scss'

const CityButton = () => {
    const mode = useStore($mode)
    const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  
    return (
      <button className={styles.city}>
        <span className={`${styles.city__span} ${darkModeClass}`}>
        </span>
      </button>
    )
  }
  
  export default CityButton