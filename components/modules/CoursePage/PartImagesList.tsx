import { useStore } from 'effector-react'
import { useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import PartImagesItem from './PartImagesItem'
import styles from '@/styles/part/index.module.scss'
import { $catalog } from '@/context/catalog'
import PartSlider from './PartSlider'

const PartImagesList = () => {
  const catalog = useStore($catalog)
  const isMobile = useMediaQuery(850)
  const images = catalog.images
    ? (JSON.parse(catalog.images) as string[])
    : []
  const [currentImgSrc, setCurrentImgSrc] = useState('')

  return (
    <div className={styles.part__images}>
      {isMobile ? (
        <PartSlider images={images} />
      ) : (
        <>
          <div className={styles.part__images__main}>
            <img src={currentImgSrc || images[0]} alt={catalog.coursename} />
          </div>
          <ul className={styles.part__images__list}>
            {images.map((item, i) => (
              <PartImagesItem
                key={i}
                alt={`image-${i + 1}`}
                callback={setCurrentImgSrc}
                src={item}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default PartImagesList