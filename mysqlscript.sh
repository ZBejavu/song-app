#!/bin/bash

sudo apt -y install expect

# spawn sudo mysql_secure_installation
# expect \"Enter current password for root (enter for none):\"
# send \"$PWD\r\"
# expect \"Would you like to setup VALIDATE PASSWORD plugin?\"
# send \"n\r\" 
# expect \"Change the password for root ?\"
# send \"n\r\"
# expect \"Remove anonymous users?\"
# send \"y\r\"
# expect \"Disallow root login remotely?\"
# send \"y\r\"
# expect \"Remove test database and access to it?\"
# send \"y\r\"
# expect \"Reload privilege tables now?\"
# send \"y\r\"

SECURE_MYSQL=$(expect -c "
set timeout 10
spawn sudo mysql -u root #
send \"USE mysql;\r\"
send \"UPDATE user SET plugin='mysql_native_password' WHERE User='root';\r\"
send \"FLUSH PRIVILEGES;\r\"
send \"exit;\r\"
expect eof
")

echo "$SECURE_MYSQL"

sudo apt -y purge expect