
import React from 'react';
import { RouterProvider, RouteRenderer, RouteConfig } from './lib/router';
import Layout from './app/layout';
import HomePage from './app/page';
import MusicPage from './app/music/page';

const routes: RouteConfig = {
  '/': HomePage,
  '/music': MusicPage,
};

const App: React.FC = () => {
  return (
    <RouterProvider>
      <Layout>
        <RouteRenderer routes={routes} />
      </Layout>
    </RouterProvider>
  );
};

export default App;
