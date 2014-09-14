## How to install php-cli to run this script:
##debian
sudo apt-get install php5-cli
sudo apt-get install php5-dev
sudo apt-get install make
sudo apt-get install php-pear

sudo pecl install mongo

sudo -i
echo 'extension=mongo.so' >> /etc/php5/cli/php.ini

##running
sudo php cli-crawler.php

##todo 
config


##mongodb pecl installation
http://ro1.php.net/manual/en/mongo.installation.php#mongo.installation.manual
