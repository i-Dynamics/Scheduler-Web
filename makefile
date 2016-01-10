build:
	- rm consts.js
	echo "export const debug = false\nexport const ws_url = 'wss://a2z-scheduler-dev.herokuapp.com/v1/websocket'\n" > consts.js
	- rm -rf built
	mkdir built
	jspm bundle-sfx app/main built/app.js
	uglifyjs built/app.js -o built/app.min.js
	html-dist index.html --remove-all --minify --insert app.min.js -o built/index.html
	mkdir -p built/images
	cp -r images/* built/images/
	cp loading.css built/loading.css
	mkdir -p built/jspm_packages/npm/font-awesome@4.5.0/fonts
	cp -r jspm_packages/npm/font-awesome@4.5.0/fonts/* built/jspm_packages/npm/font-awesome@4.5.0/fonts/
	- rm consts.js
	echo "export const debug = true\nexport const ws_url = 'ws://localhost:8888/v1/websocket'\n" > consts.js
# deploy:
# 	scp -r -i ~/.ssh/i-Dynamics/idynamics-aws.pem built/* root@54.171.121.214:/var/www/scheduler/
