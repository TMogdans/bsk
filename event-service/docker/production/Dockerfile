ARG PHP_EXTS="bcmath ctype fileinfo mbstring pdo pdo_mysql dom pcntl"
ARG PHP_PECL_EXTS="redis"

FROM composer:2.6 as composer_base

ARG PHP_EXTS
ARG PHP_PECL_EXTS

RUN mkdir -p /opt/apps/event-service /opt/apps/event-service/bin

WORKDIR /opt/apps/event-service

RUN apk update \
    && apk add --no-cache --update linux-headers ${PHPIZE_DEPS} \
    && apk add libzip-dev \
       freetype-dev \
       libjpeg-turbo-dev \
       libpng-dev \
    && docker-php-ext-install \
       exif \
       mysqli \
       pdo \
       pdo_mysql \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-install opcache

RUN addgroup -S composer \
    && adduser -S composer -G composer \
    && chown -R composer /opt/apps/event-service \
    && apk add --virtual build-dependencies --no-cache ${PHPIZE_DEPS} openssl ca-certificates libxml2-dev oniguruma-dev \
    && docker-php-ext-install -j$(nproc) ${PHP_EXTS} \
    && pecl install ${PHP_PECL_EXTS} \
    && docker-php-ext-enable ${PHP_PECL_EXTS} \
    && apk del build-dependencies

USER composer

COPY --chown=composer ./../../api/composer.json ./../../api/composer.lock ./

RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

COPY --chown=composer ./../../api .

RUN composer install --no-dev --prefer-dist

FROM php:8.2-alpine as cli

ARG PHP_EXT
ARG PHP_PECL_EXTS

WORKDIR /opt/apps/event-service

RUN apk add --virtual build-dependencies --no-cache ${PHPIZE_DEPS} openssl ca-certificates libxml2-dev oniguruma-dev \
    && docker-php-ext-install -j$(nproc) ${PHP_EXTS} \
    && pecl install ${PHP_PECL_EXTS} \
    && docker-php-ext-enable ${PHP_PECL_EXTS} \
    && apk del build-dependencies

COPY --from=composer_base /opt/apps/event-service /opt/apps/event-service

FROM php:8.2-fpm-alpine as fpm_server

ARG PHP_EXTS
ARG PHP_PECL_EXTS

WORKDIR /opt/apps/event-service

RUN apk add --virtual build-dependencies --no-cache ${PHPIZE_DEPS} openssl ca-certificates libxml2-dev oniguruma-dev \
    && docker-php-ext-install -j$(nproc) ${PHP_EXTS} \
    && pecl install ${PHP_PECL_EXTS} \
    && docker-php-ext-enable ${PHP_PECL_EXTS} \
    && apk del build-dependencies

RUN php artisan event:cache && \
    php artisan route:cache

USER www-data

COPY --from=composer_base --chown=www-data /opt/apps/event-service /opt/apps/event-service



FROM nginx:1.20-alpine as web_server

WORKDIR /opt/apps/event-service

COPY ./../../nginx/conf.d/app.conf /etc/nginx/templates/default.conf.template

FROM cli
