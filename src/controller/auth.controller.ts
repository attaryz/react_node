import { Request, Response } from "express"
import { getManager } from "typeorm"
import { RegisterValidation } from "../validation/register.validation"
import bcryptjs from "bcryptjs"
import { sign, verify } from "jsonwebtoken"
import { User } from "../entity/user.entity"

export const Register = async (req: Request, res: Response) => {
  const body = req.body
  const { error } = RegisterValidation.validate(body)
  if (error) {
    return res.status(400).send(error.details)
  }
  if (body.password !== body.password_confirm) {
    return res
      .status(400)
      .send({ message: "Password and Confirm Password must be same" })
  }

  const repository = getManager().getRepository(User)
  const { password, ...user } = await repository.save({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password: await bcryptjs.hash(body.password, 10),
  })

  res.send(user)
}

export const Login = async (req: Request, res: Response) => {
  const repository = getManager().getRepository(User)
  const user = await repository.findOne({
    email: req.body.email,
  })
  if (!user) {
    return res.status(400).send({ message: "invalid credentials" })
  }
  // @ts-ignore
  if (!(await bcryptjs.compare(req.body.password, user.password))) {
    return res.status(400).send({ message: "invalid credentials" })
  }

  // @ts-ignore
  const token = sign({ id: user.id }, process.env.SECRET_KEY)
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day,
  })
  // @ts-ignore

  res.send({
    message: "login successful",
  })
}

export const AuthenticatedUser = async (req: Request, res: Response) => {
  const { password, ...user } = req["user"]
  res.send(user)
}
export const Logout = async (req: Request, res: Response) => {
  res.clearCookie("jwt")
  res.send({
    message: "logout successful",
  })
}
