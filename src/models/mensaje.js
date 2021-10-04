const { knex } = require ('../database/knex')//este lo uso para el funcionamiento normal
//const { knex } = require ('../database/drop')//este borra las tablas, si existen
//const { knex } = require ('../database/migracion')//esto solo para el inicio al crear la tabla
class Mensaje{

    async getAll(){
        try{
            let mensajes = await knex.from('mensajes').select('*')
            return mensajes
        } catch(err){  
            throw err
        }
    }

    async save({email, message}){
            try{
                await knex('mensajes').insert({email,message})
            }catch(err){
                throw err
            }
        
    }
}

module.exports = new Mensaje()