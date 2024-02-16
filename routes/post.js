import { Router } from "express";
import { prisma } from "../prisma.js";
import * as uuid from 'uuid';
import express from "express";
import multer from 'multer';


export const postRouter = Router();

postRouter.use(express.json());
postRouter.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/post');
    },
    filename: function (req, file, cb) {

      cb(null, file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });

postRouter.post("", upload.single('filename'), async (req, res) => {
    try {
      const { description, authorId } = req.body;
      const filename = req.file.filename;
  
      const newPost = await prisma.post.create({
        data: {
          id: uuid.v4(),
          description,
          filename,  
          authorId,
          createdAt: new Date()
        },
      });
  
      res.json(newPost);
    } catch (error) {
      console.error("Erro ao criar a postagem:", error);
      res.status(500).json({ error: "Erro ao criar a postagem" });
    }
  });
  
postRouter.get("/", async (req, res) => {
    try {
      const posts = await prisma.post.findMany();
      res.json(posts);
    } catch (error) {
      console.error("Erro ao recuperar as postagens:", error);
      res.status(500).json({ error: "Erro ao recuperar as postagens" });
    }
  });
  
postRouter.get("/:id", async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
  
      if (!post) {
        res.status(404).json({ error: "Postagem não encontrada" });
      } else {
        res.json(post);
      }
    } catch (error) {
      console.error("Erro ao recuperar a postagem:", error);
      res.status(500).json({ error: "Erro ao recuperar a postagem" });
    }
  });
