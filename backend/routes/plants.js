const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//get all plants
router.get("/", async (req, res, next) => {
  try {
    const plants = await prisma.plant.findMany();
    res.status(200).json(plants);
  } catch (err) {
    next(err);
  }
});

//get plant by id
router.get("/:id", async (req, res, next) => {
  try {
    const plant = await prisma.plant.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(plant);
  } catch (err) {
    next(err);
  }
});

//get plant humidity
router.get("/humidity/:id", async (req, res, next) => {
  try {
    const plant = await prisma.plantHumidity.findMany({
      take: 7,
      orderBy: { dateTime: "desc" },
      select: {
        plantId: Number(req.params.id),
        humidityLevel: true,
        dateTime: true,
      },
    });
    res.status(200).json(plant);
  } catch (err) {
    next(err);
  }
});

// post plant humidity
router.post("/humidity/:id", async (req, res, next) => {
  try {
    console.log(req.params);
    const response = await prisma.plantHumidity.create({
      data: {
        plantId: Number(req.params.id),
        humidityLevel: Number(req.body.humidity) || 0,
        dateTime: new Date().toISOString(),
      },
    });
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

//create plant
router.post("/", async (req, res, next) => {
  try {
    const plant = await prisma.plant.create({
      data: { ...req.body },
    });
    res.status(201).json(plant);
  } catch (err) {
    next(err);
  }
});

//update plant
router.put("/:id", async (req, res, next) => {
  try {
    const plant = await prisma.plant.update({
      where: { id: Number(req.params.id) },
      data: { ...req.body },
    });
    res.status(200).json(plant);
  } catch (err) {
    next(err);
  }
});

//delete plant
router.delete("/:id", async (req, res, next) => {
  try {
    const plant = await prisma.plant.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(plant);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
