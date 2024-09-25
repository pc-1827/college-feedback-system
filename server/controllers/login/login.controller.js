const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../prismaClient');

const register = async (req, res) => {
  const { name, email, password, year, branch, div, subject, designation, role } = req.body;
  console.log(req.body)

  try {
    // Check if user already exists
    const userExists = await prisma[role].findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user based on role
    let user;
    if (role === 'student') {
      user = await prisma.student.create({
        data: {
          name,
          email,
          password: hashedPassword,
          year,
          branch,
          div,
        },
      });
    } else if (role === 'teacher') {
      user = await prisma.teacher.create({
        data: {
          email,
          password: hashedPassword,
          subject,
          designation,
        },
      });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const login = async (req, res) => {
  const { email, password, role } = req.body;
  console.log(req.body)

  try {
    // Find user based on role
    const user = await prisma[role].findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  register,
  login,
};
