# Use the MySQL 8.0.39 image
FROM mysql:8.0.39

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=dGYAwjZeYuAJHBbrcWdPIruLKFfKxUWz
ENV MYSQL_DATABASE=photo_galleryproduction
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=dGYAwjZeYuAJHBbrcWdPIruLKFfKxUWz

# Expose the default MySQL port
EXPOSE 3306
