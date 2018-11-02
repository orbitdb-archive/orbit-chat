'use strict'

export function getJsIpfsConfig (datadir) {
  return {
    repo: datadir,
    EXPERIMENTAL: {
      pubsub: true,
      sharding: false,
      dht: false
    },
    config: {
      Addresses: {
        Swarm: ['/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star']
      }
    }
  }
}

export function getGoIpfsConfig () {}
