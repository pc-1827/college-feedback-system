const prisma = require('../../prismaClient');

// Create a new group
const createGroup = async (req, res) => {
  const { groupName, studentIds } = req.body;
  const { id: teacherId } = req.user;  // From JWT

  try {
    // Create group for the teacher
    const group = await prisma.group.create({
      data: {
        name: groupName,
        teacherId,
        students: {
          connect: studentIds.map(id => ({ id })),
        },
      },
    });

    res.status(201).json({ message: 'Group created successfully', group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating group' });
  }
};

const viewGroups = async (req, res) => {
  const { id: teacherId } = req.user;  // From JWT

  try {
    const groups = await prisma.group.findMany({
      where: { teacherId },
      select: {
        id: true,
        name: true,
        students: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        forms: {
          select: {
            id: true,
            form_title: true,
          }
        }
      },
    });

    res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching groups' });
  }
};

const editGroup = async (req, res) => {
  const { groupId } = req.params;
  const { groupName, studentIds } = req.body;

  try {
    // Update group name and students
    const group = await prisma.group.update({
      where: { id: parseInt(groupId) },
      data: {
        name: groupName,
        students: {
          set: studentIds.map(id => ({ id })),  // Reconnect the students
        },
      },
    });

    res.status(200).json({ message: 'Group updated successfully', group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating group' });
  }
};

const deleteGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    await prisma.feedbackForm.deleteMany({
      where: { groupId: parseInt(groupId) }
    })

    await prisma.group.delete({
      where: { id: parseInt(groupId) },
    });

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting group' });
  }
};

module.exports = {
  createGroup,
  viewGroups,
  editGroup,
  deleteGroup
}
