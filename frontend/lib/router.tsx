
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

type NavigationOptions = {
  replace?: boolean;
};

type RouteContextType = {
  route: string;
  push: (path: string, options?: NavigationOptions) => void;
};

const DEFAULT_ROUTE = '/';

const getCurrentPath = () =>
  typeof window !== 'undefined' ? window.location.pathname || DEFAULT_ROUTE : DEFAULT_ROUTE;

const RouterContext = createContext<RouteContextType>({
  route: DEFAULT_ROUTE,
  push: () => {},
});

export const useRouter = () => useContext(RouterContext);

export const RouterProvider = ({ children }: { children: ReactNode }) => {
  const [route, setRoute] = useState<string>(() => getCurrentPath());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => setRoute(getCurrentPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const push = useCallback(
    (path: string, options?: NavigationOptions) => {
      setRoute((currentRoute) => {
        if (currentRoute === path) {
          return currentRoute;
        }

        if (typeof window !== 'undefined') {
          const method = options?.replace ? 'replaceState' : 'pushState';
          window.history[method](null, '', path);
          window.scrollTo(0, 0);
        }
        return path;
      });
    },
    []
  );

  const value = useMemo(() => ({ route, push }), [route, push]);

  return (
    <RouterContext.Provider value={value}>
      {children}
    </RouterContext.Provider>
  );
};

interface LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export const Link = ({ href, children, className }: LinkProps) => {
  const { route, push } = useRouter();
  const isActive = route === href;
  const baseClass = className ? className.trim() : '';
  const activeClass = 'text-neutral-900 dark:text-white';
  const inactiveClass = 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white';
  
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        push(href);
      }}
      className={`${baseClass} ${isActive ? activeClass : inactiveClass}`.trim()}
    >
      {children}
    </a>
  );
};

export type RouteConfig = Record<string, React.ComponentType>;

interface RouteRendererProps {
  routes: RouteConfig;
  fallbackRoute?: string;
}

export const RouteRenderer = ({ routes, fallbackRoute = DEFAULT_ROUTE }: RouteRendererProps) => {
  const { route } = useRouter();
  const Component = routes[route] || routes[fallbackRoute];
  return Component ? <Component /> : null;
};
