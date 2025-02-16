import './Navbar.css';
import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  const handleGallery = () => {
      navigate(`/`);
  };

    return (

        <nav>
          <div className = "logo-header">
            <img id = "ids-logo" src="/ids-nadir.png" alt="ids-logo" onClick={handleGallery}
                style={{ cursor: 'pointer' }}/>
            <h2>Immersion Data Solutions</h2>
          </div>
        </nav>
        
    );
}