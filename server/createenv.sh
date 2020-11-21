file=".env"
echo "DB_PASSWORD=$1" > $file
echo "DB_USER=$2" >> $file
echo "#VAR=value" >> $file
cat $file