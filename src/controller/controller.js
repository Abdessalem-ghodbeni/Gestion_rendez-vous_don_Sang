'use strict';

const _publics = {};
var config = require('../config');
var getRawBody = require('raw-body');
var pool=config.pool;


_publics.getRawBody = (req) => {
  return new Promise((resolve, reject) => {
    getRawBody(req, {
      length: req.headers['content-length'],
      limit: '1mb',
    }, function (err, string) {
      if (err) return next(err)
      req.text = string;
      return resolve(req.text);
    })
  });
};




_publics.login = (member) => {

  var memberDetails={}
  var email = member.email;
  var password = member.password;

  return new Promise((resolve, reject) => {

    var sql = "select u.* , r.role FROM utilisateur u left join role r on (r.id= u.id_role ) where u.email = ? and u.password = ? ";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [email, password], function (err, members) {
        connection.release(); 
      var members = JSON.stringify(members);
      members = JSON.parse(members);

      if (err) {
        return reject();
      } else if (members[0] === undefined || (members[0].password !== password)) {
        memberDetails = {
          status: 403
        };
       
      } else {
        memberDetails = {
          member: members[0],
          status: 200,
        };
      }
      return resolve(memberDetails);
    });
  });
});
};





_publics.sendEmailToResponsable = (email , password) => { 

 
  return new Promise((resolve, reject) => { 
    var msg="";
    config.transporter.sendMail({
      from: 'freelanceinfoapp@gmail.com',
        to: email,
        subject: "Droit d'accés au plateforme e-donner",
        html: '<h3>Bonjour Monsieur/Madame '+' , \n \n </h3>'+
       "<p>Bienvenue sur notre plateforme  \n \n </p>"+
       '<p>'+' \n </p>'+
        "<p> Afin d'accéder à votre espace,  merci d'utiliser votre email et ce password "+password+" \n </p>"+
        "<p> Cordialement \n </p>"
      },(error, info) => {
        if(error){
          reject(error);
          msg="failure"
        }else{
          msg={msg:"success"}
        }   
        return resolve(msg)
      });
    })
  }


  
  

  _publics.notifierDonner = (emails , centreName) => { 

    return new Promise((resolve, reject) => { 
      var msg="";
      config.transporter.sendMail({
        from: 'freelanceinfoapp@gmail.com',
          to: emails,
          subject: "Demande de Sang",
          html: '<h3>Bonjour Monsieur/Madame '+' , \n \n </h3>'+
         "<p>  \n \n </p>"+
         '<p>'+' \n </p>'+
          "<p> Nous avons enregistré une nouvelle demande de sang en urgence dans la centre  "+centreName+" \n </p>"+
          "<p> Cordialement \n </p>"
        },(error, info) => {
          if(error){
            reject(error);
            msg="failure"
          }else{
            msg={msg:"success"}
          }   
          return resolve(msg)
        });
      })
    }
  




_publics.update_password = ( client) => {



  var id = client.id;
  var newpassword = client.newpassword;
 
  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "update utilisateur SET  password = ?  where id=?  ";
 
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [newpassword, id], function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success"};
      }
      return resolve(message);
    });
  });
  });
};



/**   gestion des utilisateurs   */

_publics.register = ( user) => {

  var nom = user.nom;
  var prenom = user.prenom;
  var email = user.email;
  var cin = user.cin;
  var telephone = user.telephone;
  var age  = user.age ;
  var ville   = user.ville  ; 
  var password  = user.password ;
  var groupe_sanguin   = user.groupe_sanguin  ;
  var id_role   = 3  ;
  var is_donner = 3  //en attente de test


  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "INSERT INTO utilisateur SET ? ";
    const newEmploye = { nom,  prenom , email , cin , age ,telephone , ville ,  password ,groupe_sanguin ,id_role , is_donner};
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, newEmploye, function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success", employeId:result.insertId};
      }
      return resolve(message);
    });
  });
  });
};



_publics.createResponsable = ( user) => {

  var nom = user.nom;
  var prenom = user.prenom;
  var email = user.email;
  var cin = user.cin;
  var telephone = user.telephone;
  var ville   = user.ville  ; 
  var password  = user.password ;
  var id_role   = 2  ;
  var id_centre = user.id_centre


  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "INSERT INTO utilisateur SET ? ";
    const newEmploye = { nom,  prenom , email , cin  ,telephone , ville ,  password  ,id_role , id_centre };
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, newEmploye, function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success", employeId:result.insertId};
      }
      return resolve(message);
    });
  });
  });
};




_publics.getUserById = (id) => {

  return new Promise((resolve, reject) => {
    var sql = "select u.* , r.role from utilisateur u  left join role r on (u.id_role = r.id) where u.id=? ";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql,[id], function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result[0]);  
    });
  });
});
};


_publics.getResponsables = () => {

  return new Promise((resolve, reject) => {
    var sql = "select u.* , c.nom as centreName , c.addresse as centreAddress from utilisateur u left join centre c on (u.id_centre = c.id)";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});
};


_publics.getResponsablesByCentreId = (centreId) => {

  return new Promise((resolve, reject) => {
    var sql = "select * from utilisateur where id_centre=?";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql,[centreId], function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});
};

_publics.deleteResponsable= (id) => {
 
  return new Promise((resolve, reject) => {
    var sql = "delete from utilisateur WHERE id = ?";
    var msg = "";
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err);
      }
      connection.query(sql, [id], function (err, result) {
        connection.release();
        if (err) {
          msg = "failure";
          reject(err);
        } else {
          msg = {msg:"success"};
        }
        return resolve(msg);
      });
    });
  });
};





_publics.getAllCitoyens = () => {

  return new Promise((resolve, reject) => {
    var sql = "select  * from utilisateur where id_role=3";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql ,function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});
};


//get list des donner ByCenteId


_publics.getListDonnerByCenterId = (centreId) => {

  return new Promise((resolve, reject) => {
    var sql = "select distinct u.* , c.nom as centreName , c.addresse as centreAddress from rendez_vous r left join  centre c   on (r.id_centre = c.id) left join utilisateur u  on (r.id_utilisateur = u.id)  where r.id_centre = ? and r.etat=1 ";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [centreId] ,function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});
};



_publics.getListDonnationByCenterIdAndUserId = (centreId , userId) => {

  return new Promise((resolve, reject) => {
    var sql = "select distinct * from rendez_vous where id_centre = ? and etat=1 and id_utilisateur=? ";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [centreId , userId] ,function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});
};


//mes propres  demandes de sang 
_publics.getMyBloodRequest = (id) => {

  return new Promise((resolve, reject) => {
    var sql = "select  u.nom , u.prenom , c.nom as centreName   , d.* from demande_sang d left join  centre c   on (d.id_centre = c.id) left join utilisateur u  on (d.id_utilisateur = u.id) where d.isarchive = 0 and d.id_utilisateur =? ";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql ,[id],function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});
};
// toutes les demandes de sang 
_publics.getBloodRequest = () => {

  return new Promise((resolve, reject) => {
    var sql = "select  u.nom , u.prenom , c.nom as centreName   , d.* from demande_sang d left join  centre c   on (d.id_centre = c.id) left join utilisateur u  on (d.id_utilisateur = u.id) where d.isarchive = 0";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql ,function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});
};


_publics.getAllEvenement = () => {

  return new Promise((resolve, reject) => {
    var sql = "select   c.nom as centreName   , e.* from evenement e left join  centre c   on (e.id_centre = c.id)   ";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql ,function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});
};


_publics.getAllReclamation = () => {

  return new Promise((resolve, reject) => {
    var sql = "select   * from reclamation    ";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql ,function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});
};



_publics.deleteCentre= (id) => {
 
  return new Promise((resolve, reject) => {
    var sql = "delete from centre WHERE id = ?";
    var msg = "";
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err);
      }
      connection.query(sql, [id], function (err, result) {
        connection.release();
        if (err) {
          msg = "failure";
          reject(err);
        } else {
          msg = {msg:"success"};
        }
        return resolve(msg);
      });
    });
  });
};


_publics.deleteEvenement= (id) => {
 
  return new Promise((resolve, reject) => {
    var sql = "delete from evenement WHERE id = ?";
    var msg = "";
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err);
      }
      connection.query(sql, [id], function (err, result) {
        connection.release();
        if (err) {
          msg = "failure";
          reject(err);
        } else {
          msg = {msg:"success"};
        }
        return resolve(msg);
      });
    });
  });
};


_publics.ajouter_centre= ( centre) => {

  var nom   = centre.nom  ;
  var email  = centre.email;
  var telephone  = centre.telephone ;
  var addresse  = centre.addresse ;

  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "INSERT INTO centre SET ? ";
    const newCentre = { nom  ,email,  telephone , addresse };
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, newCentre, function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success", centreId:result.insertId};
      }
      return resolve(message);
    });
  });
  });
};






_publics.ajouter_demande= ( demande) => {

  var date   = new Date() ;
  var groupe_sanguin  = demande.groupe_sanguin;
  var id_centre  = demande.id_centre ;
  var id_utilisateur  = demande.id_utilisateur ;

  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "INSERT INTO demande_sang SET ? ";
    const newDemande = { groupe_sanguin  ,date,  id_centre , id_utilisateur };
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, newDemande, function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success", centreId:result.insertId};
      }
      return resolve(message);
    });
  });
  });
};




_publics.ajouter_rendezVous= ( rendezVous) => {

  var date   =rendezVous.date ;
  var etat  = 3; //en attente
  var id_centre  = rendezVous.id_centre ;
  var id_utilisateur  = rendezVous.id_utilisateur ;

  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "INSERT INTO rendez_vous SET ? ";
    const newDemande = { etat  ,date,  id_centre , id_utilisateur };
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, newDemande, function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success", centreId:result.insertId};
      }
      return resolve(message);
    });
  });
  });
};





_publics.ajouter_reclamation= ( reclamation) => {

  var date   = new Date() ;
  var email  = reclamation.email ;
  var message  = reclamation.message ;

  return new Promise((resolve, reject) => {
    var messageRep = {};
    var sql = "INSERT INTO reclamation SET ? ";
    const newDemande = { date,  email , message };
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, newDemande, function (err, result) {
        connection.release(); 
      if (err) {
        messageRep ={msg:"failure"};
        reject(err);
      } else {
        messageRep = {msg:"success", centreId:result.insertId};
      }
      return resolve(messageRep);
    });
  });
  });
};


_publics.getAllCentres=()=>{

    return new Promise((resolve, reject) => {
      var sql = " select * from centre";
      pool.getConnection(function(err,connection){ 
        if (err) {  
        reject(err);
        }
        connection.query(sql, function (err, result) {
          connection.release(); 
        if (err) reject(err);
        return resolve(result);
      });
    });
  });

}


_publics.getCentreById=(id)=>{

  return new Promise((resolve, reject) => {
    var sql = " select * from centre where id=?";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [id],function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result[0]);
    });
  });
});

}


_publics.getStockSangByCentreId=(id)=>{

  return new Promise((resolve, reject) => {
    var sql = " select * from stock where id_centre =?";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [id],function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});

}


_publics.getHistoriqueDonByUserId=(id)=>{

  return new Promise((resolve, reject) => {
    var sql = " select  c.nom as centreName , r.date from rendez_vous r left join centre c  on (c.id = r.id_centre) where r.id_utilisateur =? and etat=1";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [id],function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});

}


_publics.getRendezVousByCentreId=(id)=>{

  return new Promise((resolve, reject) => {
    var sql = " select r.* , u.nom , u.prenom from rendez_vous r left join utilisateur  u on (u.id = r.id_utilisateur) where r.id_centre =? and etat=3";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [id],function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});

}




_publics.getAcceptedRendezVousByCentreId=(id)=>{

  return new Promise((resolve, reject) => {
    var sql = " select r.* , u.nom , u.prenom from rendez_vous r left join utilisateur  u on (u.id = r.id_utilisateur) where r.id_centre =? and etat=1";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [id],function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});

}




_publics.getListDonnerEmailByCentreById=(id)=>{

  return new Promise((resolve, reject) => {
    var sql = " select distinct u.email  from rendez_vous r left join utilisateur  u on (u.id = r.id_utilisateur) where r.id_centre =? ";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [id],function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});

}





_publics.getRendezVousByUserId=(id)=>{

  return new Promise((resolve, reject) => {
    var sql = " select r.* , c.nom as  centreName from rendez_vous r left join centre  c on (c.id = r.id_centre) where r.id_utilisateur =? ";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [id],function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});

}


_publics.getEvenementByCentreId=(id)=>{

  return new Promise((resolve, reject) => {
    var sql = " select * from evenement where id_centre =?";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [id],function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});

}


_publics.getStockSangByCentre=()=>{

  return new Promise((resolve, reject) => {
    var sql = " select sum(nombre_paquets)  as stockSang , c.nom  from stock s left join centre c on (c.id= s.id_centre ) group by  s.id_centre desc ";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql,function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});

}


_publics.getNombreOfUsers=()=>{

  return new Promise((resolve, reject) => {
    var sql = "  select count(*)  as nombreUsers  from utilisateur ";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql,function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});

}


_publics.getNombreOfCentres=()=>{

  return new Promise((resolve, reject) => {
    var sql = "  select count(*)  as nombreCentres  from centre ";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql,function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});

}


_publics.getNombreDonnerByCentre=()=>{

  return new Promise((resolve, reject) => {
    var sql = "  select count(*)  as nombreDonner , c.nom  from rendez_vous r left join centre c on (c.id= r.id_centre ) where r.etat = 1 group by  r.id_centre desc ";
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql,function (err, result) {
        connection.release(); 
      if (err) reject(err);
      return resolve(result);
    });
  });
});

}


_publics.update_centre = ( centre) => {


  var id = centre.id;
  var nom   = centre.nom  ;
  var email  = centre.email;
  var telephone  = centre.telephone ;
  var addresse  = centre.addresse ;

  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "update centre SET   nom=? ,  email =? , telephone=? , addresse=?  where id=?  ";
 
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [nom,  email , telephone , addresse , id], function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success"};
      }
      return resolve(message);
    });
  });
  });
};






_publics.ajouterDiagnostic = ( id , diag) => {


  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "update rendez_vous SET   diagnostic=?   where id=?  ";
 
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [diag , id], function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success"};
      }
      return resolve(message);
    });
  });
  });
};




_publics.update_stock = ( stock) => {


  var id_centre  = stock.id_centre 
  var groupe_sanguin    = stock.groupe_sanguin   ;
  var nombre_paquets   = stock.nombre_paquets ;


  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "update stock SET   nombre_paquets=?   where groupe_sanguin=? and id_centre=?  ";
 
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [nombre_paquets,  groupe_sanguin , id_centre ], function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success"};
      }
      return resolve(message);
    });
  });
  });
};


_publics.create_stock = ( stock) => {


  var id_centre  = stock.id_centre 
  var groupe_sanguin    = stock.groupe_sanguin   ;
  var nombre_paquets   = stock.nombre_paquets ;

  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "INSERT INTO stock SET ? ";
    const newCentre = { id_centre  ,nombre_paquets,  groupe_sanguin  };
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, newCentre, function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success", stockId:result.insertId};
      }
      return resolve(message);
    });
  });
  });
};



_publics.updateUser = ( user) => {

  var id = user.id;
  var nom = user.nom;
  var prenom = user.prenom;
  var age = user.age
  var cin = user.cin;
  var telephone = user.telephone;
  var ville   = user.ville  

  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "update utilisateur SET   nom=? ,  prenom =? , cin=? , telephone=? , ville=? , age=?   where id=?  ";
 
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [nom,  prenom , cin , telephone, ville ,age, id], function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success"};
      }
      return resolve(message);
    });
  });
  });
};



_publics.update_Responsable = ( user) => {

  var id = user.id;
  var nom = user.nom;
  var prenom = user.prenom;
  var email = user.email;
  var cin = user.cin;
  var telephone = user.telephone;
  var ville   = user.ville  

  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "update utilisateur SET   nom=? ,  prenom =? ,email=? , cin=? , telephone=? , ville=?   where id=?  ";
 
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [nom,  prenom , email , cin , telephone, ville , id], function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success"};
      }
      return resolve(message);
    });
  });
  });
};


_publics.accepterRendezvous = ( rendezVousId) => {


  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "update rendez_vous  SET   etat=1  where id=?  ";
 
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [rendezVousId], function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success"};
      }
      return resolve(message);
    });
  });
  });
};


_publics.refuserRendezvous = ( rendezVousId) => {


  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "update rendez_vous  SET   etat=0  where id=?  ";
 
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [rendezVousId], function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success"};
      }
      return resolve(message);
    });
  });
  });
};


_publics.create_event= ( event) => {

  var date   = event.date  ;
  var description  = event.description;
  var id_centre  = event.id_centre ;
 

  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "INSERT INTO evenement SET ? ";
    const newCentre = { date  ,description,  id_centre };
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, newCentre, function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success", centreId:result.insertId};
      }
      return resolve(message);
    });
  });
  });
};


_publics.isDonner = ( userId) => {

  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "update utilisateur SET   is_donner=1   where id=?  ";
 
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [ userId], function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success"};
      }
      return resolve(message);
    });
  });
  });
};


_publics.isNotDonner = ( userId) => {

  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "update utilisateur SET   is_donner=0   where id=?  ";
 
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [ userId], function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success"};
      }
      return resolve(message);
    });
  });
  });
};


_publics.repondre_test_diabete= ( reponse) => {

  var age    = reponse.age  ;
  var isfamilleDiabete   = reponse.isfamilleDiabete;
  var faimConstante   = reponse.faimConstante  ;
  var diminuationPoids   = reponse.diminuationPoids  ;
  var besoinUriner    = reponse.besoinUriner   ;
  var soifConstante   = reponse.soifConstante  ;
  var sexe     = reponse.sexe   ;
  var cholestériol    = reponse.cholestériol ;
  var grossesseDiabete    = reponse.grossesseDiabete   ;
  var bebe9kg   = reponse.bebe9kg  ;

  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "INSERT INTO test_diabete  SET ? ";
    const newReponse = { age  ,isfamilleDiabete,  faimConstante , diminuationPoids , besoinUriner , soifConstante , sexe ,
      cholestériol ,grossesseDiabete , bebe9kg };
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, newReponse, function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success", Id:result.insertId};
      }
      return resolve(message);
    });
  });
  });
};


_publics.repondre_test_cancer= ( reponse) => {

  var age    = reponse.age  ;
  var modificationMamelon    = reponse.modificationMamelon ;
  var masseDure    = reponse.masseDure   ;
  var ganglionsGonflé    = reponse.ganglionsGonflé   ;
  var antecedentsFamiliaux     = reponse.antecedentsFamiliaux    ;
  var encientePremierefois    = reponse.encientePremierefois   ;
  var faiblesse      = reponse.faiblesse    ;
  var accumulationPoumons     = reponse.accumulationPoumons  ;


  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "INSERT INTO test_cancer  SET ? ";
    const newReponse = { age  ,modificationMamelon,  masseDure , ganglionsGonflé , antecedentsFamiliaux , encientePremierefois , faiblesse ,
      accumulationPoumons  };
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, newReponse, function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success", Id:result.insertId};
      }
      return resolve(message);
    });
  });
  });
};




_publics.archiverDemande = ( id) => {


  return new Promise((resolve, reject) => {
    var message = {};
    var sql = "update demande_sang  SET   isarchive=1  where id=?  ";
 
    pool.getConnection(function(err,connection){ 
      if (err) {  
      reject(err);
      }
      connection.query(sql, [id], function (err, result) {
        connection.release(); 
      if (err) {
        message ={msg:"failure"};
        reject(err);
      } else {
        message = {msg:"success"};
      }
      return resolve(message);
    });
  });
  });
};

module.exports = _publics;