# Imagen oficial de PHP con servidor embebido
FROM php:8.2-cli

# Copiar todo el proyecto a /var/www/html
COPY . /var/www/html/

# Ir al directorio del proyecto
WORKDIR /var/www/html/

# Exponer el puerto que usará Render
EXPOSE 10000

# Comando para iniciar PHP con servidor interno
CMD ["php", "-S", "0.0.0.0:10000", "-t", "."]
