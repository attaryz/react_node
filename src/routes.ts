import { Router } from "express"
import {
  Login,
  Register,
  AuthenticatedUser,
  Logout,
} from "./controller/auth.controller"
import { AuthMiddleware } from "./middleware/auth.middleware"

export const routes = (router: Router) => {
  router.post("/api/register", Register)
  router.post("/api/login", Login)
  router.post("/api/user", AuthMiddleware, AuthenticatedUser)
  router.post("/api/logout", AuthMiddleware, Logout)
}
