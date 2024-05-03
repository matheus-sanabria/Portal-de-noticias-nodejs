const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://root:S44CxbxiTLbuFke0@cluster0.eijj7wb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser')

app = express();

host = 'localhost:'
port = 5000;
/*
mongoose.connect('mongodb+srv://root:S44CxbxiTLbuFke0@cluster0.eijj7wb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',{
    useNewUrlParser: true, useUnifiedTopology: true
}).then(()=>{
    console.log('Conectado com sucesso!');
}).catch((err)=>{
    console.log(err.message);
});
*/

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
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


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
app.get('/',(req,res)=>{
    //console.log(req.query);

    if(req.query.busca == null){
        res.render('home',{});
    }else{
        //res.send('Você buscou por: '+req.query.busca+' na categoria: '+req.query.categoria);
    res.render('busca',{});    
    }

    //res.send('página home funcionando');
})

app.get('/:slug',(req,res)=>{
    //res.send(req.params.slug);
    res.render('single',{});
// http://localhost:5000/sobre-codificadores-de-negocios
})

app.listen(port,()=>{
    console.log('Server rodando em http://'+host+port);
})