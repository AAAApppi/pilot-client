import { ICourse } from "./courses"

export interface IDashboardSlider {
    items: ICourse[]
    spinner: boolean
    goToPartPage?: boolean
  }

  export interface ICartAlertProps {
    count: number
    closeAlert: VoidFunction
  }