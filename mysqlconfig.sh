
file="mysqlconfig.txt"
echo "use mysql;" > $file
# echo "update user set plugin="mysql_native_password" where User='root';" >> $file
# echo "UPDATE mysql.user SET authentication_string =PASSWORD('$1') WHERE User='root';" >> $file
echo "CREATE USER 'zach'@'localhost' IDENTIFIED BY '$1';" >> $file
echo "GRANT ALL PRIVILEGES ON *.* TO 'zach'@'localhost' WITH GRANT OPTION;" >> $file
echo "flush privileges;" >> $file
echo "quit;" >> $file
cat $file
# echo "update user set password="$1" where User='root';" >> $file