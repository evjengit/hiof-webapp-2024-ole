import { Hono } from "hono";
import { cors } from "hono/cors";
import { students } from "./data/students";

const app = new Hono();

app.use("/*", cors());

// Kall i frontend:    fetch('https://server-url/api/students/, {method: 'GET'})
app.get('/api/students', (c) => {
  return c.json(students);
})

// mangler validering: id ikke gyldig, student finnes ikke
//  fetch('https://server-url/api/students/${id}, {method: 'GET'})
app.get('/api/students:id', (c) => {
  const id = c.req.param("id")
  const student = students.filter((student) => student.id === id)
  return c.json(student);
})

//   fetch('https://server-url/api/students/, {method: 'POST', body: JSON.stringify(data)}) @@@ mangler headere
app.get('/api/students', async (c) => {
  const data = await c.req.json();
  const { name } = data;
  students.push({ id: crypto.randomUUID(), name });
  return c.json({ data: students, status: 201 });
})

//   fetch('https://server-url/api/students/, {method: 'DELETE'}) @@@ mangler headere
app.get('/api/students/:id', (c) => {
  const id = c.req.param("id")
  const filteredStudents = students.filter(
    (student) => student.id !== id
  )
  return c.json(filteredStudents);
})

// fetch('https://server-url/api/students/${id}, {method: 'PATCH', body: JSON.stringify(data)})
app.patch('/api/students/:id', async (c) => {
  const id = await c.req.param("id")
  const { name } = await c.req.json()
  students = students.map((student) =>
    student.id === id ? { ...student, name } : student
  );
  return c.json(students);
})


app.onError((err, c) => {
  console.error(err);

  return c.json(
    {
      error: {
        message: err.message,
      },
    },
    { status: 500 }
  );
});

export default app;
