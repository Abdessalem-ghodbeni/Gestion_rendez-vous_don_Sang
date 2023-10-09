'use strict';

const router = require('express').Router();
const controller = require('../controller/controller');
var options = {
    inflate: true,
    limit: '100kb',
    type: 'application/octet-stream'
  };
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.raw(options));
router.use((req, res, next) => {
    res.payload = {};
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader('Access-Control-Allow-Credentials', true)
    next();
  });
  




router.post('/login',(req, res, next)=>
controller.getRawBody(req)
.then(memberDetails=>{
      return controller.login(JSON.parse(memberDetails))
}).then(result=>{
     res.send(result);    
})
.catch(next));


router.post('/register',(req, res, next)=>
controller.getRawBody(req)
.then(memberDetails=>{
      return controller.register(JSON.parse(memberDetails))
}).then(result=>{
     res.send(result);    
})
.catch(next));



router.post('/create_centre',(req, res, next)=>
controller.getRawBody(req)
.then(details=>{
    res.payload.responsable = JSON.parse(details).responsable
      return controller.ajouter_centre(JSON.parse(details).centre)
}).then(result=>{
    let id_centre = result.centreId
    res.payload.responsable.id_centre = id_centre
    return controller.createResponsable(res.payload.responsable)
}).then(result=>{
    return controller.sendEmailToResponsable(res.payload.responsable.email , res.payload.responsable.password)
}).then(result=>{
     res.send(result);    
})
.catch(next));




router.post('/ajouterResponsable',(req, res, next)=>
controller.getRawBody(req)
.then(details=>{
    res.payload.responsable = JSON.parse(details)
    return controller.createResponsable(JSON.parse(details))
}).then(result=>{
    return controller.sendEmailToResponsable(res.payload.responsable.email , res.payload.responsable.password)
}).then(result=>{
     res.send(result);    
})
.catch(next));



router.post('/update_centre',(req, res, next)=>
controller.getRawBody(req)
.then(details=>{
      return controller.update_centre(JSON.parse(details))
}).then(result=>{
     res.send(result);    
})
.catch(next));



router.post('/modify_Stock',(req, res, next)=>
controller.getRawBody(req)
.then(details=>{
      res.payload.stockDetails = JSON.parse(details)
      return controller.getStockSangByCentreId(JSON.parse(details).id_centre )
}).then(result=>{
     return result.filter(el => el.groupe_sanguin === res.payload.stockDetails.groupe_sanguin );
}).then(result=>{

    if (result.length === 0 ){
        return controller.create_stock(res.payload.stockDetails )
    }else{
        return controller.update_stock(res.payload.stockDetails )
    }   

}).then(result=>{
     res.send(result); 
})
.catch(next));






router.post('/update_password',(req, res, next)=>
controller.getRawBody(req)
.then(memberDetails=>{
      return controller.update_password(JSON.parse(memberDetails))
}).then(result=>{
     res.send(result);    
})
.catch(next));




router.post('/create_event',(req, res, next)=>
controller.getRawBody(req)
.then(data=>{

   
    return controller.create_event(JSON.parse(data))
})
.then(result=>{
   
        res.send(result);    
})
.catch(next));


router.post('/ajouter_rendezVous',(req, res, next)=>
controller.getRawBody(req)
.then(data=>{

   
    return controller.ajouter_rendezVous(JSON.parse(data))
})
.then(result=>{
   
        res.send(result);    
})
.catch(next));





router.post('/ajouter_demande',(req, res, next)=>
controller.getRawBody(req)
.then(data=>{

    res.payload.centreId = JSON.parse(data).id_centre  
    return controller.ajouter_demande(JSON.parse(data))
})
.then(data=>{
 
    return controller.getCentreById(res.payload.centreId)
})
.then(data=>{
 
    res.payload.centreName = data.nom
    return controller.getListDonnerEmailByCentreById(res.payload.centreId)
})

.then(data=>{

    let listEmails = []
    data.forEach(element => {
       listEmails.push(element.email) 
    });
 
    return controller.notifierDonner(listEmails ,res.payload.centreName )
})
.then(result=>{
   
        res.send(result);    
})
.catch(next));


router.post('/update_Responsable',(req, res, next)=>
controller.getRawBody(req)
.then(data=>{

    return controller.update_Responsable(JSON.parse(data))
})

.then(result=>{
   
        res.send(result);    
})
.catch(next));


router.post('/updateUser',(req, res, next)=>
controller.getRawBody(req)
.then(data=>{

    return controller.updateUser(JSON.parse(data))
})

.then(result=>{
   
        res.send(result);    
})
.catch(next));




router.post('/ajouter_reclamation',(req, res, next)=>
controller.getRawBody(req)
.then(data=>{

    return controller.ajouter_reclamation(JSON.parse(data))
})

.then(result=>{
   
        res.send(result);    
})
.catch(next));





router.get('/getNombreDonnerByCentre',urlencodedParser, (req, res, next) => 
controller.getNombreDonnerByCentre()
.then(data=>{
    res.send(data);
})
.catch(next));


router.get('/getNombreOfUsers',urlencodedParser, (req, res, next) => 
controller.getNombreOfUsers()
.then(data=>{
    res.send(data);
})
.catch(next));


router.get('/getNombreOfCentres',urlencodedParser, (req, res, next) => 
controller.getNombreOfCentres()
.then(data=>{
    res.send(data);
})
.catch(next));



router.get('/getStockSangByCentre',urlencodedParser, (req, res, next) => 
controller.getStockSangByCentre()
.then(data=>{
    res.send(data);
})
.catch(next));


router.get('/getAllCentres',urlencodedParser, (req, res, next) => 
controller.getAllCentres()
.then(data=>{
    res.send(data);
})
.catch(next));


router.get('/getAllCitoyens',urlencodedParser, (req, res, next) => 
controller.getAllCitoyens()
.then(data=>{
    res.send(data);
})
.catch(next));



router.get('/getEvenementByCentreId',urlencodedParser, (req, res, next) => 
controller.getEvenementByCentreId(req.query.id)
.then(data=>{
    res.send(data);
})
.catch(next));



router.delete('/deleteEvenement',urlencodedParser, (req, res, next) => 
controller.deleteEvenement(req.query.id)
.then(result=>{
    res.send(result);
})
.catch(next));

router.delete('/deleteCentre',urlencodedParser, (req, res, next) => 
controller.deleteCentre(req.query.id)
.then(result=>{
    res.send(result);
})
.catch(next));


router.delete('/deleteResponsable',urlencodedParser, (req, res, next) => 
controller.deleteResponsable(req.query.id)
.then(result=>{
    res.send(result);
})
.catch(next));




router.get('/getCentreById',urlencodedParser, (req, res, next) => 
controller.getCentreById(req.query.id)
.then(data=>{
    res.send(data);
})
.catch(next));

router.get('/getStockSangByCentreId',urlencodedParser, (req, res, next) => 
controller.getStockSangByCentreId(req.query.id)
.then(data=>{
    res.send(data);
})
.catch(next));



router.get('/getRendezVousByCentreId',urlencodedParser, (req, res, next) => 
controller.getRendezVousByCentreId(req.query.id)
.then(data=>{
    res.send(data);
})
.catch(next));

router.get('/ajouterDiagnostic',urlencodedParser, (req, res, next) => 
controller.ajouterDiagnostic(req.query.id , req.query.diag)
.then(data=>{
    res.send(data);
})
.catch(next));




router.get('/getAcceptedRendezVousByCentreId',urlencodedParser, (req, res, next) => 
controller.getAcceptedRendezVousByCentreId(req.query.id)
.then(data=>{
    res.send(data);
})
.catch(next));

router.get('/getHistoriqueDonByUserId',urlencodedParser, (req, res, next) => 
controller.getHistoriqueDonByUserId(req.query.id)
.then(data=>{
    res.send(data);
})
.catch(next));


router.get('/getRendezVousByUserId',urlencodedParser, (req, res, next) => 
controller.getRendezVousByUserId(req.query.id)
.then(data=>{
    res.send(data);
})
.catch(next));




router.get('/accepterRendezvous',urlencodedParser, (req, res, next) => 
controller.accepterRendezvous(req.query.id)
.then(data=>{
    res.send(data);
})
.catch(next));


router.get('/refuserRendezvous',urlencodedParser, (req, res, next) => 
controller.refuserRendezvous(req.query.id)
.then(data=>{
    res.send(data);
})
.catch(next));




router.get('/getListDonnerByCenterId',urlencodedParser, (req, res, next) => 
controller.getListDonnerByCenterId(req.query.id)
.then(result=>{
    res.send(result);
})
.catch(next));


router.get('/getListDonnationByCenterIdAndUserId',urlencodedParser, (req, res, next) => 
controller.getListDonnationByCenterIdAndUserId(req.query.centreId ,req.query.utilisateurId )
.then(result=>{
    res.send(result);
})
.catch(next));


router.get('/getBloodRequest',urlencodedParser, (req, res, next) => 
controller.getBloodRequest()
.then(result=>{
    res.send(result);
})
.catch(next));



router.get('/getMyBloodRequest',urlencodedParser, (req, res, next) => 
controller.getMyBloodRequest(req.query.id)
.then(result=>{
    res.send(result);
})
.catch(next));




router.get('/getAllEvenement',urlencodedParser, (req, res, next) => 
controller.getAllEvenement()
.then(result=>{
    res.send(result);
})
.catch(next));





router.get('/getAllEvenement',urlencodedParser, (req, res, next) => 
controller.getAllEvenement()
.then(result=>{
    res.send(result);
})
.catch(next));


router.get('/getAllReclamation',urlencodedParser, (req, res, next) => 
controller.getAllReclamation()
.then(result=>{
    res.send(result);
})
.catch(next));



router.get('/getResponsablesByCentreId',urlencodedParser, (req, res, next) => 
controller.getResponsablesByCentreId(req.query.id)
.then(result=>{
    res.send(result);
})
.catch(next));

router.get('/getUserById',urlencodedParser, (req, res, next) => 
controller.getUserById(req.query.id)
.then(result=>{
    res.send(result);
})
.catch(next));



router.get('/isDonner',urlencodedParser, (req, res, next) => 
controller.isDonner(req.query.id)
.then(data=>{
    res.send(data);
})
.catch(next));



router.get('/isNotDonner',urlencodedParser, (req, res, next) => 
controller.isNotDonner(req.query.id)
.then(data=>{
    res.send(data);
})
.catch(next));




router.post('/repondre_test_cancer',(req, res, next)=>
controller.getRawBody(req)
.then(data=>{

   
    return controller.repondre_test_cancer(JSON.parse(data))
})
.then(result=>{
   
        res.send(result);    
})
.catch(next));




router.post('/repondre_test_diabete',(req, res, next)=>
controller.getRawBody(req)
.then(data=>{

   
    return controller.repondre_test_diabete(JSON.parse(data))
})
.then(result=>{
   
        res.send(result);    
})
.catch(next));




router.get('/testSendEmail',(req, res, next)=>

controller.sendEmailToResponsable(req.query.email , req.query.password)
.then(result=>{
     res.send(result);    
})
.catch(next));




router.get('/archiverDemande',(req, res, next)=>

controller.archiverDemande(req.query.id)
.then(result=>{
     res.send(result);    
})
.catch(next));




module.exports = router;


