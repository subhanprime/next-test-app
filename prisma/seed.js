const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const books = [
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "Fiction",
      publicationDate: new Date("1960-07-11"),
    },
    {
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian",
      publicationDate: new Date("1949-06-08"),
    },
    {
      title: "Moby Dick",
      author: "Herman Melville",
      genre: "Adventure",
      publicationDate: new Date("1851-10-18"),
    },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Tragedy",
      publicationDate: new Date("1925-04-10"),
    },
    ...Array.from({ length: 46 }, (_, i) => ({
      title: `Book Title ${i + 5}`,
      author: `Author ${i + 5}`,
      genre: [
        "Fiction",
        "Dystopian",
        "Adventure",
        "Tragedy",
        "Science Fiction",
      ][i % 5],
      publicationDate: new Date(`200${i % 10}-0${(i % 9) + 1}-0${(i % 8) + 1}`),
    })),
  ];

  for (const book of books) {
    await prisma.book.create({
      data: book,
    });
  }

  console.log("Seed data added successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
