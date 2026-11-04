import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('components/layout/header.tsx', [
    index('pages/index.tsx'),
    route('home', 'pages/home.tsx'),
    route('assets', 'pages/assets.tsx'),
    route('dashboard', 'pages/dashboard.tsx'),
  ]),
] satisfies RouteConfig;
