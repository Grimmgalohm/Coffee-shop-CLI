#!/usr/bin/env node
const colors = require('colors');
const inquirer = require('inquirer');
const cmd = require('commander');
const mongoose = require('mongoose');
const Coffee = require('./db/coffee-shop-db.js');

mongoose.connect('mongodb://localhost/coffee-cats-test')
  .then(instance => {
    const conn = instance.connections[0];
    console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
    
    cmd
    .command('guide')
    .action(function(){
      console.log('Cómo ordenar:'.red.bold);
      console.log('Responde según las siguientes opciones'.white);
      console.log('1. ¿Nombre?'.yellow, '[Cualquier nombre]'.blue);
      console.log('2. ¿Tipo de café?'.yellow, '[Americano, Latte, Expreso]'.blue);
      console.log('3. ¿Tipo de leche?'.yellow, '[Entera, Deslactosada, Light]'.blue);
      console.log('4. ¿Prefieres que el café esté descafeinado?'.yellow, '[y] o [N]'.blue);
      console.log('5. ¿Prefieres que el café esté frío?'.yellow, '[Y] o [N]'.blue);
      console.log('6. Clave del vendedor'.yellow, '[Password oculto]'.blue);
    });
  
    const questions = [
      {type: 'input', name: 'client', message: '¿Cuál es tu nombre?'},
      {type: 'list', name: 'coffeetype', message: '¿Qué tipo de café quieres?', choices:['Americano', 'Latte', 'Expreso']},
      {type: 'list', name: 'milktype', message: '¿Qué tipo de leche quieres?', choices:['Entera','Deslactosada','Light']},
      {type: 'confirm', name: 'ifdecaf', message: '¿Prefieres que el café esté caliente?'},
      {type: 'confirm', name: 'ifcold', message: '¿Prefieres que el café esté frío?'}  
    ];
  
    cmd
    .command('order')
    .action(function(){
      inquirer.prompt(questions).then(function(answers){
        console.log(answers);
        Coffee.create({
          client:answers.client,
          coffeetype:answers.coffeetype,
          milktype:answers.mylktype,
          ifdecaf:answers.ifdecaf,
          ifcold:answers.ifcold
        }).then(function(){
          console.log('Entendido, hemos tomado tu orden'.yellow.bold);
          mongoose.disconnect();
        });
      });
    });
  
    cmd
    .command('list')
    .option('-d, --date')
    .action(function(opts){
      var coffeesearch;
      coffeesearch = Coffee.find();
      if(opts.date){
        coffeesearch.sort({created:1});
      }
        coffeesearch.then(coffees => {
        console.log('Ordenes de café:'.red.bold);
        console.log('\r\n');
        for(var i=0; i < coffees.length; i++){
          var item = coffees[i];
          console.log('Cliente: '.yellow.bold + `${item.client}`.green);
          console.log('Tipo de café: '.yellow.bold + `${item.coffeetype}`.green);
          if(item.ifdecaf === true){console.log('¿Descafeinado?: '.yellow.bold + `Si`.green);}
          if(item.ifcold === true){console.log('¿Café frío?: '.yellow.bold + `Si`.green);}
          console.log('Fecha: '.yellow.bold + `${item.created}`.blue);
          console.log('\r\n');
        }mongoose.disconnect();
      });
    });
  
  cmd.parse(process.argv);

  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error('\n === Did you remember to start `mongod`? === \n');
    console.error(err);
  });