FROM fluent/fluentd:latest

RUN apk add --update --virtual .build-deps \
	sudo build-base ruby-dev tzdata \
	&& cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
	&& echo "Asia/Tokyo" > /etc/timezone \
	&& sudo gem install fluent-plugin-mongo \
	&& sudo gem sources --clear-all \
	&& apk del .build-deps \
	&& rm -rf /var/cache/apk/* /home/fluent/.gem/ruby/2.5.0/cache/*.gemll
	