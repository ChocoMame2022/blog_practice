const express = require('express')
const Article = require('./../models/article')
/* Viewの作成に使用できるRouterを取得 */
const router = express.Router()

router.get('/new', (req, res) => {
    console.log('Article New')
    res.render('articles/new.ejs', { article: new Article()})
});

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit.ejs', { article: article })
});

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    console.log('req.param.id(get(/:id):' + req.params.id)
    console.log('article of findById:' + article)
    if (article == null) res.redirect('/')
    res.render('articles/show.ejs', {article: article})
});

/* Saveボタンによる保存処理 */
router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'));

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'));

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
});

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
    
        try {
            console.log('article:' + article)
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (e) {
            res.render(`articles/${path}`, {article: article})
        }
    }
}

module.exports = router
