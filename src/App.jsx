import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

import './App.css'
import { Messages } from './components/Messages';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [conversationMode, setConversationMode] = useState('DEBATIENDO');
  const [conversationId, setConversationId] = useState(uuidv4());
  const [waitingForValues, setWaitingForValues] = useState(false);
  const [idea, setIdea] = useState('');
  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  function convertirAJSON(mensaje) {
    // Dividir el mensaje en las tres partes usando el texto entre los dos puntos y los guiones
    const partes = mensaje.split('-');

    // Limpiar las partes eliminando espacios adicionales al principio y al final
    const limpiarParte = parte => parte.trim().replace(/^.*?:/, '');
    const partesLimpias = partes.map(limpiarParte).filter(Boolean);

    // Crear un objeto con las partes
    const jsonData = [
      { text: partesLimpias[0], selected: false },
      { text: partesLimpias[1], selected: false },
      { text: partesLimpias[2], selected: false },
    ];

    return jsonData;
  }

  const sendMessage = async (value) => {
    console.log(value, inputValue);
    const response = await fetch('http://172.16.17.106:3000/compliant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ conversationId, message: value ? value + " valores y criterios: user friendly, rapida, divertida" : inputValue, mode: conversationMode })
    });
    const data = await response.json();
    if (conversationMode == "CONCRETANDO") {
      setOptions(options => [...options, convertirAJSON(data.content)]);
      setShowOptions(true);
    }
    setMessages((messages) => [...messages, data]);
    setInputValue('');



    const myElement = document.getElementById("chat");
    myElement.scrollTop = myElement.scrollHeight;

  }


  const handleInputSubmit = (event) => {
    event.preventDefault();
    console.log(waitingForValues);
    if (waitingForValues) {
      setIdea(idea => idea + " Valores: " + inputValue);
      setWaitingForValues(false);
      setMessages(messages => [...messages, { role: 'user', content: inputValue }]);
      setInputValue('');
      return sendMessage(idea);
    }
    if (!conversationStarted && conversationMode == "CONCRETANDO") {
      setConversationStarted(true);

      setIdea("Idea: " + inputValue);

      setTimeout(() => {
        setMessages([{ role: 'user', content: inputValue }, { role: 'assistant', content: 'Estoy analizando tu idea, por favor escribe los valores y criterios que la rigen.' }]);
      }, 1000);

      setWaitingForValues(true);
      setInputValue('');
      return;
    }

    if (!conversationStarted) setConversationStarted(true);
    sendMessage();
    setMessages([...messages, { role: 'user', content: inputValue }]);
    setInputValue('');
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  const handleCleanConversation = () => {
    setMessages([]);
    setConversationStarted(false);
    setWaitingForValues(false);
    setIdea('');
    setOptions([]);
    setShowOptions(false);

    setConversationId(uuidv4());
  }

  const handleOptionSelected = (event) => {
    const params = event.target.id.split('-');
    const option = options[params[0]][params[1]];

    option.selected = true;

    const updatedOptions = [...options]; // Hacer una copia del arreglo original
    updatedOptions[params[0]][params[1]] = option; // Actualizar la propiedad selected del elemento deseado en la copia
    setOptions(updatedOptions); // Actualizar la variable de estado con la copia actualizada

    if (params[1] == 0) {
      return setInputValue(option.text + ' - Mi respuesta: ');
    }

    console.log(option);
    sendMessage(option);

  }

  const handleConversationModeChange = () => {
    handleCleanConversation();
    if (conversationMode == 'DEBATIENDO') {
      setConversationMode('CONCRETANDO');
      document.documentElement.style.setProperty('--accent', '#08C71B');
      document.documentElement.style.setProperty('--prompt-border', 'rgba(166, 232, 173, 0.60)');
      document.documentElement.style.setProperty('--prompt-background', 'linear-gradient(128deg, rgba(84, 203, 96, 0.24) 6.4%, rgba(121, 217, 119, 0.04) 99.16%)');
      document.documentElement.style.setProperty('--prompt-shadow', 'rgba(8, 27, 97, 0.40)');
      document.documentElement.style.setProperty('--prompt-outline', 'rgba(218, 255, 221, 0.60)');
      document.documentElement.style.setProperty('--background-gradient', 'linear-gradient(180deg, #EEFBF0 1.56%, #F2F2F2 14.69%, #E7F9E8 26.27%, #F9FFFA 38.2%, #FEFFFE 76.62%, #D9EFDE 100%)');
      document.documentElement.style.setProperty('--circle', 'radial-gradient(50% 50% at 50% 50%, rgba(64, 213, 51, 0.20) 0%, rgba(54, 181, 67, 0.00) 100%)');
      document.documentElement.style.setProperty('--eris-background', 'linear-gradient(128deg, rgba(86, 207, 83, 0.24) 6.4%, rgba(125, 237, 130, 0.16) 99.16%)');
      document.documentElement.style.setProperty('--eris-border', 'rgba(92, 195, 96, 0.60)');
      document.documentElement.style.setProperty('--dark-accent', '#0E7F19');
    } else {
      setConversationMode('DEBATIENDO')
      document.documentElement.style.setProperty('--accent', '#1b4af0');
      document.documentElement.style.setProperty('--prompt-border', 'rgba(231, 236, 254, 0.60)');
      document.documentElement.style.setProperty('--prompt-background', 'linear-gradient(128deg, rgba(88, 195, 255, 0.24) 6.4%, rgba(129, 202, 255, 0.04) 99.16%)');
      document.documentElement.style.setProperty('--prompt-shadow', 'rgba(8, 27, 97, 0.40)');
      document.documentElement.style.setProperty('--prompt-outline', 'rgba(231, 236, 254, 0.60)');
      document.documentElement.style.setProperty('--background-gradient', 'linear-gradient(180deg, #EEF1FB 1.56%, #F2F2F2 14.69%, #E7EBF9 26.27%, #F9FAFF 38.2%, #FEFEFF 76.62%, #D9DEEF 100%)');
      document.documentElement.style.setProperty('--circle', 'radial-gradient(50% 50% at 50% 50%, rgba(6, 60, 252, 0.20) 0%, rgba(73, 109, 235, 0.00) 100%)');
      document.documentElement.style.setProperty('--eris-background', 'linear-gradient(128deg, rgba(93, 123, 231, 0.24) 6.4%, rgba(114, 144, 250, 0.16) 99.16%)');
      document.documentElement.style.setProperty('--eris-border', 'rgba(92, 115, 195, 0.60)');
      document.documentElement.style.setProperty('--dark-accent', '#173397');
    }
  }

  return (
    <>
      <div className='circle'>

      </div>
      <div className='topBlur'></div>
      <main>
        <svg className='backIcon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <g>
            <path d="M177.81,121.29c6.94,8.26,14.33,21.41,10.88,37.7-14.28,4.02-29.58,3.21-43.28-2.34-5.99-2.41-7.57-10.64-9.25-19.36-1.83-9.51-3.72-19.33-11.79-23.99-.25-.14-.51-.29-.78-.43l-9.04-4.63-.05,.26,.43,.72,.37,.62h0s4.05,6.86,4.05,6.86c6.7,11.34,8.09,36.43-.52,55.72-4.32,9.68-13.04,22.17-30.16,27.57-10.94-9.36-17.83-21.92-19.44-35.57-.72-5.96,6.25-11.34,13.65-17.04,8.04-6.2,16.35-12.6,16.71-21.32,.02-.28,.03-.56,.02-.85l-.15-9.42-.29,.06-.43,.64-.42,.63h0s-4.46,6.64-4.46,6.64c-7.35,10.95-29.64,24.55-52.85,27.43-11.28,1.39-27.4,.71-41.05-10.19,3.34-13.38,11.76-25.13,23.84-33.23,5.26-3.55,13.82-.7,22.89,2.33,9.87,3.29,20.06,6.69,28.48,2.63,.27-.13,.54-.26,.81-.41l8.89-4.86-.19-.15h0l-.9-.03-.83-.03-8.45-.23c-14.04-.37-38.03-11.31-52.34-28.33-6.94-8.26-14.33-21.41-10.89-37.7,14.29-4.02,29.59-3.21,43.29,2.34,5.98,2.41,7.57,10.65,9.25,19.37,1.83,9.5,3.72,19.31,11.78,23.97h0c.26,.15,.52,.3,.79,.43l9.04,4.62,.04-.25-.42-.71h0s-.37-.63-.37-.63l-4.07-6.86c-6.7-11.34-8.09-36.43,.52-55.72,4.32-9.68,13.04-22.17,30.16-27.57,10.93,9.35,17.83,21.92,19.45,35.57,.72,5.96-6.26,11.34-13.65,17.03-8.05,6.2-16.36,12.61-16.72,21.34-.02,.28-.03,.56-.02,.85l.15,9.41,.29-.06,.43-.64,.42-.63h0s4.46-6.63,4.46-6.63h0c7.34-10.96,29.63-24.56,52.85-27.44,11.27-1.39,27.4-.71,41.05,10.19-3.34,13.38-11.76,25.14-23.83,33.25-5.26,3.55-13.82,.69-22.89-2.34-9.87-3.29-20.06-6.7-28.47-2.64h0c-.28,.13-.55,.26-.82,.42l-8.88,4.86-.27,.14h.45s0,0,0,0l.88,.03,.82,.03h0l8.47,.22c14.03,.37,38.03,11.31,52.34,28.33Z" />
          </g>
        </svg>
        <div id='chat' style={{ width: '100%', overflowY: 'scroll', padding: '5rem 2rem', paddingTop: '2rem' }}>
          <div>
            <h2 style={{ textAlign: 'center' }}>ERIS está</h2>
            <div onClick={handleConversationModeChange} className='buttonConversation' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ height: '1.25rem', marginRight: '0.5rem', transform: 'rotate(180deg)', opacity: conversationMode == "CONCRETANDO" ? "100%" : "0%" }} viewBox="0 0 30 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 28L0.75 0.287186L0.75 55.7128L30 28Z" fill="black" />
              </svg>
              <h1 style={{ textAlign: 'center' }}>{conversationMode}</h1>
              <svg style={{ height: '1.25rem', marginLeft: '0.5rem', opacity: conversationMode == "DEBATIENDO" ? "100%" : "0%" }} viewBox="0 0 30 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 28L0.75 0.287186L0.75 55.7128L30 28Z" fill="black" />
              </svg>
            </div>
          </div>
          {showOptions ?
            options.map((opciones, row) => (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <div className='optionContainer' style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  margin: '1rem 0',
                  width: '100%',
                }}>
                  {opciones.map((option, index) => {
                    if (!option.text) return;
                    return (
                      <div id={row + '-' + index} onClick={handleOptionSelected} className={(option.selected ? 'erisMessage ' : 'ownMessage ') + 'message option'} key={index}>
                        <p style={{ textAlign: 'center', fontWeight: 'bold!important' }}>{option.text}</p>
                      </div>
                    )
                  })}
                </div>
                <p style={{ margin: 0 }}>O proporcioname otra idea</p>
              </div>
            ))

            : <Messages messages={messages} />}
        </div>
        <form className="prompt" onSubmit={handleInputSubmit}>
          <input
            placeholder={
              waitingForValues ?
                'Escribe tus valores' :
                conversationMode == "CONCRETANDO" ?
                  'Escribe tu idea' :
                  'Escribe tu argumento'
            }
            type="text"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button type="submit">
            <svg viewBox="0 0 106 106" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M53 0C23.7289 0 0 23.7289 0 53C0 82.2711 23.7289 106 53 106C82.2711 106 106 82.2711 106 53C106 23.7289 82.2711 0 53 0ZM28.1206 63.1866L48.8415 29.0636C50.7923 25.8511 55.457 25.8587 57.3974 29.0774L77.9503 63.1708C81.4442 68.9663 75.4981 75.8537 69.2548 73.2428L55.0529 67.3038C53.8228 66.7894 52.4382 66.7876 51.2067 67.2988L36.7879 73.2849C30.5358 75.8805 24.607 68.9729 28.1206 63.1866Z" />
            </svg>
          </button>
          <button type='reset' id='reset' style={{
            position: 'absolute',
            right: '0',
            top: '-3rem',
          }}
            onClick={handleCleanConversation}
          >
            <svg width="106" height="106" viewBox="0 0 106 106" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path style={{ fill: "var(--dark-accent)" }} fillRule="evenodd" clipRule="evenodd" d="M53 0C23.7289 0 0 23.7289 0 53C0 82.2711 23.7289 106 53 106C82.2711 106 106 82.2711 106 53C106 23.7289 82.2711 0 53 0ZM24.5817 41.1273L33.4406 18.7666L38.3476 27.077C53.0485 19.015 71.6316 23.8925 80.419 38.3659C89.4519 53.2435 84.7137 72.6269 69.8361 81.6597C54.9585 90.6925 35.5755 85.9546 26.5425 71.0772L34.1402 66.4643C40.3938 76.7642 54.1222 79.8566 64.8036 73.3715C75.485 66.8864 79.0745 53.2794 72.821 42.9795C66.7845 33.0371 53.7831 29.8105 43.2805 35.4314L48.4401 44.1696L24.5817 41.1273Z" />
            </svg>
          </button>
        </form>
      </main>
    </>
  )
}

export default App
