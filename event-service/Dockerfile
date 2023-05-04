FROM php:8.2-fpm-alpine

ARG user
ARG uid

RUN apk add --no-cache $PHPIZE_DEPT \
    build-base \
    doas \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    linux-headers \
    icu-dev \
    zip \
    unzip \
    autoconf \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install pdo_mysql exif pcntl bcmath gd intl \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create a group and user
RUN adduser $user -G wheel; \
    echo 'test1234' | chpasswd; \
    echo 'permit :wheel as root' > /etc/doas.d/doas.conf

# Tell docker that all future commands should run as the appuser user
USER $user

RUN mkdir -p /home/$user/.composer && \
    chown -R $user:wheel /home/$user

WORKDIR /var/www
