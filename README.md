# health-api-retriever

Web application that uses the 1upHealth API to access test patient data using
the FHIR ​`$everything​` query for a test user from an Electronic Health Record
(EHR) vendor.

## Prerequisites

### Docker

Please ensure that you have a working installation of Docker.
You can locate the relevant instructions for your Operating System at
[the official Docker website](https://docs.docker.com/install).


### Web Browser

Please use the latest version of Google Chrome or Mozilla Firefox

## Building

Please navigate to the root directory of this project in a Terminal session.
Execute the following to build the Docker image named `health-api-retriever`

```
./build.sh
```

## Running

Please navigate to the root directory of this project in a Terminal session.
Execute the following script to run the Docker image named `health-api-retriever`

```
./run.sh
```

Navigate to [`http://localhost:9001`](http://localhost:9001) in your chosen browser to access the application.

To terminate the application, please use the same Terminal session to simply send
a `SIGINT` to it via the `Ctrl-C` key press.