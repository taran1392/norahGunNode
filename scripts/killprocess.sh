echo $1
echo "makehuman.py --headless --runserver $1" 

for pid in $(ps -ef | grep "makehuman.py --headless --runserver $1" | awk '{print $2}')
do

sudo kill -9 $pid;


done

