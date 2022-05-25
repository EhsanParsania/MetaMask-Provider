import './App.css';
import { MetaMaskProvider } from './components/MetaMaskProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className='container'>
          <MetaMaskProvider />
        </div>
      </header>
    </div>
  );
}

export default App;
