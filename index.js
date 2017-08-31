//  fs.existsSync("directory") || fs.mkdirSync("directory");
// Dependencies



 var domainName="https://absentiachargen.com";
var fs = require('fs');
var express = require('express');
var portastic = require('portastic');
var app = express();

var helper=require (__dirname+"/helper");


/*var options={
key:fs.readFileSync('./file.pem'), cert: fs.readFileSync('./file.crt')	
};*/
var server = require('http').Server(app);
server.listen(8000);
server.timeout = 2400000;
var io = require('socket.io')(server);
const fileUpload = require('express-fileupload');
var fileReady = false;
var path = require('path');


app.get("/test",function(req,res){

    res.send("Hello ! Server is up and running");

});
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
// Setup routing for static assets
//app.use(express.static('public'));
console.log(__dirname + "/uploads");
app.use(express.static(__dirname + "/uploads"));
app.use(fileUpload());
// Express routes
app.get('/', function(req, res) {
    res.write('Welcome to BioNode server');
    res.end();
});

app.get("/upload",(req,res)=>{

    console.log(req.files);
    if(req.files.inputValues){

        consoel.log(req.files.inputValues);
    }
});

app.use('/bodyParts', express.static(__dirname+'/BodyParts'))
io.on('connection',function(socket){
var port;

var scriptProcess;

	console.log("got a connection");

socket.on("disconnect",()=>{
        console.log("got Disconnected "+port );
    
});

socket.on("bodyPart",(req)=>{

    console.log("received bpdy part request"+req);
                  var files=[];
                    
                     data=[];
                     
                     var folder=`${__dirname}/BodyParts/${req.part}`;
                     

                     console.log("folder"+folder);
                    try{
                     var jsonData=fs.readFileSync(path.join(folder,"input.json"),'utf-8');
                    var obj=JSON.parse(jsonData);
                    obj["file"]=`${domainName}/bodyParts/`+req.part+"/"+"input.png";
                    data.push(obj);



                    for (var i=0;i<6;i++){

                        var jsonData=fs.readFileSync(path.join(folder,"data"+i+".json"),'utf-8');
                        var obj=JSON.parse(jsonData);
                        obj["file"]=`${domainName}/bodyParts/`+req.part+"/"+"out"+i+".png";

                        data.push(obj);


                    }                            
                    
                    
                    var jsonData=fs.readFileSync(path.join(folder,"output.json"),'utf-8');
                    var obj=JSON.parse(jsonData);
                    obj["file"]=`${domainName}/bodyParts/`+req.part+"/"+"output.png";
                    data.push(obj);
                    }catch(ex){
                        console.log("failed to serve body parts request");
                        
                    }
						socket.emit('bodyPart',{files:data,part:req.part});
			


});

socket.on("upload",(req)=>{
    console.log("upload req");
    if(!req.inputValues && !req.outputValues)
        {
            socket.emit('errorInfo',{msg:"Not all the parameters were provided"});
        return;
        }
//make timestamp folder
	var folder_id=new Date().getTime();
    var folder=path.join( __dirname, "uploads", ""+folder_id);
    //fs.mkdir(folder);  //this is asynchronous,sometimes it executes early, but sometime it takes time
    fs.mkdirSync(folder);  //this should fix
console.log("saving files");    
        //save files first
        try{

            fs.writeFileSync(path.join( folder,"input.json"),JSON.stringify(req.inputValues));
            fs.writeFileSync(path.join( folder,"output.json"),JSON.stringify(req.outputValues));
           //generate the python script

  
        }catch(ex){
                console.log("Failed to save the files");
                console.log(ex);
                
                            socket.emit('errorInfo',{msg:"Failed to save files",err:ex});
                return;
        }
        //run.py
                            console.log("executing ramp.py");
		                    var pyScript="python"+" c:\\s3\\ramp.py";  
	                        console.log("command" + pyScript);
                            child_process=require("child_process");
                            var inputfile=path.join( folder,"input.json");
                            var outputfile=path.join( folder,"output.json");
                        console.log(`${pyScript} ${inputfile} ${outputfile} ${folder}`);
                                child_process.exec(`${pyScript} ${inputfile} ${outputfile} ${folder}`,function(err,stdout,stderr){

                                    if(err)
                                        {
                                            console.log("failed to run ramp.py");
					                        socket.emit('errorInfo',{msg:"Failed to process the files",id:folder_id});
                                            console.log(err.toString())
                                        }
                                        else{
                                            console.log("ramp.py exited");
                                        
                                            files=[];
                                            data=[];
                                            
                                            for (var i=0;i<4;i++){
                                                var jsonData=fs.readFileSync(path.join(folder,"data"+i+".json"),'utf-8');
                                                var obj=JSON.parse(jsonData);
                                                data.push(obj);


                                            }                            
                    
                    

						                    socket.emit('files',{files:data,id:folder_id,generationName:req.generationName});
					                        console.log(stdout);
                                            console.log(stderr);
                            
                                        } //else

});
socket.emit("info",{msg:"Files uploaded successfully"});

});

socket.on("exportImage",(req)=>{

    

});
socket.on("exportModel" ,(req)=>{

if( !req.inputValues)
        {
            socket.emit('errorInfo',{msg:"Not all the parameters were provided"});
        return;
        }
//make timestamp folder
	var folder_id=new Date().getTime();
    var folder=__dirname+ "/uploads/"+ folder_id;
    //fs.mkdir(folder);  //this is asynchronous,sometimes it executes early, but sometime it takes time
    fs.mkdirSync(folder);  //this should fix
console.log("saving files");    
        //save files first
        try{
            fs.writeFileSync(folder+"/input.json",JSON.stringify(req.inputValues));
           //generate the python script

            var scriptContent=helper.getRunFbxScript(port);
            fs.writeFileSync(folder+"/runfbx.py", scriptContent);
            //copy   python script
            var renderFile=__dirname+"/scripts/render.json"        
            fs.createReadStream(renderFile).pipe(fs.createWriteStream(folder+"/render.json"));
	    var exportFbxFile=__dirname+"/scripts/exportfbx.json"
            fs.createReadStream(exportFbxFile).pipe(fs.createWriteStream(folder+"/exportfbx.json"));

            
  
        }catch(ex){
                console.log("Failed to save the files");
                console.log(ex);
                
                            socket.emit('errorInfo',{msg:"Failed to save files",err:ex});
                return;
        }
        //run.py
                            console.log("executing runfbx.py");
		                    var pyScript="python2 "+folder+"/runfbx.py";  
	                        console.log("command" + pyScript);
				            child_process=require("child_process");
                                child_process.exec(`python2 ${folder}/runfbx.py input.json fbxoutput.fbx`,function(err,stdout,stderr){

                                    if(err)
                                        {
                                            console.log("failed to run runfbx.py");
					                        socket.emit('errorInfo',{msg:"Failed to Export the fbx  files",id:folder_id,error:err});
                                            console.log(err.toString())
                                        }
                                        else{
                                            console.log("runfbx.py exited");
                                        
                                            files=[];
                                            data=[];
                                            var obj=`${domainName}/`+folder_id+"/fbxoutput.fbx";
                                            data.push(obj)
						                    socket.emit('exportModel',{files:data,id:folder_id});
					                        console.log(stdout);
                                            console.log(stderr);
                            
                                        } //else

});
socket.emit("info",{msg:"Files uploaded successfully"});
    


});


}); //on connection ends
/*
// Socket.io
io.on('connection', function(socket) {
    var count;
    console.log("got a connection " + socket);
    // Read the count value from count.txt
    if (fileReady == true) {
        fileReady = false;
        socket.emit('file-ready');
        console.log("File ready sent");
    }
    socket.on('pause', function() { socket.emit('file-ready'); });
    // When a client clicks the button
    socket.on('btn-clicked', function() {});
});*/






 /* var child_process = require("child_process");
            
            
            
            
            
            child_process.exec("./sbgui -scriptpath /var/www/temp/smartbody-cli-mod -script " + fileName + '.py', {
                cwd: "/var/www/smartbody/bin"
            }, function(err, stdout, stderr) {
                if (err) {
                    console.log(err.toString());
                } else if (stdout !== "") {
                    console.log(stdout);
                    fileReady = true;
                    console.log("Finished execution");
                    res.download('/var/www/outputs/' + autorigged_mesh_dae, autorigged_mesh_dae);
                    fileName = "";
                    autorigged_mesh_dae = "";
                } else {
                    console.log(stderr);
                }
            });
        });*/
 
