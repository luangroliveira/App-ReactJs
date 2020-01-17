import React, { useState, useEffect } from 'react';
import api from '../services/api'
//css
import '../css/Global.css';
import '../css/App.css';
import '../css/Sidebar.css';
import '../css/Main.css';

function App() {

    const [devs, setDevs] = useState([]);
    const [github_username, setGithubUsername] = useState('');
    const [techs, setTechs] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLatitude(latitude);
                setLongitude(longitude);
            },
            (error) => {
                console.log(error);
            },
            {
                timeout: 30000,
            }
        );
    }, []);

    async function loadDevs() {
        const response = await api.get('/devs');
        setDevs(response.data);
    }

    useEffect(() => {       
        loadDevs();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        const response = await api.post('/devs', {
            github_username,
            techs,
            latitude,
            longitude
        });
        setGithubUsername('');
        setTechs('');
        loadDevs();
    }

    return (
        <div id="app" >
            <aside>
                <strong> Cadastrar </strong>
                <form onSubmit={handleSubmit}>
                    <div className='input-block'>
                        <label htmlFor='github_username'>Usuário do GitHub</label>
                        <input
                            name='github_username'
                            id='github_username'
                            required
                            value={github_username}
                            onChange={event => setGithubUsername(event.target.value)}
                        />
                    </div>

                    <div className='input-block'>
                        <label htmlFor='techs'>Tecnologias</label>
                        <input
                            name='techs'
                            id='techs'
                            required
                            value={techs}
                            onChange={event => setTechs(event.target.value)}
                        />
                    </div>
                    <div className='input-group'>
                        <div className='input-block'>
                            <label htmlFor='latidude'>latidude</label>
                            <input
                                type='number'
                                name='latidude'
                                id='latidude'
                                value={latitude}
                                required
                                onChange={event => setLatitude(event.target.value)}
                            />
                        </div>
                        <div className='input-block'>
                            <label htmlFor='longitude'>longitude</label>
                            <input
                                type='number'
                                name='longitude'
                                id='longitude'
                                value={longitude}
                                required
                                onChange={event => setLongitude(event.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit">Salvar</button>
                </form>
            </aside>
            <main >
                <ul>
                    {devs.map(dev => (
                        <li key={dev._id} className='dev-item' >
                            <header>
                                <img src={dev.avatar_url} alt="avatar-dev" />
                                <div className="user-info">
                                    <strong>{ dev.github_username }</strong>
                                    <span>{ dev.techs }</span>
                                </div>
                            </header>
                            <p>
                            { dev.bio }
                            </p>
                            <a href={ `https://www.github.com/${dev.github_username}` } target="blank">Acessar perfi no Github</a>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}

export default App;