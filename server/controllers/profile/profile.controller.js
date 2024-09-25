const prisma = require('../../prismaClient');

// Get student profile (feedback forms and responses)
const getStudentProfile = async (req, res) => {
  const { studentId } = req.params;

  try {
    // Fetch the student's groups
    const studentGroups = await prisma.group.findMany({
      where: {
        students: {
          some: {
            id: parseInt(studentId),
          },
        },
      },
      include: {
        forms: {
          include: {
            responses: {
              where: {
                studentId: parseInt(studentId),
              },
            },
          },
        },
      },
    });

    // Format the response with form and response details
    const feedbackDetails = studentGroups.map(group => {
      return group.forms.map(form => ({
        form_id: form.id,
        form_title: form.form_title,
        questions: form.questions,
        student_response: form.responses[0]?.answers || null,  // Student's response or null if not submitted
      }));
    }).flat();

    res.status(200).json(feedbackDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving student profile' });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    // Fetch all the students with specified details
    const students = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        year: true,
        branch: true,
        div: true,
      },
    });

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving students' });
  }
};

// Get teacher profile (group feedback summary)
const getTeacherProfile = async (req, res) => {
  const { teacherId } = req.params;

  try {
    // Fetch the teacher's groups and feedback forms
    const teacherGroups = await prisma.group.findMany({
      where: {
        teacherId: parseInt(teacherId),
      },
      include: {
        forms: {
          include: {
            responses: true,
          },
        },
      },
    });

    // Calculate average ratings for each form
    const feedbackSummary = teacherGroups.map(group => {
      return group.forms.map(form => {
        const responseCount = form.responses.length;
        const formAverage = responseCount > 0
          ? form.responses.reduce((total, response) => {
              const avgResponse = response.answers.reduce((sum, rating) => sum + rating, 0) / response.answers.length;
              return total + avgResponse;
            }, 0) / responseCount
          : 0;

        return {
          form_id: form.id,
          form_title: form.form_title,
          average_rating: formAverage.toFixed(2),  // Return average rating rounded to 2 decimal places
        };
      });
    }).flat();

    res.status(200).json(feedbackSummary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving teacher profile' });
  }
};

// Get all teachers
const getAllTeachers = async (req, res) => {
  try {
    // Fetch all the teachers with specified details
    const teachers = await prisma.teacher.findMany({
      select: {
        id: true,
        email: true,
        subject: true,
        designation: true,
      },
    });

    res.status(200).json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving teachers' });
  }
};

module.exports = {
  getStudentProfile,
  getAllStudents,
  getTeacherProfile,
  getAllTeachers,
};
