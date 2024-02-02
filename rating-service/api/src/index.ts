import express, {Request, Response} from "express";

const app = express()
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, rating-service!')
})

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
})
