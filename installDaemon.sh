#forever-service install heatingd -s index.js --start -r pi

pm2 start index.js  --name heatingd -l ~/homecontrol/logs/heatingd -- -x
pm2 save
