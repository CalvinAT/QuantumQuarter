import logo from './asset/qq-logo.png';
import './Main.css';

function Main() {
  return (
    <div className="Main">
      <header className="Header">
        <img src={logo} className="Header-logo" alt="logo" />
        <a href="www.google.com">
          Property
        </a>
        <a href="www.google.com">
          Mortgage Simulation
        </a>
        <a href="www.google.com">
          Join Us
        </a>
        <a href="www.google.com">
          About Us
        </a>
          
      </header>
    </div>
  );
}

export default Main;
