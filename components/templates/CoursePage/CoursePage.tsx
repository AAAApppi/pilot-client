import { useStore } from 'effector-react'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { $mode } from '@/context/mode'
import { formatPrice } from '@/utils/common'
import { $shoppingCart } from '@/context/shopping-cart'
import CartHoverCheckedSvg from '@/components/elements/CartHoverCheckedSvg/CartHoverCheckedSvg'
import CartHoverSvg from '@/components/elements/CartHoverSvg/CartHoverSvg'
import spinnerStyles from '@/styles/spinner/index.module.scss'
import { toggleCartItem } from '@/utils/shopping-cart'
import { $user } from '@/context/user'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import DashboardSlider from '@/components/modules/DashboardPage/DashboardSlider'
import { removeFromCartFx } from '@/app/api/shopping-cart'
import styles from '@/styles/part/index.module.scss'
import { $catalog } from '@/context/catalog'
import { $courses, setCourse, setCourseByPopularity } from '@/context/courses'
import { getCoursesFx } from '@/app/api/course'
import PartImagesList from '@/components/modules/CoursePage/PartImagesList'
import PartTabs from '@/components/modules/CoursePage/PartTabs'
import PartAccordion from '@/components/modules/CoursePage/PartAccordion'

const CoursePage = () => {
  const mode = useStore($mode)
  const user = useStore($user)
  const isMobile = useMediaQuery(850)
  const catalog = useStore($catalog)
  const courses = useStore($courses)
  const cartItems = useStore($shoppingCart)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const isInCart = cartItems.some((item) => item.partId === catalog.id)
  const spinnerToggleCart = useStore(removeFromCartFx.pending)
  const spinnerSlider = useStore(getCoursesFx.pending)

  useEffect(() => {
    loadBoilerPart()
  }, [])

  const loadBoilerPart = async () => {
    try {
      const data = await getCoursesFx('/courses?limit=20&offset=0')

      setCourse(data)
      setCourseByPopularity()
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  const toggleToCart = () =>
    toggleCartItem(user.username, catalog.id, isInCart)

  return (
    <section>
      <div className="container">
        <div className={`${styles.part__top} ${darkModeClass}`}>
          <h2 className={`${styles.part__title} ${darkModeClass}`}>
            {catalog.coursename}
          </h2>
          <div className={styles.part__inner}>
            <PartImagesList />
            <div className={styles.part__info}>
              <span className={`${styles.part__info__price} ${darkModeClass}`}>
                {formatPrice(catalog.price || 0)} P
              </span>
              <button
                className={`${styles.part__info__btn} ${
                  isInCart ? styles.in_cart : ''
                }`}
                onClick={toggleToCart}
              >
                {spinnerToggleCart ? (
                  <span
                    className={spinnerStyles.spinner}
                    style={{ top: 10, left: '45%' }}
                  />
                ) : (
                  <>
                    <span className={styles.part__info__btn__icon}>
                      {isInCart ? <CartHoverCheckedSvg /> : <CartHoverSvg />}
                    </span>
                    {isInCart ? (
                      <span>Добавлено в карзину</span>
                    ) : (
                      <span>Положить в корзину</span>
                    )}
                  </>
                )}
              </button>
              {!isMobile && <PartTabs />}
            </div>
          </div>
        </div>
        {isMobile && (
          <div className={styles.part__accordion}>
            <div className={styles.part__accordion__inner}>
              <PartAccordion title="Описание">
                <div
                  className={`${styles.part__accordion__content} ${darkModeClass}`}
                >
                  <h3
                    className={`${styles.part__tabs__content__title} ${darkModeClass}`}
                  >
                    {catalog.coursename}
                  </h3>
                  <p
                    className={`${styles.part__tabs__content__text} ${darkModeClass}`}
                  >
                    {catalog.description}
                  </p>
                </div>
              </PartAccordion>
            </div>
            <PartAccordion title="Совместимость">
              <div
                className={`${styles.part__accordion__content} ${darkModeClass}`}
              >
                <p
                  className={`${styles.part__tabs__content__text} ${darkModeClass}`}
                >
                  {catalog.compatibility}
                </p>
              </div>
            </PartAccordion>
          </div>
        )}
        <div className={styles.part__bottom}>
          <h2 className={`${styles.part__title} ${darkModeClass}`}>
            Вам понравится
          </h2>
          <DashboardSlider
            goToPartPage
            spinner={spinnerSlider}
            items={courses.rows || []}
          />
        </div>
      </div>
    </section>
  )
}

export default CoursePage