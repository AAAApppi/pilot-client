export interface ICourse {
    rows: never[]
    id: number
    course: string
    price: number
    cource_category: string
    coursename: string
    description: string
    images: string
    new: boolean
    popularity: number
    compatibility: string
  }

  export interface ICourses {
    count: number,
    rows:ICourse[]
  }