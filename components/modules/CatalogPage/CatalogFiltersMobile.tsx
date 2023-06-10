import { useStore } from 'effector-react'
import { $mode } from '@/context/mode'
import { ICatalogFilterMobileProps } from '@/types/catalog'
import spinnerStyles from '@/styles/spinner/index.module.scss'
import styles from '@/styles/catalog/index.module.scss'
import { useState } from 'react'
import Accordion from '@/components/elements/Accordion/Accordion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { $categoryManufacturers, $courseManufacturers, setCourseManufacturers, setСategoryManufacturers, updateCourseManufacturer, updateСategoryManufacturer } from '@/context/courses'
import PriceRange from './PriceRange'
import FiltersPopup from './FiltersPopup'
import FiltersPopupTop from './FiltersPopupTop'

const CatalogFiltersMobile = ({
    spinner,
    resetFilterBtnDisabled,
    resetFilters,
    closePopup,
    applyFilters,
    filtersMobileOpen,
    setIsPriceRangeChanged,
    priceRange,
    setPriceRange,
}: ICatalogFilterMobileProps) => {
    const mode = useStore($mode)
    const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
    const courseManufacturers = useStore($courseManufacturers)
    const categoryManufacturers = useStore($categoryManufacturers)
    const [openCourse, setOpenCourse] = useState(false)
    const [openCategory, setOpenCategory] = useState(false)
    const handleOpenCourse = () => setOpenCourse(true)
    const handleCloseCourse = () => setOpenCourse(false)
    const handleOpenCategory = () => setOpenCategory(true)
    const handleCloseCategory = () => setOpenCategory(false)
    const isAnyCourseManufacturerChecked = courseManufacturers.some(
        (item) => item.checked
    )
    const isAnyCategoryManufacturerChecked = categoryManufacturers.some(
        (item) => item.checked
    )
    const isMobile = useMediaQuery(820)

    const resetAllCourseManufacturers = () =>
        setCourseManufacturers(
            courseManufacturers.map((item) => ({ ...item, checked: false }))
        )

    const resetAllCategoryManufacturers = () =>
        setСategoryManufacturers(
            categoryManufacturers.map((item) => ({ ...item, checked: false }))
        )

    const applyFiltersAndClosePopup = () => {
        applyFilters()
        closePopup()
    }

    return (
        <div
            className={`${styles.catalog__bottom__filters} ${darkModeClass} ${filtersMobileOpen ? styles.open : ''
                }`}
        >
            <div className={styles.catalog__bottom__filters__inner}>
                <FiltersPopupTop
                    resetBtnText="Сбросить все"
                    title="Фильтры"
                    resetFilters={resetFilters}
                    resetFilterBtnDisabled={resetFilterBtnDisabled}
                    closePopup={closePopup}
                />
                <div className={styles.filters__boiler_manufacturers}>
                    <button
                        className={`${styles.filters__manufacturer__btn} ${darkModeClass}`}
                        onClick={handleOpenCourse}
                    >
                        Курсы
                    </button>
                    <FiltersPopup
                        title="Курсы"
                        resetFilterBtnDisabled={!isAnyCourseManufacturerChecked}
                        updateManufacturer={updateCourseManufacturer}
                        setManufacturer={setCourseManufacturers}
                        applyFilters={applyFiltersAndClosePopup}
                        manufacturersList={courseManufacturers}
                        resetAllManufacturers={resetAllCourseManufacturers}
                        handleClosePopup={handleCloseCourse}
                        openPopup={openCourse}
                    />
                </div>
                <div className={styles.filters__boiler_manufacturers}>
                    <button
                        className={`${styles.filters__manufacturer__btn} ${darkModeClass}`}
                        onClick={handleOpenCategory}
                    >
                        Категория
                    </button>
                    <FiltersPopup
                        title="Категория"
                        resetFilterBtnDisabled={!isAnyCategoryManufacturerChecked}
                        updateManufacturer={updateСategoryManufacturer}
                        setManufacturer={setСategoryManufacturers}
                        applyFilters={applyFiltersAndClosePopup}
                        manufacturersList={categoryManufacturers}
                        resetAllManufacturers={resetAllCategoryManufacturers}
                        handleClosePopup={handleCloseCategory}
                        openPopup={openCategory}
                    />
                </div>
                <div className={styles.filters__price}>
                    <Accordion
                        title="Цена"
                        titleClass={`${styles.filters__manufacturer__btn} ${darkModeClass}`}
                        hideArrowClass={styles.hide_arrow}
                        isMobileForFilters={isMobile}
                    >
                        <div className={styles.filters__manufacturer__inner}>
                            <PriceRange
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                setIsPriceRangeChanged={setIsPriceRangeChanged}
                            />
                            <div style={{ height: 24 }} />
                        </div>
                    </Accordion>
                </div>
            </div>
            <div className={styles.filters__actions}>
                <button
                    className={styles.filters__actions__show}
                    onClick={applyFiltersAndClosePopup}
                    disabled={resetFilterBtnDisabled}
                >
                    {spinner ? (
                        <span
                            className={spinnerStyles.spinner}
                            style={{ top: 6, left: '47%' }}
                        />
                    ) : (
                        'Показать'
                    )}
                </button>
            </div>
        </div>
    )
}

export default CatalogFiltersMobile