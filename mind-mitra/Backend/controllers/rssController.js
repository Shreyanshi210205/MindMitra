import Parser from 'rss-parser'
import * as cheerio from 'cheerio';
const parser=new Parser;

const extractImageFromContent = (htmlContent) => {
  const $ = cheerio.load(htmlContent);
  const img = $("img").first().attr("src");
  return img || null;
};

export const getArticles=async(req,res)=>{
    try{
    const feed=parser.parseURL('https://www.mindful.org/category/health/feed/')
    const articles=(await feed).items.slice(0,6).map(item=>({
        title:item.title,
        link:item.link,
        snippet:item.contentSnippet,
        pubDate:item.pubDate,
        image:extractImageFromContent(item.content|| item['content:encoded'])
    }));
    
    res.json(articles);
    }
    catch(err){
        // console.error('Failed to fetch the rss feed',err);
        res.status(500).json({err:'Failed to fetch articles'})
    }

}