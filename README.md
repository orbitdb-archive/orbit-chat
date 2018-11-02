### Run go-ipfs on docker

Start the node:

    docker run -d \
      --name ipfs_host \
      -v ipfs_staging:/export \
      -v ipfs_data:/data/ipfs \
      -p 4001:4001 \
      -p 127.0.0.1:8080:8080 \
      -p 127.0.0.1:5001:5001 \
      ipfs/go-ipfs:latest \
        --enable-pubsub-experiment

Configure the node to accept requests from browser:

    docker exec ipfs_host \
      ipfs config \
        --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'

    docker exec ipfs_host \
      ipfs config \
        --json API.HTTPHeaders.Access-Control-Allow-Methods '["GET", "PUT", "POST"]'

    docker exec ipfs_host \
      ipfs config \
        --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
