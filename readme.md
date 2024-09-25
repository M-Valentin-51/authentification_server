# Generate private

`openssl genrsa -out private.pem 2048`

# Generate public

`openssl rsa -in private.pem -pubout > public.pem`

## init data base

` npx prisma migrate dev --name init`
