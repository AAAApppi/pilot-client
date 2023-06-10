import Head from 'next/head'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useCallback, useEffect, useState } from 'react'
import { useStore } from 'effector-react'
import Layout from '@/components/layout/Layout'
import useRedirectByUserCheck from '@/hooks/useRedirectByUserCheck'
import { IQueryParams } from '@/types/catalog'
import Custom404 from '../404'
import { $catalog, setCatalog } from '@/context/catalog'
import { getCatalogFx } from '@/app/api/course'
import CoursePage from '@/components/templates/CoursePage/CoursePage'
import Breadcrumbs from '@/components/modules/Breadcrumbs/Breadcrumbs'

function CatalogPartPage({ query }: { query: IQueryParams }) {
  const { shouldLoadContent } = useRedirectByUserCheck()
  const catalog = useStore($catalog)
  const [error, setError] = useState(false)
  const router = useRouter()
  const getDefaultTextGenerator = useCallback(
    (subpath: string) => subpath.replace('catalog', 'Каталог'),
    []
  )
  const getTextGenerator = useCallback((param: string) => ({}[param]), [])
  const lastCrumb = document.querySelector('.last-crumb') as HTMLElement

  useEffect(() => {
    loadCatalog()
  }, [router.asPath])

  useEffect(() => {
    if (lastCrumb) {
      lastCrumb.textContent = catalog.coursename
    }
  }, [lastCrumb, catalog])

  const loadCatalog = async () => {
    try {
      const data = await getCatalogFx(`/course/find/${query.partId}`)

      if (!data) {
        setError(true)
        return
      }

      setCatalog(data)
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  return (
    <>
      <Head>
        <title>Pilot | {shouldLoadContent ? catalog.coursename : ''}</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg" sizes="32x32" href="/img/logo.svg" />
      </Head>
      {error ? (
        <Custom404 />
      ) : (
        shouldLoadContent && (
          <Layout>
            <main>
              <Breadcrumbs
                getDefaultTextGenerator={getDefaultTextGenerator}
                getTextGenerator={getTextGenerator}
              />
              <CoursePage />
              <div className="overlay" />
            </main>
          </Layout>
        )
      )}
    </>
  )
}

export async function getServerSideProps(context: { query: IQueryParams }) {
  return {
    props: { query: { ...context.query } },
  }
}

export default CatalogPartPage