import api from '../axiosClient'
import { createEffect } from 'effector-next';
import { toast } from 'react-toastify'

export const  getBestNewsPartsFx = createEffect( async(url:string) =>{
    const {  data  } = await api.get(url)

    return data
})

export const getCoursesFx = createEffect( async(url:string) =>{
    const {  data  } = await api.get(url)

    return data
})

export const getCatalogFx = createEffect(async (url: string) => {
    const { data } = await api.get(url)
  
    return data
  })
  
  export const searchCatalogFx = createEffect(
    async ({ url, search }: { url: string; search: string }) => {
      const { data } = await api.post(url, { search })
  
      return data.rows
    }
  )
  
  export const getCatalogByNameFx = createEffect(
    async ({ url, name }: { url: string; name: string }) => {
      try {
        const { data } = await api.post(url, { name })
  
        return data
      } catch (error) {
        toast.error((error as Error).message)
      }
    }
  )