import "../styles/pages/Home.css"

import { useNavigate } from "react-router-dom"

import Button from "../components/ui/Button"
import Modal from "../components/ui/Modal"
import { useState, useRef, useEffect } from "react"

const Home = () => {
    const navigate = useNavigate()

    const [objectToFind, setObjectToFind] = useState("")
    const [chanceTheBlindUserClicksTheButton, setChanceTheBlindUserClicksTheButton] = useState(true)
    const [isBlind, setIsBlind] = useState(true)
    const [isBlindModal, setIsBlindModal] = useState(true)
    const recognitionRef = useRef()


    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition()
            recognition.continuous = false
            recognition.lang = "en-US"

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript
                setObjectToFind(transcript)
                console.log("You said:", transcript)
            }

            recognition.onerror = (e) => {
                console.error("Speech recognition error:", e)
            }

            recognitionRef.current = recognition
        } else {
            alert("Speech recognition not supported in this browser.")
        }
    }, [])

    /* useEffect(() => {
        if (introduction) {
            speak("Welcome to Proximity Pal. Say the name of the object you want to find, then press Start. Or press the mic button to speak.")
            setIntroduction(false)
        }
    }) */
    
    /* const uiPref = () => {
        speak("Press the button if you are visually impaired but not blind. If you are blind, please wait a few seconds...")
    } */

    useEffect(() => {
        let timer
    
        if (isBlindModal) {
            timer = setTimeout(() => {
                setIsBlind(true)
                setIsBlindModal(false)
            }, 1000)
        }
    
        return () => clearTimeout(timer)
    }, [isBlindModal])

    const blindInstructions = () => {
        speak("Tap the top of the screen in order to say the object you are trying to find. Tap the middle of the screen in order to find the object. Tap the bottom of the screen to repeat the instructions again.")
    }

    const visuallyImpairedInstructions = () => {
        speak("Type the object or press the speak button to say the object you are trying to find., then press Start. Press the help button to repeat the instructions.")
    }
    

    const startListening = () => {
        recognitionRef.current?.start()
    }

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "en-US"
        window.speechSynthesis.speak(utterance)
    }

    const findItem = () => {
        navigate("/search", { state: { objectToFind } })
    }

    return(
        <>
            {isBlindModal && (
                <Modal isOpen={isBlindModal} onClose={() => {setIsBlindModal(false)}} 
                    children={(
                        <div className="is-blind">
                            <h1>Are you Blind?</h1>
                            <p>If you are visually impaired but are not blind, react to the button to switch the layout. 
                                Blind Users will have to wait a few seconds to activate Blind Mode.</p>
                            <Button title={"I am not Blind"} onClick={() => {
                                setIsBlind(false)
                                setIsBlindModal(false)
                            }}/>
                        </div>
                    )}
                />
            )}  
            {isBlind ? (
                <>{chanceTheBlindUserClicksTheButton && !isBlindModal && (
                    <button className="begin-button" onClick={() => {blindInstructions(); setChanceTheBlindUserClicksTheButton(false)}}></button>
                )}
                <div className="home-container-blind">
                    <div className="prompt-blind">
                        <input 
                            type="text" 
                            value={objectToFind} 
                            onChange={(e) => setObjectToFind(e.target.value)} 
                        />
                    </div>
                    <div className="buttons-blind">
                        <button onClick={startListening}>🎙️</button>
                        <button onClick={findItem}>Start</button>
                        <button onClick={() => {blindInstructions()}}>❓</button>

                    </div>
                </div> </>
            ): (
                <div className="home-container">
                    <div className="title">
                        <h1>Proximity Pal</h1>
                    </div>
                    <div className="prompt">
                        <h2>Type the object or press the speak button to say the object you are trying to find.</h2>
                        <input 
                            type="text" 
                            value={objectToFind} 
                            onChange={(e) => setObjectToFind(e.target.value)} 
                        />
                        <Button title="Speak" onClick={startListening} />
                    </div>
                    <div className="buttons">
                        <Button title={"Find"} onClick={findItem}/>
                        <Button 
                            title="Help" 
                            onClick={() => visuallyImpairedInstructions()}
                        />
                    </div>
                </div> 
            )}
                     
        </>
    )
}

export default Home