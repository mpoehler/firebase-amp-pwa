#!/bin/bash
TARGETFILE=./src/firebaseconfig.ts
APPID=1:562014234949:web:fb262b1dadbed20c25362c

echo 'import firebase from "firebase/app";' > $TARGETFILE
firebase apps:sdkconfig web $APPID | sed '/^===/d' | sed '/^\/\//d' | sed '/^[[:space:]]*$/d' | sed 's/"\(.*\)": \(.*\)/\1: \2/g' >> $TARGETFILE
