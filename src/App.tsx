import './App.css';
import Spinner from './components/Spinner';
import { DataProvider } from './context/DataContext';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => {

  return (
    <>
      {
        false ? <Spinner /> :
          <DataProvider>
            <AppRoutes />
          </DataProvider>
      }
    </>
  );
};

export default App;
