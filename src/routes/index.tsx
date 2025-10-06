import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { CategoryPage } from '@/pages/CategoryPage';
import { PromptPage } from '@/pages/PromptPage';
import NotFound from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/category/:categorySlug',
    element: (
      <Layout>
        <CategoryPage />
      </Layout>
    ),
  },
  {
    path: '/category/:categorySlug/:subcategorySlug',
    element: (
      <Layout>
        <CategoryPage />
      </Layout>
    ),
  },
  {
    path: '/prompt/:id',
    element: (
      <Layout>
        <PromptPage />
      </Layout>
    ),
  },
  {
    path: '*',
    element: (
      <Layout>
        <NotFound />
      </Layout>
    ),
  },
]);