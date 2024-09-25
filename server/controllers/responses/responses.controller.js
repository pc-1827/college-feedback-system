const prisma = require('../../prismaClient');

// Create a new response
const createResponse = async (req, res) => {
  const { formId, answers } = req.body;
  const studentId = req.user.id; // From the JWT token

  try {
    // Check if the student has already submitted a response for this form
    const existingResponse = await prisma.response.findFirst({
      where: {
        formId: parseInt(formId),
        studentId: parseInt(studentId),
      },
    });

    if (existingResponse) {
      return res.status(400).json({ message: 'You have already submitted a response for this form.' });
    }

    // Create the new response
    const newResponse = await prisma.response.create({
      data: {
        studentId: parseInt(studentId),
        formId: parseInt(formId),
        answers, // This is an array of numbers (stored as JSONB in SQL)
      },
    });

    res.status(201).json({ message: 'Response submitted successfully', newResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting response' });
  }
};

// View a single response
const viewResponse = async (req, res) => {
    const { responseId } = req.params;

    try {
      const response = await prisma.response.findUnique({
        where: { id: parseInt(responseId) },
        include: {
          form: true,  // Include feedback form details (form_title, questions)
        },
      });

      if (!response) {
        return res.status(404).json({ message: 'Response not found' });
      }

      res.status(200).json({
        form_title: response.form.form_title,
        questions: response.form.questions,
        answers: response.answers,
        submitted_at: response.submitted_at,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving response' });
    }
  };

module.exports = {
    createResponse,
    viewResponse
}
