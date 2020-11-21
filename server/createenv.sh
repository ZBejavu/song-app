file=".env"
echo "DB_PASSWORD=$1" > $file
echo "#HOST=host" >> $file
echo "#VAR=value" >> $file
cat $file