const prisma = require('../../prismaClient');

// Create a feedback form
const createForm = async (req, res) => {
  const { groupId, form_title, questions } = req.body;

  try {
    const form = await prisma.feedbackForm.create({
      data: {
        form_title,
        questions,  // Questions should be an array of strings (JSONB type in SQL)
        groupId: parseInt(groupId),
      },
    });

    res.status(201).json({ message: 'Form created successfully', form });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating form' });
  }
};

const viewForm = async (req, res) => {
    const { formId } = req.params;

    try {
      const form = await prisma.feedbackForm.findUnique({
        where: { id: parseInt(formId) },
        include: {
          _count: {
            select: { responses: true },  // Get the count of responses
          },
        },
      });

      if (!form) {
        return res.status(404).json({ message: 'Form not found' });
      }

      res.status(200).json({
        form_title: form.form_title,
        questions: form.questions,
        response_count: form._count.responses,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving form' });
    }
};

const deleteForm = async (req, res) => {
    const { formId } = req.params;

    try {
      // Delete responses related to the form
      await prisma.response.deleteMany({
        where: { formId: parseInt(formId) },
      });

      // Delete the form itself
      await prisma.feedbackForm.delete({
        where: { id: parseInt(formId) },
      });

      res.status(200).json({ message: 'Form and its responses deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting form' });
    }
  };

module.exports = {
    createForm,
    viewForm,
    deleteForm
}
