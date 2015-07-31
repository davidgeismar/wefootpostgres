/**
 * Connections
 * (sails.config.connections)
 *
 * `Connections` are like "saved settings" for your adapters.  What's the difference between
 * a connection and an adapter, you might ask?  An adapter (e.g. `sails-mysql`) is generic--
 * it needs some additional information to work (e.g. your database host, password, user, etc.)
 * A `connection` is that additional information.
 *
 * Each model must have a `connection` property (a string) which is references the name of one
 * of these connections.  If it doesn't, the default `connection` configured in `config/models.js`
 * will be applied.  Of course, a connection can (and usually is) shared by multiple models.
 * .
 * Note: If you're using version control, you should put your passwords/api keys
 * in `config/local.js`, environment variables, or use another strategy.
 * (this is to prevent you inadvertently sensitive credentials up to your repository.)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.connections.html
 */

 module.exports.connections = {

  /***************************************************************************
  *                                                                          *
  * Local disk storage for DEVELOPMENT ONLY                                  *
  *                                                                          *
  * Installed by default.                                                    *
  *                                                                          *
  ***************************************************************************/
  localDiskDb: {
    adapter: 'sails-disk'
  },

  /***************************************************************************
  *                                                                          *
  * MySQL is the world's most popular relational database.                   *
  * http://en.wikipedia.org/wiki/MySQL                                       *
  *                                                                          *
  * Run: npm install sails-mysql                                             *
  *                                                                          *
  ***************************************************************************/
  mysql: {
    adapter: 'sails-mysql',
    host: 'localhost',
    port:   8889,
    user: 'root',
    password: 'root',
    database: 'wefoot'
  },
  
  mysql_dev: {
    adapter: 'sails-mysql',
    host: '62.210.115.66',
    port:   3306,
    user: 'root',
    password: 'labzeur1230',
    database: 'wefoot'
  },

  /***************************************************************************
  *                                                                          *
  * MongoDB is the leading NoSQL database.                                   *
  * http://en.wikipedia.org/wiki/MongoDB                                     *
  *                                                                          *
  * Run: npm install sails-mongo                                             *
  *                                                                          *
  ***************************************************************************/
  mongodb: {
    adapter: 'sails-mongo',
    host: 'localhost',
    port: 27017,
    user: 'root',
    password: 'root',
    database: 'wefoot'
    //schema : true
  },

  /***************************************************************************
  *                                                                          *
  * PostgreSQL is another officially supported relational database.          *
  * http://en.wikipedia.org/wiki/PostgreSQL                                  *
  *                                                                          *
  * Run: npm install sails-postgresql                                        *
  *                                                                          *
  *                                                                          *
  ***************************************************************************/

   postgres: {
     adapter: 'sails-postgresql',
     url: 'postgres://rycylnbajtinpx:gbaZVTZiscp23YlURuG_YGDPfW@ec2-54-83-18-87.compute-1.amazonaws.com:5432/d24j1kt7fmfa3g',
     port: 5432,
     user: 'rycylnbajtinpx',
     password: '9XBYDf_CwYJsozc_WHOHk07gK9',
     database: 'd1dg5dohvl8hho',
     ssl: true
   }


  /***************************************************************************
  *                                                                          *
  * More adapters: https://github.com/balderdashy/sails                      *
  *                                                                          *
  ***************************************************************************/

};
