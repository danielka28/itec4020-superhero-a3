const express = require('express')
const router = new express.Router()

// models
const Hero = require(__basedir + '/models/hero')
const Comment = require(__basedir + '/models/comment')

const DEFAULT_HEROES_PER_PAGE = 9
const DEFAULT_COMMENTS_PER_PAGE = 3



router.get('/', async (req, res) => {
  let pageNum = req.query.pageNum || 1
  pageNum = Number(pageNum)
  let size = await Hero.find()
  size = size.length
  let pages = Math.ceil(size / DEFAULT_HEROES_PER_PAGE)
  const results = await Hero.find().sort({name: 1}).skip((pageNum - 1) * DEFAULT_HEROES_PER_PAGE).limit(DEFAULT_HEROES_PER_PAGE).lean()
  var nextPage = pageNum + 1
  var previousPage = pageNum - 1 
  if(pageNum == pages){nextPage = pageNum} 
  if(pageNum == 1){ previousPage = 1}
  res.render('index', {results, pages, pageNum, nextPage, previousPage}) 
})


router.get('/search', async (req, res) => {
  let pageNum = req.query.pageNum || 1
  pageNum = Number(pageNum)
  let int = req.query.intelligence
  let str = req.query.strength
  let spe = req.query.speed
  let dur = req.query.durability
  let pow = req.query.power
  let com = req.query.combat
  if(!int){int = 0}
  if(!str){str = 0}
  if(!spe){spe = 0}
  if(!dur){dur = 0}
  if(!pow){pow = 0}
  if(!com){com = 0}
  const name = req.query.name
  let gender = req.query.gender
  if(gender == ''){gender=["Male", "Female"]}

  let size = await Hero.find({name: {$regex: name, $options: 'im', $not: { $regex: ' ' + name, $options: 'im'}},"appearance.gender": {$in: gender}, "powerstats.intelligence": {$gte: int}, "powerstats.strength": {$gte: str}, "powerstats.speed": {$gte: spe}, "powerstats.durability": {$gte: dur}, "powerstats.power": {$gte: pow}, "powerstats.combat": {$gte: com},})
  size = size.length
  let pages = Math.ceil(size / DEFAULT_HEROES_PER_PAGE)
  const results = await Hero.find({name: {$regex: name, $options: 'im', $not: { $regex: ' ' + name, $options: 'im'}},"appearance.gender": {$in: gender}, "powerstats.intelligence": {$gte: int}, "powerstats.strength": {$gte: str}, "powerstats.speed": {$gte: spe}, "powerstats.durability": {$gte: dur}, "powerstats.power": {$gte: pow}, "powerstats.combat": {$gte: com},}).sort({name: 1}).skip((pageNum - 1) * DEFAULT_HEROES_PER_PAGE).limit(DEFAULT_HEROES_PER_PAGE).lean()
  var nextPage = pageNum + 1
  var previousPage = pageNum - 1 
  if(pageNum == pages){nextPage = pageNum} 
  if(pageNum == 1){ previousPage = 1}
  res.render('index', {results, pages, pageNum, nextPage, previousPage})
})


router.get('/hero/:id', async (req, res) => {
  let heroId = req.params.id
  const results = await Hero.findById(heroId).lean()
  res.render('heroInfo', {results})
})


module.exports = router
