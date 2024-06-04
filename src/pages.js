const {render} = wp.element
import App from './App'
import './styles/pages.css'

const appElement = document.getElementById('pf-react-app');

if (appElement) {
    render(<App />, appElement);
}

