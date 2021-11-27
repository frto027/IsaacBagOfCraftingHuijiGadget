@echo clean...
@rmdir /S /Q out
@echo create directory...
@mkdir out
@echo generate js data for itemconfig/itempools
@python gen.py
@echo js data to json data
@node compress.js
@echo generate js file
@node gen.js --debug
@node gen.js