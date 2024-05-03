const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')

app = express();

host = 'localhost:'
port = 5000;

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