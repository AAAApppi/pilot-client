import FilterSelect from '@/components/modules/CatalogPage/FilterSelect'
import ManufacturersBlock from '@/components/modules/CatalogPage/ManufacturersBlock'
import { $mode } from '@/context/mode'
import styles from '@/styles/catalog/index.module.scss'
import { useStore } from 'effector-react'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import skeletonStyles from '@/styles/skeleton/index.module.scss'
import CatalogItem from '@/components/modules/CatalogPage/CatalogItem'
import ReactPaginate from 'react-paginate'
import { IQueryParams } from '@/types/catalog'
import { useRouter } from 'next/router'
import CatalogFilters from '@/components/modules/CatalogPage/CatalogFilters'
import { checkQueryParams } from '@/utils/catalog'
import FilterSvg from '@/components/elements/FilterSvg/FilterSvg'
import { getCoursesFx } from '@/app/api/course'
import {  ICourses } from '@/types/courses'
import { $categoryManufacturers, $courses, $courseManufacturers, $filteredСategory, setCourse, setCourseManufacturers, setСategoryManufacturers, updateCourseManufacturer, updateСategoryManufacturer } from '@/context/courses'
import { usePopup } from '@/hooks/usePopup'

const CatalogPage = ({ query }: { query: IQueryParams }) => {
  const mode = useStore($mode)
  const courseManufacturers = useStore($courseManufacturers)
  const categoryManufacturers = useStore($categoryManufacturers)
  const filteredСategory = useStore($filteredСategory)
  const course = useStore($courses)
  const [spinner, setSpinner] = useState(false)
  const [priceRange, setPriceRange] = useState([1000, 9000])
  const [isFilterInQuery, setIsFilterInQuery] = useState(false)
  const [isPriceRangeChanged, setIsPriceRangeChanged] = useState(false)
  const pagesCount = Math.ceil(course.count / 20)
  const isValidOffset =
    query.offset && !isNaN(+query.offset) && +query.offset > 0
  const [currentPage, setCurrentPage] = useState(
    isValidOffset ? +query.offset - 1 : 0
  )
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const router = useRouter()
  const isAnyCourseManufacturerChecked = courseManufacturers.some(
    (item) => item.checked
  )
  const isAnyСategoryManufacturerChecked = categoryManufacturers.some(
    (item) => item.checked
  )
  const resetFilterBtnDisabled = !(
    isPriceRangeChanged ||
    isAnyCourseManufacturerChecked ||
    isAnyСategoryManufacturerChecked
  )
  const { toggleOpen, open, closePopup } = usePopup()

  useEffect(() => {
    loadCourse()
  }, [filteredСategory, isFilterInQuery])

  console.log(course.rows)

  const loadCourse = async () => {
    try {
      setSpinner(true)
      const data = await getCoursesFx('/course?limit=20&offset=0')

      if (!isValidOffset) {
        router.replace({
          query: {
            offset: 1,
          },
        })

        resetPagination(data)
        return
      }

      if (isValidOffset) {
        if (+query.offset > Math.ceil(data.count / 20)) {
          router.push(
            {
              query: {
                ...query,
                offset: 1,
              },
            },
            undefined,
            { shallow: true }
          )

          setCurrentPage(0)
          setCourse(isFilterInQuery ? filteredСategory : data)
          return
        }

        const offset = +query.offset - 1
        const result = await getCoursesFx(
          `/course?limit=20&offset=${offset}`
        )

        setCurrentPage(offset)
        setCourse(isFilterInQuery ? filteredСategory : result)
        return
      }

      setCurrentPage(0)
      setCourse(isFilterInQuery ? filteredСategory : data)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setTimeout(() => setSpinner(false), 1000)
    }
  }

  const resetPagination = (data: ICourses) => {
    setCurrentPage(0)
    setCourse(data)
  }

  const handlePageChange = async ({ selected }: { selected: number }) => {
    try {
      setSpinner(true)
      const data = await getCoursesFx('/course?limit=20&offset=0')

      if (selected > pagesCount) {
        resetPagination(isFilterInQuery ? filteredСategory : data)
        return
      }

      if (isValidOffset && +query.offset > Math.ceil(data.count / 2)) {
        resetPagination(isFilterInQuery ? filteredСategory : data)
        return
      }

      const { isValidCourseQuery, isValidCategoryQuery, isValidPriceQuery } =
        checkQueryParams(router)

      const result = await getCoursesFx(
        `/course?limit=20&offset=${selected}${
          isFilterInQuery && isValidCourseQuery
            ? `&course=${router.query.course}`
            : ''
        }${
          isFilterInQuery && isValidCategoryQuery
            ? `&category=${router.query.category}`
            : ''
        }${
          isFilterInQuery && isValidPriceQuery
            ? `&priceFrom=${router.query.priceFrom}&priceTo=${router.query.priceTo}`
            : ''
        }`
      )

      router.push(
        {
          query: {
            ...router.query,
            offset: selected + 1,
          },
        },
        undefined,
        { shallow: true }
      )

      setCurrentPage(selected)
      setCourse(result)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setTimeout(() => setSpinner(false), 1000)
    }
  }

  const resetFilters = async () => {
    try {
      const data = await getCoursesFx('/course?limit=20&offset=0')
      const params = router.query

      delete params.course
      delete params.category
      delete params.priceFrom
      delete params.priceTo
      params.first = 'cheap'

      router.push({ query: { ...params } }, undefined, { shallow: true })

      setCourseManufacturers(
        courseManufacturers.map((item) => ({ ...item, checked: false }))
      )

      setСategoryManufacturers(
        categoryManufacturers.map((item) => ({ ...item, checked: false }))
      )

      setCourse(data)
      setPriceRange([1000, 9000])
      setIsPriceRangeChanged(false)
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  return (
    <section className={styles.catalog}>
      <div className={`container ${styles.catalog__container}`}>
        <h2 className={`${styles.catalog__title} ${darkModeClass}`}>
          Каталог курсов
        </h2>
        <div className={`${styles.catalog__top} ${darkModeClass}`}>
          <AnimatePresence>
            {isAnyCourseManufacturerChecked && (
              <ManufacturersBlock
                title="Курсы:"
                event={updateCourseManufacturer}
                manufacturersList={courseManufacturers}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isAnyСategoryManufacturerChecked && (
              <ManufacturersBlock
                title="Категория курсов:"
                event={updateСategoryManufacturer}
                manufacturersList={categoryManufacturers}
              />
            )}
          </AnimatePresence>
          <div className={styles.catalog__top__inner}>
            <button
              className={`${styles.catalog__top__reset} ${darkModeClass}`}
              disabled={resetFilterBtnDisabled}
              onClick={resetFilters}
            >
              Сбросить фильтр
            </button>
            <button
              className={styles.catalog__top__mobile_btn}
              onClick={toggleOpen}
            >
              <span className={styles.catalog__top__mobile_btn__svg}>
                <FilterSvg />
              </span>
              <span className={styles.catalog__top__mobile_btn__text}>
                Фильтр
              </span>
            </button>
            <FilterSelect setSpinner={setSpinner} />
          </div>
        </div>
        <div className={styles.catalog__bottom}>
          <div className={styles.catalog__bottom__inner}>
            <CatalogFilters
              priceRange={priceRange}
              setIsPriceRangeChanged={setIsPriceRangeChanged}
              setPriceRange={setPriceRange}
              resetFilterBtnDisabled={resetFilterBtnDisabled}
              resetFilters={resetFilters}
              isPriceRangeChanged={isPriceRangeChanged}
              currentPage={currentPage}
              setIsFilterInQuery={setIsFilterInQuery}
              closePopup={closePopup}
              filtersMobileOpen={open}
            />
            {spinner ? (
              <ul className={skeletonStyles.skeleton}>
                {Array.from(new Array(20)).map((_, i) => (
                  <li
                    key={i}
                    className={`${skeletonStyles.skeleton__item} ${
                      mode === 'dark' ? `${skeletonStyles.dark_mode}` : ''
                    }`}
                  >
                    <div className={skeletonStyles.skeleton__item__light} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className={styles.catalog__list}>
                {course.rows?.length ? (
                  course.rows.map((item) => (
                    <CatalogItem item={item} key={item.id} />
                  ))
                ) : (
                  <span>Список курсов пуст...</span>
                )}
              </ul>
            )}
          </div>
          <ReactPaginate
            containerClassName={styles.catalog__bottom__list}
            pageClassName={styles.catalog__bottom__list__item}
            pageLinkClassName={styles.catalog__bottom__list__item__link}
            previousClassName={styles.catalog__bottom__list__prev}
            nextClassName={styles.catalog__bottom__list__next}
            breakClassName={styles.catalog__bottom__list__break}
            breakLinkClassName={`${styles.catalog__bottom__list__break__link} ${darkModeClass}`}
            breakLabel="..."
            pageCount={pagesCount}
            forcePage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </section>
  )
}

export default CatalogPage