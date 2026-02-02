import React from "react";
import { RouterProvider, RouteRenderer, RouteConfig } from "./lib/router";
import Layout from "./app/layout";
import HomePage from "./app/page";
import MusicPage from "./app/music/page";
import IntramuralsPage from "./app/intramurals/page";
const routes: RouteConfig = {
  "/": HomePage,
  "/music": MusicPage,
  "/intramurals": IntramuralsPage,
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
