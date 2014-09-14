#!/usr/bin/python3.4
import urllib2
import os  
import re   
import string  
import sys  
import getpass  
import urllib  
import subprocess
import codecs
from bs4 import BeautifulSoup 
STATIC_MTS="mts.ro"
STATIC_MT="www.mt.ro" 
class Flux:
	@staticmethod
	def execute():
		filename=sys.argv[1]
		f = open(filename)
		lines = f.readlines()
		f.close()
		for currentFile in lines:
			if os.path.isfile(currentFile):
				Flux.printValues(currentFile)
			else:
				Flux.walk(currentFile)
	@staticmethod
	def walk(dir):
		#""" walks a directory, and executes a callback on each file """
		dir = os.path.abspath(dir)
		dirWithoutSpace = dir.replace("\n","")
		for file in [file for file in os.listdir(dirWithoutSpace) if not file in [".",".."]]:
			nfile = os.path.join(dirWithoutSpace,file)
			if os.path.isfile(nfile):
				Flux.printValues(nfile)
			else:
				Flux.walk(nfile)
 
  
	@staticmethod
	def printValues( fileTest):
		if fileTest.endswith(".html"):
			htmlfile = open(fileTest,'r').read()
			soup = BeautifulSoup(htmlfile.decode('utf-8','ignore'))
			#print soup.prettify().encode('UTF-8')
			tempDirectories =fileTest.split('/');
			for temp in tempDirectories:
				if temp is STATIC_MT:
					for div in soup.findAll('div', attrs={'class': 'page-header'}):
						print div.h2.text
					for p in soup.findAll('p'):
						print p.text
				elif temp is STATIC_MTS:
					for div in soup.findAll('div', attrs={'class': 'page-header'}):
						print div.h2.text
					for p in soup.findAll('p'):
						print p.text    	
Flux.execute()

	
	
