const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const url = "mongodb+srv://root:S44CxbxiTLbuFke0@cluster0.eijj7wb.mongodb.net/codificators?retryWrites=true&w=majority&appName=Cluster0";
const mongoose = require('mongoose');
// const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser')

app = express();

host = 'localhost:'
port = 5000;

const Posts = require('./Posts.js');

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado com sucesso ao MongoDB!');
}).catch((err) => {
  console.error('Erro ao conectar ao MongoDB:', err);
});

/*
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("codificators").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
*/

app.use( bodyParser.json() ); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

// motor de renderização  vizualização
app.engine('html', require('ejs').renderFile);
/* express definir engine (motor de renderização) para o tipo html,
utilizando da dependencia ejs para renderizar o arquivo*/
app.set('view engine', 'html');
/* express definir motor de vizualização para o tipo html */
app.use('/public', express.static(path.join(__dirname, 'public')));
/* express usar arquivos estáticos no diretório public */
app.set('views', path.join(__dirname, '/pages'));
/* express definir vizualizações no diretório paginas */


//rotas
/*
app.get('/',(req,res)=>{
    //console.log(req.query);

    if(req.query.busca == null){
      Posts.find({}).sort({'_id': -1}).exec(function(err,posts){
        console.log(posts[0]);
      });
        res.render('home',{});
    }else{
        //res.send('Você buscou por: '+req.query.busca+' na categoria: '+req.query.categoria);
    res.render('busca',{});    
    }

    //res.send('página home funcionando');
})
*/

app.get('/', async (req, res) => {
  try {
    if (req.query.busca == null) {
      const posts = await Posts.find({}).sort({ '_id': -1 }).exec();
      const formattedPosts = posts.map((post) => {
        return {
          title: post.title,
          content: post.content,
          shortDesc: post.content.substring(0, 100),
          image: post.image,
          slug: post.slug,
          category: post.category,
          views: post.views
        };
      });

      const topPosts = await Posts.find({}).sort({ 'views': -1 }).limit(3).exec();
      const formattedTopPosts = topPosts.map((post) => {
        return {
          title: post.title,
          content: post.content,
          shortDesc: post.content.substring(0, 100),
          image: post.image,
          slug: post.slug,
          category: post.category,
          views: post.views
        };
      });

      res.render('home', { posts: formattedPosts, topPosts: formattedTopPosts });
    } else {
      const posts = await Posts.find({ title: { $regex: req.query.busca, $options: "i" } }).exec();
      res.render('busca', { posts: posts, contagem: posts.length });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing your request.");
  }
});



app.get('/:slug', async (req, res) => {  // Adiciona async aqui
  try {
    // Incrementa o contador de visualizações e retorna o documento atualizado
    const response = await Posts.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1 } }, { new: true }).exec();
    
    if (response != null) {
      const topPosts = await Posts.find({}).sort({ 'views': -1 }).limit(4).exec();  // Use await corretamente
      const formattedTopPosts = topPosts.map((post) => {
        return {
          title: post.title,
          content: post.content,
          shortDesc: post.content.substring(0, 100),
          image: post.image,
          slug: post.slug,
          category: post.category,
          views: post.views
        };
      });

      res.render('single', { news: response, topPosts: formattedTopPosts });
    } else{
        res.redirect('/');
    }
    

  } catch (err) {
    // Lida com o erro, se houver algum
    console.error(err);
    res.status(500).send('Erro ao buscar o post.');
  }
});



app.listen(port,()=>{
    console.log('Server rodando em http://'+host+port);
})