const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createStudent() {
  const newStudent = await prisma.student.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashed_password',
      year: 3,
      branch: 'CSE',
      div: 'A',
    },
  });
  console.log(newStudent);
}

createStudent();
