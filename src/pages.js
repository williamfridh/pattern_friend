const {render} = wp.element;
import App from './App';

if (document.getElementById('my-react-app')) {
    render(<App/>, document.getElementById('my-react-app'));
}

