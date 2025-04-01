#!/bin/bash

set -o errexit -o nounset -o pipefail

test_for_mysql() {
    mysql -h "${MYSQL_DB_HOST}" -P "${MYSQL_DB_PORT}" -u "${MYSQL_USER}" -p"${MYSQL_PASSWORD}" -D "${MYSQL_DATABASE}" -e "SELECT 1" > /dev/null
    return $?
}
until test_for_mysql; do
    >&2 echo "MySQL is unavailable - sleeping"
    sleep 1
done

python manage.py makemigrations --noinput
python manage.py migrate --noinput
python manage.py collectstatic --noinput

python manage.py runserver 0.0.0.0:8000 --insecure