export interface ICatalog {
    id: number
    course: string
    price: number
    cource_category: string
    coursename: string
    description: string
    images: string
    in_stock: number
    new: boolean
    popularity: number
    compatibility: string
  }
  
  export interface ICalogos {
    count: number
    rows: ICatalog[]
  }