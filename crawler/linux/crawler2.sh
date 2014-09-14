#!/bin/bash
#create directory for currentDay
parent=$(pwd)
cd $(pwd)
now="$(date +'%d.%m.%Y')"
nowDir="$(pwd)"/$now
FILE_NEWSLETTER=newsletter.txt
FILE_NEWSLETTER_ABSOLUTE=$parent"/"$FILE_NEWSLETTER
PYTHON_SCRIPT=$parent"/"htmlParser.py
yesterdayDate=`date +'%d.%m.%Y' --date='yesterday'` 
yesterdayDir="$(pwd)"/$yesterdayDate
echo $yesterdayDir
 echo "$now"
 mkdir -p "$now"
## declare an sites variables
#declare -a sites=("http://www.mt.ro" "http://mts.ro" "http://www.primariatm.ro/index.php" )
declare -a sites=("http://www.mt.ro")
declare -a interests=("unknown" "unknown" )
function callWget
{	
	cd ${now}
	for i in "${sites[@]}"
	do 
	echo "$i"         
	wget -rKE $i
	done
 }
function checkYesterday
{	

if [ -d "$yesterdayDir" ]; then
  # Control will enter here if $DIRECTORY exists.
  echo "save diff to newsletter.txt"
  saveDiff
else
    echo "do nothing return current news"
fi
 }
function saveDiff

{    
	regex="Only in $nowDir"
	FILE_DUMP=$parent"/"dump.txt
	sudo -i rm -f $FILE_NEWSLETTER_ABSOLUTE
	sudo -i rm -f $FILE_DUMP
	diff -rq $nowDir $yesterdayDir > $FILE_DUMP
	while read line; do
	if [[ $line == $regex* ]]; then 
	relativePath=`echo "$line" | cut -f 2 -d ":" | sed -e 's/^[ \t]*//'`
	absolutePath=$nowDir"/"$relativePath
	echo $absolutePath >>$FILE_NEWSLETTER_ABSOLUTE
	fi 
done < $FILE_DUMP
}
function callPython
{
	cd $parent
	result=`python $PYTHON_SCRIPT $FILE_NEWSLETTER_ABSOLUTE`
	echo $result 
}
callWget
checkYesterday
callPython



