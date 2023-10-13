import express from 'express';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: "/",
    routes: "am"
  }
];

moduleRoutes.forEach(route => router.use(route.path,));
export default router;
