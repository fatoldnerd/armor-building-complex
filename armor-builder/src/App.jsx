import { AuthProvider } from './contexts/AuthContext';
import ModernArmor from './modern/ModernArmor';
import './modern/armor.css';

export default function App() {
  return <AuthProvider><ModernArmor /></AuthProvider>;
}
