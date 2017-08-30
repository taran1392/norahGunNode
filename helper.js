
function getScriptContent(port){
 var scriptContent = `import requests
import shutil
import time;
import os;
import sys;
from subprocess import call
dirname = os.path.dirname(os.path.abspath(__file__))


#time.sleep(20); 
call(["python2",dirname+"/interp1.py"])

#call(["./biocharnorahserver.sh", "5000"]) #this should be done manually before starting
params = {'action':'render'}
files = {'design': open(dirname+"/input.json", 'rb'), 'render': open(dirname+"/render.json", "rb")}
rinput = requests.post("http://localhost:${port}/render", files=files, data=params, stream=True)
with open(dirname+"/input.png", "wb") as f:
	rinput.raw.decode_content = True
	shutil.copyfileobj(rinput.raw, f)

params['skipreset'] = 'on'

for i in range(0,3):
	designjson = "data"+str(i)+".json"
	outpng = "out"+str(i)+".png"
	outfbx = "out"+str(i)
	files = {'design': open(dirname+"/"+designjson, 'rb'), 'render': open(dirname+"/render.json", "rb")}
	response = requests.post("http://localhost:${port}/render", files=files, data=params, stream=True)
	with open(dirname+"/"+outpng, "wb") as f:
		response.raw.decode_content = True
		shutil.copyfileobj(response.raw, f)

files = {'design': open(dirname+"/output.json", 'rb'), 'render': open(dirname+"/render.json", "rb")}
rinput = requests.post("http://localhost:${port}/render", files=files, data=params, stream=True)
with open(dirname+"/output.png", "wb") as f:
	rinput.raw.decode_content = True
	shutil.copyfileobj(rinput.raw, f)
sys.stdout.write("Script executed");

`;
return scriptContent;
}

function getRunFbxScript(port){

	return `
import requests
import shutil
import sys
import os;
import sys;
dirname = os.path.dirname(os.path.abspath(__file__))

        #call(["./biocharnorahserver.sh", "5000"]) #this should be done manually before starting
params = {'action':'fbx'}

files = {'design': open(dirname+"/"+sys.argv[1], 'rb'), '3dopts': open(dirname+"/"+"exportfbx.json", "rb")}
rinput = requests.post("http://localhost:${port}/render", files=files, data=params, stream=True)
with open(dirname+"/"+sys.argv[2], "wb") as f:
        rinput.raw.decode_content = True
        shutil.copyfileobj(rinput.raw, f)
	
	`

}

module.exports={

	getScriptContent:getScriptContent,
	getRunFbxScript:getRunFbxScript
}
