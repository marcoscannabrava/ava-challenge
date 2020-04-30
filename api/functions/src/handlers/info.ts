import {Request, Response} from 'express'

// [TODO]

export default (req: Request, res: Response) => {
  res.json({
    "ok": true,
    "author": {
      "email": "mpcannabrava@gmail.com",
      "name": "Marcos Cannabrava"
    },
    "frontend": {
      "url": "string, the url of your frontend."
    },
    "language": "node.js",
    "sources": "string, the url of a github repository including your backend sources and your frontend sources",
    "answers": {
      "1": "string, answer to the question 1",
      "2": "string, answer to the question 2",
      "3": "string, answer to the question 3"
    }
  })
}