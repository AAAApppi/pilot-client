import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ICatalogFiltersProps } from '@/types/catalog'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useStore } from 'effector-react'
import { useRouter } from 'next/router'
import { getQueryParamOnFirstRender } from '@/utils/common'
import {
    checkQueryParams,
    updateParamsAndFilters,
    updateParamsAndFiltersFromQuery,
} from '@/utils/catalog'
import { $categoryManufacturers, $courseManufacturers, setCourseManufacturersFromQuery, setСategoryManufacturersFromQuery } from '@/context/courses'
import CatalogFiltersDesktop from './CatalogFiltersDesktop'
import CatalogFiltersMobile from './CatalogFiltersMobile'

const CatalogFilters = ({
    priceRange,
    setPriceRange,
    setIsPriceRangeChanged,
    resetFilterBtnDisabled,
    resetFilters,
    isPriceRangeChanged,
    currentPage,
    setIsFilterInQuery,
    closePopup,
    filtersMobileOpen,
}: ICatalogFiltersProps) => {
    const isMobile = useMediaQuery(820)
    const [spinner, setSpinner] = useState(false)
    const courseManufacturers = useStore($courseManufacturers)
    const categoryManufacturers = useStore($categoryManufacturers)
    const router = useRouter()

    useEffect(() => {
        applyFiltersFromQuery()
    }, [])

    const applyFiltersFromQuery = async () => {
        try {
            const {
                isValidCourseQuery,
                isValidCategoryQuery,
                isValidPriceQuery,
                categoryQueryValue,
                priceFromQueryValue,
                courseQueryValue,
                priceToQueryValue,
            } = checkQueryParams(router)

            const courseQuery = `&course=${getQueryParamOnFirstRender(
                'course',
                router
            )}`
            const categoryQuery = `&category=${getQueryParamOnFirstRender('category', router)}`
            const priceQuery = `&priceFrom=${priceFromQueryValue}&priceTo=${priceToQueryValue}`

            if (isValidCourseQuery && isValidCategoryQuery && isValidPriceQuery) {
                updateParamsAndFiltersFromQuery(() => {
                    updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
                    setCourseManufacturersFromQuery(courseQueryValue)
                    setCourseManufacturersFromQuery(categoryQueryValue)
                }, `${currentPage}${priceQuery}${courseQuery}${categoryQuery}`)
                return
            }

            if (isValidPriceQuery) {
                updateParamsAndFiltersFromQuery(() => {
                    updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
                }, `${currentPage}${priceQuery}`)
            }

            if (isValidCategoryQuery && isValidCategoryQuery) {
                updateParamsAndFiltersFromQuery(() => {
                    setIsFilterInQuery(true)
                    setCourseManufacturersFromQuery(courseQueryValue)
                    setСategoryManufacturersFromQuery(categoryQueryValue)
                }, `${currentPage}${courseQuery}${categoryQuery}`)
                return
            }

            if (isValidCategoryQuery) {
                updateParamsAndFiltersFromQuery(() => {
                    setIsFilterInQuery(true)
                    setCourseManufacturersFromQuery(courseQueryValue)
                }, `${currentPage}${courseQuery}`)
            }

            if (isValidCategoryQuery) {
                updateParamsAndFiltersFromQuery(() => {
                    setIsFilterInQuery(true)
                    setСategoryManufacturersFromQuery(categoryQueryValue)
                }, `${currentPage}${categoryQuery}`)
            }

            if (isValidCategoryQuery && isValidPriceQuery) {
                updateParamsAndFiltersFromQuery(() => {
                    updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
                    setСategoryManufacturersFromQuery(categoryQueryValue)
                }, `${currentPage}${priceQuery}${categoryQuery}`)
            }

            if (isValidCategoryQuery && isValidPriceQuery) {
                updateParamsAndFiltersFromQuery(() => {
                    updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
                    setCourseManufacturersFromQuery(courseQueryValue)
                }, `${currentPage}${priceQuery}${courseQuery}`)
            }
        } catch (error) {
            const err = error as Error

            if (err.message === 'URI malformed') {
                toast.warning('Неправильный url для фильтров')
                return
            }

            toast.error(err.message)
        }
    }

    const updatePriceFromQuery = (priceFrom: number, priceTo: number) => {
        setIsFilterInQuery(true)
        setPriceRange([+priceFrom, +priceTo])
        setIsPriceRangeChanged(true)
    }

    const applyFilters = async () => {
        setIsFilterInQuery(true)
        try {
            setSpinner(true)
            const priceFrom = Math.ceil(priceRange[0])
            const priceTo = Math.ceil(priceRange[1])
            const priceQuery = isPriceRangeChanged
                ? `&priceFrom=${priceFrom}&priceTo=${priceTo}`
                : ''
            const course = courseManufacturers
                .filter((item) => item.checked)
                .map((item) => item.title)
            const category = categoryManufacturers
                .filter((item) => item.checked)
                .map((item) => item.title)
            const encodedCourseQuery = encodeURIComponent(JSON.stringify(course))
            const encodedCategoryQuery = encodeURIComponent(JSON.stringify(category))
            const courseQuery = `&course=${encodedCourseQuery}`
            const categoryQuery = `&category=${encodedCategoryQuery}`
            const initialPage = currentPage > 0 ? 0 : currentPage

            if (course.length && category.length && isPriceRangeChanged) {
                updateParamsAndFilters(
                    {
                        course: encodedCourseQuery,
                        category: encodedCategoryQuery,
                        priceFrom,
                        priceTo,
                        offset: initialPage + 1,
                    },
                    `${initialPage}${priceQuery}${courseQuery}${categoryQuery}`,
                    router
                )
                return
            }

            if (isPriceRangeChanged) {
                updateParamsAndFilters(
                    {
                        priceFrom,
                        priceTo,
                        offset: initialPage + 1,
                    },
                    `${initialPage}${priceQuery}`,
                    router
                )
            }

            if (course.length && category.length) {
                updateParamsAndFilters(
                    {
                        course: encodedCourseQuery,
                        category: encodedCategoryQuery,
                        offset: initialPage + 1,
                    },
                    `${initialPage}${courseQuery}${categoryQuery}`,
                    router
                )
                return
            }

            if (course.length) {
                updateParamsAndFilters(
                    {
                        course: encodedCourseQuery,
                        offset: initialPage + 1,
                    },
                    `${initialPage}${courseQuery}`,
                    router
                )
            }

            if (category.length) {
                updateParamsAndFilters(
                    {
                        category: encodedCategoryQuery,
                        offset: initialPage + 1,
                    },
                    `${initialPage}${categoryQuery}`,
                    router
                )
            }

            if (course.length && isPriceRangeChanged) {
                updateParamsAndFilters(
                    {
                        course: encodedCourseQuery,
                        priceFrom,
                        priceTo,
                        offset: initialPage + 1,
                    },
                    `${initialPage}${courseQuery}${priceQuery}`,
                    router
                )
            }

            if (category.length && isPriceRangeChanged) {
                updateParamsAndFilters(
                    {
                        category : encodedCategoryQuery,
                        priceFrom,
                        priceTo,
                        offset: initialPage + 1,
                    },
                    `${initialPage}${categoryQuery}${priceQuery}`,
                    router
                )
            }
        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setSpinner(false)
        }
    }

    return (
        <>
            {isMobile ? (
                <CatalogFiltersMobile
                    closePopup={closePopup}
                    spinner={spinner}
                    applyFilters={applyFilters}
                    priceRange={priceRange}
                    setIsPriceRangeChanged={setIsPriceRangeChanged}
                    setPriceRange={setPriceRange}
                    resetFilterBtnDisabled={resetFilterBtnDisabled}
                    resetFilters={resetFilters}
                    filtersMobileOpen={filtersMobileOpen}
                />
            ) : (
                <CatalogFiltersDesktop
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    setIsPriceRangeChanged={setIsPriceRangeChanged}
                    resetFilterBtnDisabled={resetFilterBtnDisabled}
                    spinner={spinner}
                    resetFilters={resetFilters}
                    applyFilters={applyFilters}
                />
            )}
        </>
    )
}

export default CatalogFilters