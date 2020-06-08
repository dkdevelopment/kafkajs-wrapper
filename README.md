# KafkaJs wrapper
Made for easy management of the library with the usage of EventEmitter API.

## Running it
To run demos you need to have `docker, docker-compose and npm` installed.<br />
Before running demo run
```sh
# from root
./demo-setup/start.sh
```
Which will setup the docker for kafka.<br />
Don't forget to run `yarn` before running commands. <br/>

### To run one process demo
```
yarn start:demo:one-process
```

### To run two processes demo with producer and consumer
```
yarn start:demo:two-processes
```

### To run three processes demo with producer and 2 consumers in the same group
They shall be loadbalanced (no duplicate messages should appear)
```
yarn start:demo:1c2p1gid
```

### To run three processes demo with producent and 2 consumers in 2 different groups (microservices pattern)
They shall receive duplicate messages to acknowledge.
```
yarn start:demo:1c2p2gid
```