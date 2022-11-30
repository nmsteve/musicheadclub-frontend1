
import './App.css';
import { Form, Button } from 'react-bootstrap'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers'
import { MUSICCLUB_ADDR, MUSICCLUB_ABI } from "./constants"

const { ethereum } = window
const provider = new ethers.providers.Web3Provider(ethereum)
const signer = provider.getSigner()
const MusicHeadClub = new ethers.Contract(MUSICCLUB_ADDR, MUSICCLUB_ABI, signer)



function App() {

  const [minted, setMinted] = useState()
  const [supply, setSupply] = useState()

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

    const mintFee = await MusicHeadClub.mintFee()
    const mintAmount = form.mintAmount.value

    const tx = await MusicHeadClub.publicMint(mintAmount, { value: mintAmount * mintFee })
    await tx.wait()

    //window.location.reload(false)

    await getMintednSupply()

  }

  useEffect(() => {

    getMintednSupply()

  }, [])


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
          </Button> '

        </Form>
        <p className='mt-3 fs-3 text-primary'>
          {minted} Minted out of {supply}
        </p>


      </header>
    </div>
  );
}

export default App;
