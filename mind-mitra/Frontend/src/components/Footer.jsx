import { Mail, Github, Linkedin } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-green-700  text-white py-10 px-6 sm:px-12 ">
      <div className="max-w-7xl mx-20 grid grid-cols-1  md:grid-cols-2 gap-10">
        
        <div>
          <h3 className="text-xl font-bold mb-4">MindMitra</h3>
          <ul className="space-y-2">
            <li><NavLink to="/" className="hover:underline">Home</NavLink></li>
            <li><NavLink to="/mood-track" className="hover:underline">Mood Tracker</NavLink></li>
            <li><NavLink to="/journal" className="hover:underline">Journal</NavLink></li>
            <li><NavLink to="/mind-tools" className="hover:underline">Mind Tools</NavLink></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <Mail size={20} />
              <a href="mailto:shreya.nshi2102@gmail.com" className="hover:underline">shreya.nshi2102@gmail.com</a>
            </li>
            <li className="flex items-center gap-3">
              <Linkedin size={20} />
              <a href="https://www.linkedin.com/in/shreyanshi-srivastava-774280295/" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
            </li>
            <li className="flex items-center gap-3">
              <Github size={20} />
              <a href="https://github.com/Shreyanshi210205" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-10 text-sm text-green-100 border-t border-green-600 pt-4">
        &copy; {new Date().getFullYear()} MindMitra. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
