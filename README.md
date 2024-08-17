# Demo


# How to run

1. clone the repo `git clone https://github.com/scape76.com/product-filtering-example`
1. install dependencies `pnpm install`
1. create a .env file using .env.example
2. run `./start-database.sh` . This will create a new docker container and run it on specified (in .env) port
  2. 1. if you don't have docker engine installed, see [this](https://docs.docker.com/engine/install/) 
3. run `pnpm db:seed-cozy` to seed the database
4. start the app `pnpm dev`

5. play around with it, I don't think my implementation is  the best one could think of, so pull requests are exteremely welcome!