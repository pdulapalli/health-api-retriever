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

---

## Potential Enhancements

### Caching

Would like to use caching to improve lookup performance for paginated query results.

The goal is to store JSON documents returned by the query, which have varying structures.
Since a predictable schema would be too rigid for these documents, a table in a relational
database would not be an appropriate match.

The store would best be accomplished with either Redis or AWS DynamoDB, for these reasons:

* They both support a key-value mapping
* They are both readily scalable; Redis clusters can be expanded and DynamoDB's
read/write provisioning capacity can be increased.
* They both accommodate time-to-live (TTL) so that stale values can expire

### Hosting/Deployment

To centralize access to this application, it would make sense to host it on the public web.

In embracing the spirit of container-based execution, a viable pathway is to use an application
container-scaling platform, like AWS Elastic Container Service (ECS). Another approach is to use a
Kubernetes cluster, but this requires the cluster and its nodes to be configured.

The resulting application can be placed behind a load balancer, with this centralized point
being exposed. Supposing AWS ECS is used, this can be accomplished with AWS API Gateway. A formality
would be to register a human-friendly domain beyond that, but that is not strictly necessary.

### UI Frameworks

To better maneuver the many moving parts of the UI, a framework would come in handy. Particularly,
the React.js library can help structure these pieces into components. Ordinarily, a framework might
be too cumbersome, but with this application, there may be several performance benefits.

With a component-oriented library like React, page re-renderings can be tailored closer to just the
components that change. When displaying large amounts of content as with this application, having
fewer browser redraws or reflows is essential for smooth performance.