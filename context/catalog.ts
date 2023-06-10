import { ICatalog } from '@/types/catalogs'
import { createDomain } from 'effector-next'

const catalog = createDomain()

export const setCatalog = catalog.createEvent<ICatalog>()

export const $catalog = catalog
  .createStore<ICatalog>({} as ICatalog)
  .on(setCatalog, (_, part) => part)