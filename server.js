const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article.js')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()

mongoose.connect('mongodb://localhost/blog', {

/*
    ★★★
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
    useCreateIndex: trueを指定するとエラーになったため削除した
*/
    useNewUrlParser: true, useUnifiedTopology: true

})

/* Set View Engine 'ejs' これでejsコードをHTMLに変換できるようになる*/
app.set('veiw engine', 'ejs')
app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))

/* メインへのインデックスルートを設定 */
app.get('/', async (req, res) => {
    const articles = await Article.find().sort({
        createdAt: 'desc'
    })
    res.render('articles/index.ejs', {articles: articles})
});
app.use('/articles', articleRouter)

app.listen(5000)