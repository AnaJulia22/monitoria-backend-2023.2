import { Router } from "express";
import { prisma } from "../prisma.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(400).send("User not found");
  } 
  
  if (user.password === password) {
    return res.send({ message: "Logged in" });
  } else {
    return res.status(400).send("Invalid password");
  }
  
});
