import json
import io
import os;
dirname = os.path.dirname(os.path.abspath(__file__));
def writeFile(outputjson,files):
	dirname = os.path.dirname(os.path.abspath(__file__));
	print dirname+'data%d.json' %files
	with io.open(dirname+'/data%d.json' % files, 'w', encoding='utf8') as outfile:
        	outfile.write(unicode(json.dumps(outputjson, ensure_ascii=False)))
		print 'saving'+ dirname+'data%d.json' %files;

def interpolation(shape1,shape2,nShapes):
	# nShapes=3
	nPoints = len(shape1)
	# print nPoints
	N = [[] for _ in xrange(nShapes)]
	# print N
	for i in xrange(nShapes):
		i=i+1
		for j in xrange(nPoints):
			y1 = float(shape1[j])
			# print "y1 = ",y1
			y2 = float(shape2[j])
			# print "y2 = ",y2
			dy = (y2-y1)/(nShapes+1)
			# print "dy = ",dy
			yN = y1 + i*dy
			# print "yN = ",yN
			N[i-1].append(yN)
	return N

with open(dirname+'/input.json', 'r') as f:
    input1 = json.load(f)
with open(dirname+'/output.json','r') as f2:
    output = json.load(f2)
inputList = []
outputList = []
keyList = []

for key,value in input1.items():
    inputList.append(value)
    keyList.append(key)

for key,value in output.items():
    outputList.append(value)

# print inputList
# print outputList

complete = interpolation(inputList,outputList,3)
#print "Length of out",len(complete)
print complete
for i in range(0,len(complete)):
    with open(dirname+'/input.json', 'r') as f:
        newjson = json.load(f)
        for j in range(0,len(complete[i])):
            newjson[keyList[j]] = complete[i][j]
        print newjson.items()
        writeFile(newjson,i)    
