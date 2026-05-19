import { useState } from 'react';
import { KeyboardIntro } from './components/KeyboardIntro';
import MainPage from './pages/MainPage';

function App() {
  const [phase, setPhase] = useState('intro');
  return phase === 'intro'
    ? <KeyboardIntro onComplete={() => setPhase('main')} />
    : <MainPage />;
}

export default App;
