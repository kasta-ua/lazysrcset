CCOPTS = --language_out ECMASCRIPT5 #--jscomp_warning=reportUnknownTypes


min: lazysrcset.min.js


%.min.js: %.js
	closure-compiler $(CCOPTS) $^ > $@
