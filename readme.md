# Project Title

Thought process -

1. Due to the time constraint, I developed a simple MVP version of the app.
2. I started by investigating how hl7 worked and the corelation between the metric csv provided.
3. I researched freely available hl7 parsing libraries which would be useful during the upload process.
4. To better visualize the flow, I drew a simple flow diagram for the entire process. I will attach it below.
5. To understand the entity better, I then brainstormed the entites that would be involved in diagnosis domain. Some of the major entities are - patient, treatment, diagnosis, test_metrics, obx_test_result, report.
6. I thought about what would be appropriate architecture for this small project. I questioned - Do I need to push it to s3 ? If I upload directly to server, would i bring complication of stateful server and having to mount elastic file system in the server? How much time can i implementing direct upload? Should I run the file parsing and evaluation in worker process and not block the server (maybe not with the given time)?
7. After thinking through, I tried to strike a balance with the architecture of the applicatoin. There would be no complex WS, worker process processing uploaded file, no s3 for the MVP. I instead uploaded and parsed the file in two different requests, which breaks down big operation and also become fault tolerant. If in case the file was uploaded successfully but parsing failed , the client can retry only the parsing part independently.
8. In the backend, I have created a simple expres REST API server which exposes two endpoints. One for upload and another to get test_result.

![alt text](image.png)
![alt text](image-1.png)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

Instructions on how to install and set up the project.

```bash
# Example command
1. Clone the repo and run npm install in both client and backend folder.
2. Run the backend using npm run dev in the backend folder and then run the client by using same command in client folder.
```

## Usage

Examples of how to use the project.

```bash
# Example usage
npm start
```

## Contributing

Contributions are welcome! Please follow the [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).
