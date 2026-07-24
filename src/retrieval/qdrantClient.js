import { QdrantClient } from "@qdrant/js-client-rest";

// Connect to local Qdrant running in Docker
const qdrant = new QdrantClient({ host: "localhost", port: 6333 });

export default qdrant;
