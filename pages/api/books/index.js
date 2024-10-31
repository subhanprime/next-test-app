import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const {
        search = "",
        page = 1,
        genre = "",
        author = "",
        publicationDate = "",
      } = req.query;

      const decodedSearch = decodeURIComponent(search);
      const decodedGenre = decodeURIComponent(genre);
      const decodedAuthor = decodeURIComponent(author);
      const decodedPublicationDate = decodeURIComponent(publicationDate);
      const itemsPerPage = 10;
      const currentPage = parseInt(page);

      const filters = {};

      if (decodedSearch) filters.title = { equals: decodedSearch };
      if (decodedAuthor) filters.author = { equals: decodedAuthor };
      if (decodedGenre) filters.genre = { equals: decodedGenre };
    
      if (decodedPublicationDate) {
        const parsedDate = new Date(decodedPublicationDate);
        if (!isNaN(parsedDate.getTime())) {
          filters.publicationDate = { gte: parsedDate };
        } else {
          console.warn(
            "Invalid publication date format:",
            decodedPublicationDate
          );
        }
      }

      console.log("Filters Applied:", filters);

      const books = await prisma.book.findMany({
        where: filters,
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
      });

      const totalBooks = await prisma.book.count({ where: filters });

      res.status(200).json({
        books: books || [],
        totalBooks: totalBooks || 0,
        totalPages: Math.ceil((totalBooks || 1) / itemsPerPage),
      });
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
