const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//get all users
router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

//get user by id
router.get("/:id", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

//create user
router.post("/", async (req, res, next) => {
  try {
    const user = await prisma.user.create({
      data: { ...req.body },
    });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

//update user
router.put("/:id", async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { ...req.body },
    });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

//delete user
router.delete("/:id", async (req, res, next) => {
  try {
    const user = await prisma.user.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
