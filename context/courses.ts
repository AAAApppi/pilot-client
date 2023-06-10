import { IFilterCheckboxItem } from '@/types/catalog'
import { ICourse, ICourses } from '@/types/courses'
import { categoriaManufacturers, courseManufacturers } from '@/utils/catalog'
import { createDomain } from 'effector-next'

const courses = createDomain()

export const setCourse = courses.createEvent<ICourses>()
export const setCourseCheapFirst = courses.createEvent()
export const setCourseExpensiveFirst = courses.createEvent()
export const setCourseByPopularity = courses.createEvent()
export const setFilteredCourse = courses.createEvent()
export const setCourseManufacturers =
  courses.createEvent<IFilterCheckboxItem[]>()
export const updateCourseManufacturer =
  courses.createEvent<IFilterCheckboxItem>()
export const setСategoryManufacturers =
  courses.createEvent<IFilterCheckboxItem[]>()
export const updateСategoryManufacturer =
  courses.createEvent<IFilterCheckboxItem>()
export const setCourseManufacturersFromQuery =
  courses.createEvent<string[]>()
export const setСategoryManufacturersFromQuery =
  courses.createEvent<string[]>()

const updateManufacturer = (
  manufacturers: IFilterCheckboxItem[],
  id: string,
  payload: Partial<IFilterCheckboxItem>
) =>
  manufacturers.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        ...payload,
      }
    }

    return item
  })

const updateManufacturerFromQuery = (
  manufacturers: IFilterCheckboxItem[],
  manufacturersFromQuery: string[]
) =>
  manufacturers.map((item) => {
    if (manufacturersFromQuery.find((title) => title === item.title)) {
      return {
        ...item,
        checked: true,
      }
    }

    return item
  })

export const $courses = courses
  .createStore<ICourses>({} as ICourses)
  .on(setCourse, (_, category) => category)
  .on(setCourseCheapFirst, (state) => ({
    ...state,
    rows: state.rows.sort((a, b) => a.price - b.price),
  }))
  .on(setCourseExpensiveFirst, (state) => ({
    ...state,
    rows: state.rows.sort((a, b) => b.price - a.price),
  }))
  .on(setCourseByPopularity, (state) => ({
    ...state,
    rows: state.rows.sort((a, b) => b.popularity - a.popularity),
  }))

export const $courseManufacturers = courses
  .createStore<IFilterCheckboxItem[]>(
    courseManufacturers as IFilterCheckboxItem[]
  )
  .on(setCourseManufacturers, (_, category) => category)
  .on(updateCourseManufacturer, (state, payload) => [
    ...updateManufacturer(state, payload.id as string, {
      checked: payload.checked,
    }),
  ])
  .on(setCourseManufacturersFromQuery, (state, manufacturersFromQuery) => [
    ...updateManufacturerFromQuery(state, manufacturersFromQuery),
  ])

export const $categoryManufacturers = courses
  .createStore<IFilterCheckboxItem[]>(
    categoriaManufacturers as IFilterCheckboxItem[]
  )
  .on(setСategoryManufacturers, (_, category) => category)
  .on(updateСategoryManufacturer, (state, payload) => [
    ...updateManufacturer(state, payload.id as string, {
      checked: payload.checked,
    }),
  ])
  .on(setСategoryManufacturersFromQuery, (state, manufacturersFromQuery) => [
    ...updateManufacturerFromQuery(state, manufacturersFromQuery),
  ])

export const $filteredСategory =courses
  .createStore<ICourse>({} as ICourse)
  .on(setFilteredCourse, (_, category) => category)