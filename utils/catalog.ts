import { NextRouter } from 'next/router'
import { getQueryParamOnFirstRender, idGenerator } from './common'
import { getCoursesFx } from '@/app/api/course'
import { setFilteredCourse } from '@/context/courses'


const createManufacturerCheckboxObj = (title: string) => ({
  title,
  checked: false,
  id: idGenerator(),
})

export const courseManufacturers = [
  'программирование',
].map(createManufacturerCheckboxObj)

export const categoriaManufacturers = [
  'Бекенд-разработка',
  'Веб-разрабтка',
  'Мобильная разработка',
].map(createManufacturerCheckboxObj)

const checkPriceFromQuery = (price: number) =>
  price && !isNaN(price) && price >= 0 && price <= 10000

export const checkQueryParams = (router: NextRouter) => {
  const priceFromQueryValue = getQueryParamOnFirstRender(
    'priceFrom',
    router
  ) as string
  const priceToQueryValue = getQueryParamOnFirstRender(
    'priceTo',
    router
  ) as string
  const courseQueryValue = JSON.parse(
    decodeURIComponent(getQueryParamOnFirstRender('course', router) as string)
  )
  const categoryQueryValue = JSON.parse(
    decodeURIComponent(getQueryParamOnFirstRender('category', router) as string)
  )
  const isValidCourseQuery =
    Array.isArray(courseQueryValue) && !!courseQueryValue?.length
  const isValidCategoryQuery =
    Array.isArray(categoryQueryValue) && !!categoryQueryValue?.length
  const isValidPriceQuery =
    checkPriceFromQuery(+priceFromQueryValue) &&
    checkPriceFromQuery(+priceToQueryValue)

  return {
    isValidCourseQuery,
    isValidCategoryQuery,
    isValidPriceQuery,
    priceFromQueryValue,
    priceToQueryValue,
    courseQueryValue,
    categoryQueryValue,
  }
}

export const updateParamsAndFiltersFromQuery = async (
  callback: VoidFunction,
  path: string
) => {
  callback()

  const data = await getCoursesFx(`/courses?limit=20&offset=${path}`)

  setFilteredCourse(data)
}

export async function updateParamsAndFilters<T>(
  updatedParams: T,
  path: string,
  router: NextRouter
) {
  const params = router.query

  delete params.course
  delete params.category
  delete params.priceFrom
  delete params.priceTo

  router.push(
    {
      query: {
        ...params,
        ...updatedParams,
      },
    },
    undefined,
    { shallow: true }
  )

  const data = await getCoursesFx(`/course?limit=20&offset=${path}`)

  setFilteredCourse(data)
}


