build:
	debug=$(cat consts.js)
	echo "$debug"
	- rm consts.js
	echo "export const debug = false\nexport const ws_url = 'wss://a2z-scheduler-dev.herokuapp.com/v1/websocket'\n" > consts.js
	- rm -rf build
	mkdir build
	jspm bundle-sfx app/main build/app.js
	./node_modules/.bin/uglifyjs build/app.js -o build/app.min.js
	./node_modules/.bin/html-build index.html --remove-all --minify --insert app.min.js -o build/index.html
	mkdir -p build/images
	cp -r images/* build/images/
	cp loading.css build/loading.css
	mkdir -p build/jspm_packages/npm/font-awesome@4.4.0/fonts
	cp -r jspm_packages/npm/font-awesome@4.4.0/fonts/* build/jspm_packages/npm/font-awesome@4.4.0/fonts/
	- rm consts.js
	echo "$debug" > consts.js
# deploy:
# 	scp -r -i ~/.ssh/i-Dynamics/idynamics-aws.pem build/* root@54.171.121.214:/var/www/scheduler/
