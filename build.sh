#!bin/sh

filename=webodm-plugin-geoman.zip

rm -f ${filename}
set -e
zip -r ${filename} geoman
echo
ls -l ${filename}

