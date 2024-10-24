import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import Ceramic from '@ceramicnetwork/http-client'
import { DID } from 'dids'

import { web3Modal } from './providers'

const CERAMIC_URL = process.env.CERAMIC_API || 'http://localhost:7007'

const threeIdConnect = new ThreeIdConnect('local')

const authenticate = async () => {
  const ethProvider = await web3Modal.connect()
  const addresses = await ethProvider.enable()

  const authProvider = new EthereumAuthProvider(ethProvider, addresses[0])
  await threeIdConnect.connect(authProvider)

  const ceramic = new Ceramic(CERAMIC_URL)
  const did = new DID({
    provider: threeIdConnect.getDidProvider(),
    resolver: ThreeIdResolver.getResolver(ceramic),
  })

  await did.authenticate()
  console.log(did.id)

  const jws = await did.createJWS({ hello: 'world' })
  console.log(jws)

  window.ceramic = ceramic
  window.did = did.id
}

document.getElementById('bauth').addEventListener('click', authenticate)
