import { useEffect, useState } from 'react';
import { TabPanel } from '../../components/TabPanel';

interface HomePageProps { }

const HomePage: React.FC<HomePageProps> = () => {

    const [username, setUserName] = useState<string>('');

    useEffect(() => {
        let user = sessionStorage.getItem('user');
        if (user) {
            setUserName(user);
        }
    }, []);

    return (
        <>
            <div style={{width: '100%', textAlign: 'center', padding: '20px'}}>
                <h2>Bienvenido {username.toUpperCase()} </h2>
            </div>
            <TabPanel />
        </>
    );
}

export default HomePage;
