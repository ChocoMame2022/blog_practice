
const mongoose = require('mongoose')
/*
★★★
const marked = require('marked')
何でこれで動くようになったの？後で調べよ～っと！
*/
const { marked } = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        reqired: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
});

articleSchema.pre('validate', function(next) {
//    console.log('marked:' + marked)
    console.log('this.markdown:' + this.markdown)
    if (this.title) {
/*
        this.slug = slugify(this.title, { lower: true, strict: true })
*/
        this.slug = this.title
}

    if (this.markdown) {
/*
        ★★★
        エラーになってしまったので暫定的に処理を変えている
        this.sanitizedHtml = dompurify.sanitize( marked( this.markdown ) )
        this.sanitizedHtml = dompurify.sanitize( this.markdown )
*/
        this.sanitizedHtml = dompurify.sanitize( marked.parse( this.markdown ) )
    }

    next();
});

module.exports = mongoose.model('Article', articleSchema)