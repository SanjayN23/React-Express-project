var mysql=require('mysql');
var exp=require('express');
var bparser = require('body-parser');
bparserInit = bparser.urlencoded({extended: false});
var cors = require('cors');//Import the cors middleware
var app = exp();
app.use(cors());
app.use(exp.json());
var mysqlconnection=mysql.createConnection({
    host:'localhost',
    database: 'world',
    user: 'root',
    password: 'root',
    port: 3306
});
function checkConnection(error){
    if(error == undefined){
        console.log("Connected to Database....");
    }
    else{
        console.log("Error code : " + error.errno);
        console.log(error.message);
    }
}
function feedback(error){
    if(error != undefined){
        console.log(error.errno);
        console.log(error.message);
    }
    else{
        console.log("Open the browser and visit this url http://localhost:9901/getUser");
    }
}
app.listen(9901, feedback);
var queryresults=undefined;
function processResults(error,results){ //use to check for results and error if present, results will be saved in JSON
    queryresults=results;
    console.log(results);//will display the query of results
}
function displayAllUsers(request,response)
{
    mysqlconnection.connect(checkConnection);
    mysqlconnection.query('Select * from users',processResults);
    response.send(queryresults);
}
app.get('/getAll',displayAllUsers);
 
function getUserById(request, response){
    var userid = request.query.uid;
    console.log(userid);
    //Parameterqized SQL
    mysqlconnection.query('select * from users where userid = ?', [userid], processResults);
    response.send(queryresults);
}
app.get('/getById', getUserById);
 
function getUserByEmail(request, response){
    var uemail = request.query.uemail;
    //Parameterqized SQL
    mysqlconnection.query('select * from users where emailid = ?', [uemail], processResults);
    response.send(queryresults);
}
app.get('/getByEmail', getUserByEmail);
 
var statusMessage = "";
function checkInsertStatus(error){
    (error == undefined)? statusMessage='<b>Insert Successful...</b>' :
    statusMessage='<b>Insert failure ' + error.message + '</b>';
}
 
function checkUpdateStatus(error){
    (error == undefined)? statusMessage='<b>Update Successful...</b>' :
    statusMessage='<b>Update failure ' + error.message + '</b>';
}
function checkDeleteStatus(error){
    (error == undefined)? statusMessage='<b>Delete Successful...</b>' :
    statusMessage='<b>Delete failure ' + error.message + '</b>';
}
 
function insertUser(request, response){
    var userid = request.body.userid;
    var password = request.body.password;
    var emailid = request.body.emailid;
    mysqlconnection.query('Insert into users values (?, ?, ?)', [userid, password, emailid], checkInsertStatus);
    response.send(JSON.stringify(statusMessage));
}
app.post('/insert', bparserInit, insertUser);
 
function updateUser(request, response){
    var userid = request.body.userid;
    var password = request.body.password;
    var emailid = request.body.emailid;
    mysqlconnection.query('Update users SET userid = ?, password = ?, emailid = ? where userid = ?', [userid, password, emailid, userid], checkUpdateStatus);
    response.send(JSON.stringify(statusMessage));
}
app.put('/update', bparserInit, updateUser);
 
function deleteUser(request, response){
    var userid = request.body.userid;
    mysqlconnection.query('Delete from users where userid = ?', [userid], checkDeleteStatus);
    response.send(JSON.stringify(statusMessage));
}
app.post('/delete', bparserInit, deleteUser);
 
//----------------------------------------------------------------------
//                                   Contact Us
//----------------------------------------------------------------------
 
function feedback(error){
    if(error != undefined){
        console.log(error.errno);
        console.log(error.message);
    }
    else{
        console.log("Server Started on port 4000");
        console.log("Open the browser and visit this url http://localhost:4000/getContacts");
    }
}
app.listen(4000, feedback);
function displayAllContacts(request,response)
{
    mysqlconnection.connect(checkConnection);
    mysqlconnection.query('Select * from Contact',processResults);
    response.send(queryresults);
}
app.get('/getAllContact',displayAllContacts);
 
function getContactByID(request, response){
    var id = request.query.contactid;
    mysqlconnection.query('select * from Contact where contactid = ?', [id], processResults);
    response.send(queryresults);
}
app.get('/getContactByID', getContactByID);
 
var statusMessage = "";
function checkInsertStatus(error){
    (error == undefined)? statusMessage='<b>Insert Successful...</b>' :
    statusMessage='<b>Insert failure ' + error.message + '</b>';
}
 
function checkUpdateStatus(error){
    (error == undefined)? statusMessage='<b>Update Successful...</b>' :
    statusMessage='<b>Update failure ' + error.message + '</b>';
}
function checkDeleteStatus(error){
    (error == undefined)? statusMessage='<b>Delete Successful...</b>' :
    statusMessage='<b>Delete failure ' + error.message + '</b>';
}
 
function insertContact(request, response){
    var fname = request.body.firstName;
    var lname = request.body.lastName;
    var phone = request.body.phone;
    var email = request.body.emailid;
    var address = request.body.address;
    mysqlconnection.query('Insert into Contact (firstname, lastname, phonenumber, EmailID, address) values (?, ?, ?, ?, ?)', [fname, lname, phone, email, address], checkInsertStatus);
    response.send(JSON.stringify(statusMessage));
}
app.post('/insertContact', bparserInit, insertContact);
 
function updateContact(request, response){
    var id = request.body.contactid;
    var fname = request.body.firstName;
    var lname = request.body.lastName;
    var phone = request.body.phone;
    var email = request.body.emailid;
    var address = request.body.address;
    mysqlconnection.query('Update Contact SET firstname = ?, lastname = ?, phonenumber = ?, EmailID = ?, address = ? where contactid = ?', [fname, lname, phone, email, address, id], checkUpdateStatus);
    response.send(JSON.stringify(statusMessage));
}
app.put('/updateContact', bparserInit, updateContact);
 
// function deleteContact(request, response){
//     var id = request.body.contactid;
//     mysqlconnection.query('Delete from Contact where contactid = ?', [id], checkDeleteStatus);
//     response.send(JSON.stringify(statusMessage));
// }
// app.post('/deleteContact', bparserInit, deleteContact);

function deleteContact(request, response) {
    var id = request.query.contactid;
    mysqlconnection.query('DELETE FROM Contact WHERE contactid = ?', [id], function (error, results) {
      if (error) {
        console.error("Error during contact deletion: ", error);
        response.status(500).send("Error deleting the contact. Check the server logs for more details.");
      } else {
        console.log("Contact deleted successfully");
        response.status(200).send("Contact deleted successfully");
      }
    });
  }
  
  app.delete('/deleteContact', bparserInit, deleteContact);
  mysqlconnection.connect(checkConnection);
  