import './App.css';
import { MetaMaskProvider } from './components/MetaMaskProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className='container'>
          <MetaMaskProvider >
            
              <h6 className='mt-5'> HERE YOUR APP HAS ACCESS TO ALL METAMASK INTERACTION</h6>
         
          </MetaMaskProvider>
        </div>
      </header>
    </div>
  );
}

export default App;
