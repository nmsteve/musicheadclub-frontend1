
import './App.css';
import { Form, Button } from 'react-bootstrap'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers'
import * as web3 from 'web3';
import { MUSICCLUB_ADDR, MUSICCLUB_ABI } from "./constants"

const { ethereum } = window
const provider = new ethers.providers.Web3Provider(ethereum)
const MusicHeadClub = new ethers.Contract(MUSICCLUB_ADDR, MUSICCLUB_ABI, provider)

function App() {

  const [minted, setMinted] = useState()
  const [supply, setSupply] = useState()
  const [owned, setOwned] = useState()
  const [signer, setSigner] = useState()

  const getMintednSupply = async () => {
    const totalSupply = await MusicHeadClub.totalSupply()
    setMinted(totalSupply.toString())
    const MAX_SUPPLY = await MusicHeadClub.MAX_SUPPLY()
    setSupply(MAX_SUPPLY.toString())


  }

  const handleMint = async (event) => {

    event.preventDefault()
    //event.stopPropagation()

    const form = event.currentTarget

    //connect if not connected
    await ethereum.request({ method: 'eth_requestAccounts' })

    //switch to goerli
    const chainId = await ethereum.request({ method: 'eth_chainId' });

    if (chainId !== 5) {

      console.log(ethers.utils.hexlify(5))
      console.log(web3.utils.toHex(5))
    }

    try {

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3.utils.toHex(5) }]
      })


      const signer = provider.getSigner()
      const MusicHeadClub = new ethers.Contract(MUSICCLUB_ADDR, MUSICCLUB_ABI, signer)

      const mintFee = await MusicHeadClub.mintFee()
      const mintAmount = form.mintAmount.value

      const tx = await MusicHeadClub.publicMint(mintAmount, { value: mintAmount * mintFee })
      await tx.wait()


    } catch (error) {
      console.error(error.msg)

    }

    //window.location.reload(false)

    await getMintednSupply()

  }

  const getUserbalance = async () => {

    try {

      //connect if not connected
      await ethereum.request({ method: 'eth_requestAccounts' })

      //set user
      const signer = provider.getSigner()
      setSigner(signer)

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3.utils.toHex(5) }]
      })



      const bal = await MusicHeadClub.balanceOf(await signer.getAddress())
      setOwned(bal.toString())

    } catch (error) {
      console.error(error)
    }

  }

  useEffect(() => {

    getMintednSupply()
    getUserbalance()

  }, [signer])


  return (
    <div className="App">
      <header className="App-header">
        <Form onSubmit={handleMint}>
          <Form.Group controlId='mintAmount'>
            <Form.Control
              placeholder='5'

            />
          </Form.Group>

          <Button className='mt-3 px-4 fw-bolder' type='submit'>
            Mint
          </Button>

        </Form>
        <p className='mt-3 fs-3 text-primary'>
          {minted} Minted out of {supply}
        </p>
        <p className='mt-3 fs-3 text-primary'>
          You own {owned} NFTs
        </p>


      </header>
    </div>
  );
}

export default App;
