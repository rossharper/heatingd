rm ~/.forever/heatingd.log
forever start -l heatingd.log index.js
