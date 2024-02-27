const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await prisma.fgsAlert.findMany();
    return res.status(200).json(alerts);
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

exports.getAlertById = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await prisma.fgsAlert.findUnique({
      where: { id: parseInt(id) },
    });
    return res.status(200).json(alert);
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

exports.createAlert = async (req, res) => {
  const { context, date } = req.body;
  try {
    const alert = await prisma.fgsAlert.create({
      data: {
        context,
        date,
      },
    });
    return res.status(200).json(alert);
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};
